<?php

namespace Tests\Feature\Portal;

use App\Models\CensusCampaign;
use App\Models\CensusRecord;

class CensusTest extends PortalTestCase
{
    private function campaign(string $status = CensusCampaign::STATUS_OPEN, $area = null): CensusCampaign
    {
        $campaign = CensusCampaign::query()->create([
            'name' => 'Youth Census 2026',
            'starts_on' => '2026-10-01',
            'geographic_area_id' => $area?->id,
        ]);
        $campaign->forceFill(['status' => $status])->save();

        return $campaign;
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'geographic_area_id' => $this->payamA1->id,
            'full_name' => 'Nyandeng Chol',
            'sex' => 'female',
            'date_of_birth' => now()->subYears(22)->toDateString(),
            'age_years' => null,
            'phone' => '+211 912 000 111',
            'education_level' => 'secondary',
            'in_school' => false,
            'employment_status' => 'unemployed',
            'occupation' => null,
            'skills' => 'Tailoring',
            'disability' => 'none',
            'displacement_status' => 'idp',
        ], $overrides);
    }

    public function test_enumerator_records_inside_their_area_only(): void
    {
        $campaign = $this->campaign();
        $enumerator = $this->userWithRole('census_enumerator', $this->countyA);

        $this->actingAs($enumerator)->post(route('admin.census.records.store', $campaign), $this->payload())->assertSessionHasNoErrors();
        $this->assertSame($enumerator->id, CensusRecord::query()->first()->enumerator_id);

        $this->actingAs($enumerator)->post(route('admin.census.records.store', $campaign), $this->payload([
            'geographic_area_id' => $this->countyB->id, 'full_name' => 'Someone Else',
        ]))->assertForbidden();
    }

    public function test_records_cannot_be_entered_when_campaign_is_not_open(): void
    {
        $campaign = $this->campaign(CensusCampaign::STATUS_CLOSED);

        $this->actingAs($this->userWithRole('census_enumerator', $this->countyA))
            ->post(route('admin.census.records.store', $campaign), $this->payload())
            ->assertSessionHasErrors('campaign');
    }

    public function test_out_of_range_ages_are_rejected(): void
    {
        $campaign = $this->campaign();

        $this->actingAs($this->userWithRole('census_enumerator', $this->countyA))
            ->post(route('admin.census.records.store', $campaign), $this->payload(['date_of_birth' => now()->subYears(50)->toDateString()]))
            ->assertSessionHasErrors('date_of_birth');
    }

    public function test_likely_duplicates_need_confirmation(): void
    {
        $campaign = $this->campaign();
        $enumerator = $this->userWithRole('census_enumerator', $this->countyA);

        $this->actingAs($enumerator)->post(route('admin.census.records.store', $campaign), $this->payload());
        $this->actingAs($enumerator)->post(route('admin.census.records.store', $campaign), $this->payload(['full_name' => 'nyandeng chol']))
            ->assertSessionHasErrors('duplicate');
        $this->actingAs($enumerator)->post(route('admin.census.records.store', $campaign), $this->payload(['confirm_not_duplicate' => true]))
            ->assertSessionHasNoErrors();

        $this->assertSame(2, CensusRecord::query()->count());
    }

    public function test_supervisor_reviews_but_not_their_own_records(): void
    {
        $campaign = $this->campaign();
        $supervisor = $this->userWithRole('census_supervisor', $this->countyA);
        $enumerator = $this->userWithRole('census_enumerator', $this->countyA);

        $this->actingAs($enumerator)->post(route('admin.census.records.store', $campaign), $this->payload());
        $record = CensusRecord::query()->firstOrFail();

        $this->actingAs($supervisor)->post(route('admin.census.records.reject', $record))->assertSessionHasErrors('note');
        $this->actingAs($supervisor)->post(route('admin.census.records.reject', $record), ['note' => 'Check the payam'])->assertSessionHasNoErrors();
        $this->assertSame(CensusRecord::STATUS_REJECTED, $record->fresh()->status);

        // The enumerator's correction goes back for review
        $this->actingAs($enumerator)->put(route('admin.census.records.update', $record), $this->payload(['payam' => 'x']))->assertSessionHasNoErrors();
        $this->assertSame(CensusRecord::STATUS_SUBMITTED, $record->fresh()->status);

        $this->actingAs($supervisor)->post(route('admin.census.records.approve', $record))->assertSessionHasNoErrors();
        $this->assertSame(CensusRecord::STATUS_APPROVED, $record->fresh()->status);

        $this->actingAs($supervisor)->post(route('admin.census.records.store', $campaign), $this->payload(['full_name' => 'Own Entry']));
        $own = CensusRecord::query()->where('full_name', 'Own Entry')->firstOrFail();
        $this->actingAs($supervisor)->post(route('admin.census.records.approve', $own))->assertForbidden();
    }

    public function test_sensitive_fields_and_reports_need_their_own_permission(): void
    {
        $campaign = $this->campaign();
        $enumerator = $this->userWithRole('census_enumerator', $this->countyA);
        $this->actingAs($enumerator)->post(route('admin.census.records.store', $campaign), $this->payload());
        $record = CensusRecord::query()->firstOrFail();
        $record->forceFill(['status' => CensusRecord::STATUS_APPROVED])->save();

        // Enumerator: can see their record but not its sensitive answers, and no reports
        $this->actingAs($enumerator)->get(route('admin.census.records.show', $record))
            ->assertOk()->assertInertia(fn ($page) => $page->where('record.sensitive', null));
        $this->actingAs($enumerator)->get(route('admin.census.show', $campaign))
            ->assertInertia(fn ($page) => $page->where('report', null)->has('records.data', 1));

        // County supervisor: reports, but no sensitive breakdown
        $supervisor = $this->userWithRole('census_supervisor', $this->countyA);
        $this->actingAs($supervisor)->get(route('admin.census.show', $campaign))
            ->assertInertia(fn ($page) => $page->where('report.total', 1)->where('report.sensitive', null)->where('report.byCounty.0.label', 'County A'));

        // Super admin holds census.sensitive state-wide
        $this->actingAs($this->userWithRole('super_admin'))->get(route('admin.census.records.show', $record))
            ->assertInertia(fn ($page) => $page->where('record.sensitive.displacement_status', 'Internally displaced (IDP)'));
    }

    public function test_other_counties_cannot_see_records(): void
    {
        $campaign = $this->campaign();
        $this->actingAs($this->userWithRole('census_enumerator', $this->countyA))
            ->post(route('admin.census.records.store', $campaign), $this->payload());
        $record = CensusRecord::query()->firstOrFail();

        $other = $this->userWithRole('census_supervisor', $this->countyB);
        $this->actingAs($other)->get(route('admin.census.records.show', $record))->assertForbidden();
        $this->actingAs($other)->get(route('admin.census.show', $campaign))
            ->assertInertia(fn ($page) => $page->has('records.data', 0)->where('report.total', 0));
    }

    public function test_census_pages_render(): void
    {
        $admin = $this->userWithRole('super_admin');
        $campaign = $this->campaign();
        $this->actingAs($admin)->post(route('admin.census.records.store', $campaign), $this->payload());
        $record = CensusRecord::query()->firstOrFail();

        foreach ([
            [route('admin.census.index'), 'admin/census/index'],
            [route('admin.census.show', $campaign), 'admin/census/show'],
            [route('admin.census.records.create', $campaign), 'admin/census/records/form'],
            [route('admin.census.records.show', $record), 'admin/census/records/show'],
            [route('admin.census.records.edit', $record), 'admin/census/records/form'],
        ] as [$url, $component]) {
            $this->actingAs($admin)->get($url)->assertOk()->assertInertia(fn ($page) => $page->component($component));
        }
    }
}
