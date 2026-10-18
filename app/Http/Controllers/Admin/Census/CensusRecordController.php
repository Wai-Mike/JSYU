<?php

namespace App\Http\Controllers\Admin\Census;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Census\CensusRecordRequest;
use App\Models\CensusCampaign;
use App\Models\CensusRecord;
use App\Models\GeographicArea;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Entering, correcting and reviewing individual census records.
 */
class CensusRecordController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function create(Request $request, CensusCampaign $campaign): Response
    {
        $this->ensureCanCollect($request->user(), $campaign);

        return $this->form($request->user(), $campaign, null);
    }

    public function store(CensusRecordRequest $request, CensusCampaign $campaign): RedirectResponse
    {
        $user = $request->user();
        $this->ensureCanCollect($user, $campaign);

        $data = $request->validated();
        $this->authorizeArea($user, $campaign, (int) $data['geographic_area_id']);
        $this->guardDuplicate($campaign, $data);

        $record = new CensusRecord($this->recordFields($data, true));
        $record->census_campaign_id = $campaign->id;
        $record->enumerator_id = $user->id;
        $record->save();

        // Names and personal details stay out of the audit log
        $this->audit->log('census.record_created', $record, "Census record #{$record->id} entered", ['campaign_id' => $campaign->id]);

        if ($request->boolean('add_another')) {
            return redirect()->route('admin.census.records.create', $campaign)->with('success', 'Record saved. Enter the next person.');
        }

        return redirect()->route('admin.census.show', $campaign)->with('success', 'Record saved and sent for review.');
    }

    public function show(Request $request, CensusRecord $record): Response
    {
        Gate::authorize('view', $record);

        $user = $request->user();
        $record->load(['campaign', 'geographicArea', 'enumerator:id,name', 'reviewer:id,name']);
        $options = config('portal.census');
        $sensitive = Gate::allows('census.sensitive');

        return Inertia::render('admin/census/records/show', [
            'record' => [
                'id' => $record->id,
                'full_name' => $record->full_name,
                'sex' => $options['sex'][$record->sex] ?? $record->sex,
                'date_of_birth' => $record->date_of_birth?->toDateString(),
                'age' => $record->age,
                'phone' => $record->phone,
                'area' => $record->geographicArea?->fullName(),
                'education_level' => $options['education_levels'][$record->education_level] ?? null,
                'in_school' => $record->in_school,
                'employment_status' => $options['employment_statuses'][$record->employment_status] ?? null,
                'occupation' => $record->occupation,
                'skills' => $record->skills,
                // Null means "not shown to you", not "not recorded"
                'sensitive' => $sensitive ? [
                    'disability' => $options['disability'][$record->disability] ?? null,
                    'displacement_status' => $options['displacement_statuses'][$record->displacement_status] ?? null,
                ] : null,
                'status' => $record->status,
                'enumerator' => $record->enumerator?->name,
                'created_at' => $record->created_at?->toDateTimeString(),
                'review' => $record->reviewed_at ? [
                    'by' => $record->reviewer?->name ?? 'Former officer',
                    'at' => $record->reviewed_at->toDateTimeString(),
                    'note' => $record->review_note,
                ] : null,
            ],
            'campaign' => ['id' => $record->campaign->id, 'name' => $record->campaign->name],
            'statuses' => CensusRecord::STATUSES,
            'can' => [
                'update' => $user->can('update', $record),
                'review' => $user->can('review', $record),
            ],
        ]);
    }

    public function edit(Request $request, CensusRecord $record): Response
    {
        Gate::authorize('update', $record);

        return $this->form($request->user(), $record->campaign, $record);
    }

    public function update(CensusRecordRequest $request, CensusRecord $record): RedirectResponse
    {
        Gate::authorize('update', $record);

        $user = $request->user();
        $data = $request->validated();
        $this->authorizeArea($user, $record->campaign, (int) $data['geographic_area_id']);
        $this->guardDuplicate($record->campaign, $data, $record);

        $record->fill($this->recordFields($data, Gate::allows('census.sensitive')));

        // Sensitive answers the user cannot see are only replaced when a new answer is given
        foreach (CensusRecord::SENSITIVE_FIELDS as $field) {
            if (! Gate::allows('census.sensitive') && filled($data[$field] ?? null)) {
                $record->{$field} = $data[$field];
            }
        }

        // A corrected record goes back for review
        $record->status = CensusRecord::STATUS_SUBMITTED;
        $record->save();

        $this->audit->log('census.record_updated', $record, "Census record #{$record->id} corrected", [
            'fields' => array_values(array_diff(array_keys($record->getChanges()), ['updated_at'])),
        ]);

        return redirect()->route('admin.census.records.show', $record)->with('success', 'Record updated and sent for review.');
    }

    public function approve(Request $request, CensusRecord $record): RedirectResponse
    {
        Gate::authorize('review', $record);

        return $this->review($request->user(), $record, CensusRecord::STATUS_APPROVED, $request->validate(['note' => ['nullable', 'string', 'max:1000']])['note'] ?? null);
    }

    public function reject(Request $request, CensusRecord $record): RedirectResponse
    {
        Gate::authorize('review', $record);

        $data = $request->validate(['note' => ['required', 'string', 'max:1000']], [
            'note.required' => 'Tell the enumerator what to correct.',
        ]);

        return $this->review($request->user(), $record, CensusRecord::STATUS_REJECTED, $data['note']);
    }

    private function review(User $actor, CensusRecord $record, string $status, ?string $note): RedirectResponse
    {
        if ($record->status === $status) {
            throw ValidationException::withMessages(['note' => 'This record is already '.strtolower(CensusRecord::STATUSES[$status]).'.']);
        }

        $record->forceFill([
            'status' => $status,
            'reviewed_by' => $actor->id,
            'reviewed_at' => now(),
            'review_note' => $note,
        ])->save();

        $this->audit->log("census.record_{$status}", $record, ucfirst($status)." census record #{$record->id}");

        return back()->with('success', 'Record '.strtolower(CensusRecord::STATUSES[$status]).'.');
    }

    private function form(User $user, CensusCampaign $campaign, ?CensusRecord $record): Response
    {
        $options = config('portal.census');
        $sensitive = Gate::allows('census.sensitive');

        return Inertia::render('admin/census/records/form', [
            'campaign' => ['id' => $campaign->id, 'name' => $campaign->name],
            'record' => $record ? [
                'id' => $record->id,
                ...$record->only(['geographic_area_id', 'full_name', 'sex', 'age_years', 'phone', 'education_level', 'in_school', 'employment_status', 'occupation', 'skills']),
                'date_of_birth' => $record->date_of_birth?->toDateString(),
                // Existing sensitive answers are only sent to users allowed to see them
                'disability' => $sensitive ? $record->disability : null,
                'displacement_status' => $sensitive ? $record->displacement_status : null,
                'review_note' => $record->status === CensusRecord::STATUS_REJECTED ? $record->review_note : null,
            ] : null,
            'areas' => $this->collectAreas($user, $campaign),
            'options' => $options,
            'canSeeSensitive' => $sensitive,
        ]);
    }

    private function recordFields(array $data, bool $includeSensitive): array
    {
        $fields = collect($data)->except(['confirm_not_duplicate', ...CensusRecord::SENSITIVE_FIELDS])->all();

        if ($includeSensitive) {
            foreach (CensusRecord::SENSITIVE_FIELDS as $field) {
                $fields[$field] = $data[$field] ?? null;
            }
        }

        // An exact date of birth makes the approximate age redundant
        if (! empty($fields['date_of_birth'])) {
            $fields['age_years'] = null;
        }

        return $fields;
    }

    private function ensureCanCollect(User $user, CensusCampaign $campaign): void
    {
        abort_unless($this->access->overlaps($user, 'census.collect', $campaign->geographic_area_id), 403);

        if (! $campaign->isOpen()) {
            throw ValidationException::withMessages(['campaign' => 'This campaign is not open for collection.']);
        }
    }

    /** The record's area must be inside both the campaign and the enumerator's own area. */
    private function authorizeArea(User $user, CensusCampaign $campaign, int $areaId): void
    {
        $area = GeographicArea::query()->findOrFail($areaId);

        if (! $campaign->covers($area)) {
            throw ValidationException::withMessages(['geographic_area_id' => 'This area is outside the campaign.']);
        }

        abort_unless($this->access->allows($user, 'census.collect', $area), 403);
    }

    /**
     * Same name in the same campaign with a matching date of birth, phone or
     * area is probably the same person counted twice. The enumerator can
     * confirm it is someone else.
     */
    private function guardDuplicate(CensusCampaign $campaign, array $data, ?CensusRecord $except = null): void
    {
        if (! empty($data['confirm_not_duplicate'])) {
            return;
        }

        $match = CensusRecord::query()
            ->where('census_campaign_id', $campaign->id)
            ->whereRaw('lower(full_name) = ?', [mb_strtolower(trim($data['full_name']))])
            ->when($except, fn ($q) => $q->whereKeyNot($except->id))
            ->where(fn ($w) => $w
                ->when(! empty($data['date_of_birth']), fn ($q) => $q->orWhereDate('date_of_birth', $data['date_of_birth']))
                ->when(! empty($data['phone']), fn ($q) => $q->orWhere('phone', $data['phone']))
                ->orWhere(fn ($q) => $q->where('geographic_area_id', $data['geographic_area_id'])->where('sex', $data['sex'])))
            ->exists();

        if ($match) {
            throw ValidationException::withMessages([
                'duplicate' => 'Someone with this name and matching details is already recorded in this campaign. Check it is not the same person, then confirm to save.',
            ]);
        }
    }

    /** Areas where this user may enter records for the campaign. */
    private function collectAreas(User $user, CensusCampaign $campaign)
    {
        return $this->access->scopeQuery(GeographicArea::query(), $user, 'census.collect', 'id')
            ->whereIn('level', ['county', 'payam', 'boma'])
            ->where('is_active', true)
            ->when($campaign->geographic_area_id, function ($q) use ($campaign) {
                $area = $campaign->geographicArea;
                $q->where(fn ($w) => $w->whereKey($area->id)->orWhere('path', 'like', $area->path.$area->id.'/%'));
            })
            ->orderBy('path')->orderBy('name')
            ->get(['id', 'name', 'level', 'parent_id']);
    }
}
