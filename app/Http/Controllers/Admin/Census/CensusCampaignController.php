<?php

namespace App\Http\Controllers\Admin\Census;

use App\Http\Controllers\Controller;
use App\Models\CensusCampaign;
use App\Models\CensusRecord;
use App\Models\GeographicArea;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Census campaigns: setup, the record list for each campaign and aggregate reports.
 */
class CensusCampaignController extends Controller
{
    private const AGE_BANDS = ['15–19' => [15, 19], '20–24' => [20, 24], '25–29' => [25, 29], '30–35' => [30, 35]];

    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CensusCampaign::class);

        $user = $request->user();

        $campaigns = CensusCampaign::query()
            ->with('geographicArea:id,name')
            ->withCount([
                'records',
                'records as submitted_count' => fn ($q) => $q->where('status', CensusRecord::STATUS_SUBMITTED),
                'records as approved_count' => fn ($q) => $q->where('status', CensusRecord::STATUS_APPROVED),
            ])
            ->orderByRaw("case status when 'open' then 0 when 'draft' then 1 else 2 end")
            ->orderByDesc('starts_on')
            ->get()
            // Campaigns are few, so filter with the policy rather than a query
            ->filter(fn (CensusCampaign $c) => $user->can('view', $c))
            ->values()
            ->map(fn (CensusCampaign $c) => [
                ...$this->summary($c),
                // Totals are only meaningful to people who can see every record in the area
                'counts' => $user->can('viewReports', $c) ? [
                    'total' => $c->records_count,
                    'submitted' => $c->submitted_count,
                    'approved' => $c->approved_count,
                ] : null,
                'can' => ['update' => $user->can('update', $c)],
            ]);

        return Inertia::render('admin/census/index', [
            'campaigns' => $campaigns,
            'statuses' => CensusCampaign::STATUSES,
            'areas' => $this->access->scopeQuery(GeographicArea::query(), $user, 'census.manage', 'id')
                ->whereIn('level', ['state', 'county', 'payam'])
                ->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']),
            'canCreate' => $this->access->hasAnywhere($user, 'census.manage'),
            'canCreateStatewide' => $this->access->hasStatewide($user, 'census.manage'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        Gate::authorize('create', [CensusCampaign::class, $data['geographic_area_id'] ?? null]);

        $campaign = new CensusCampaign($data);
        $campaign->created_by = $request->user()->id;
        $campaign->save();

        $this->audit->log('census.campaign_created', $campaign, "Created census campaign \"{$campaign->name}\"");

        return redirect()->route('admin.census.show', $campaign)->with('success', "{$campaign->name} created. Open it when enumerators are ready to collect.");
    }

    public function update(Request $request, CensusCampaign $campaign): RedirectResponse
    {
        Gate::authorize('update', $campaign);

        $data = $this->validated($request);

        if (($data['geographic_area_id'] ?? null) != $campaign->geographic_area_id) {
            // Records already collected must stay inside the campaign's area
            if ($campaign->records()->exists()) {
                throw ValidationException::withMessages(['geographic_area_id' => 'The area cannot change once records have been collected.']);
            }

            Gate::authorize('create', [CensusCampaign::class, $data['geographic_area_id'] ?? null]);
        }

        $campaign->update($data);
        $this->audit->log('census.campaign_updated', $campaign, "Updated census campaign \"{$campaign->name}\"");

        return back()->with('success', "{$campaign->name} updated.");
    }

    public function open(CensusCampaign $campaign): RedirectResponse
    {
        return $this->setStatus($campaign, CensusCampaign::STATUS_OPEN, 'opened for collection');
    }

    public function close(CensusCampaign $campaign): RedirectResponse
    {
        return $this->setStatus($campaign, CensusCampaign::STATUS_CLOSED, 'closed');
    }

    public function show(Request $request, CensusCampaign $campaign): Response
    {
        Gate::authorize('view', $campaign);

        $user = $request->user();
        $filters = $request->validate([
            'status' => ['nullable', Rule::in([...array_keys(CensusRecord::STATUSES), 'all'])],
            'search' => ['nullable', 'string', 'max:100'],
            'mine' => ['nullable', 'boolean'],
        ]);
        $status = $filters['status'] ?? 'all';

        $records = $this->visibleRecords($user, $campaign)
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where(fn ($w) => $w
                ->where('full_name', 'like', "%{$s}%")
                ->orWhere('phone', 'like', "%{$s}%")))
            ->when($filters['mine'] ?? false, fn ($q) => $q->where('enumerator_id', $user->id))
            ->with(['geographicArea:id,name', 'enumerator:id,name'])
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(fn (CensusRecord $r) => [
                'id' => $r->id,
                'full_name' => $r->full_name,
                'sex' => $r->sex,
                'age' => $r->age,
                'area' => $r->geographicArea?->name,
                'enumerator' => $r->enumerator?->name,
                'status' => $r->status,
                'created_at' => $r->created_at?->toDateString(),
            ]);

        return Inertia::render('admin/census/show', [
            'campaign' => [...$this->summary($campaign), 'description' => $campaign->description],
            'records' => $records,
            'filters' => ['status' => $status, 'search' => $filters['search'] ?? null, 'mine' => (bool) ($filters['mine'] ?? false)],
            'recordStatuses' => CensusRecord::STATUSES,
            'statuses' => CensusCampaign::STATUSES,
            'report' => $user->can('viewReports', $campaign) ? $this->report($user, $campaign) : null,
            'areas' => $this->access->scopeQuery(GeographicArea::query(), $user, 'census.manage', 'id')
                ->whereIn('level', ['state', 'county', 'payam'])
                ->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']),
            'can' => [
                'update' => $user->can('update', $campaign),
                'collect' => $campaign->isOpen() && $this->access->overlaps($user, 'census.collect', $campaign->geographic_area_id),
                'canCreateStatewide' => $this->access->hasStatewide($user, 'census.manage'),
            ],
        ]);
    }

    private function setStatus(CensusCampaign $campaign, string $status, string $verb): RedirectResponse
    {
        Gate::authorize('update', $campaign);

        if ($campaign->status === $status) {
            return back();
        }

        $campaign->forceFill(['status' => $status])->save();
        $this->audit->log("census.campaign_{$status}", $campaign, "Census campaign \"{$campaign->name}\" {$verb}");

        return back()->with('success', "{$campaign->name} {$verb}.");
    }

    /** Records this user may list: those in their census.view/review areas, plus their own entries. */
    private function visibleRecords(User $user, CensusCampaign $campaign): Builder
    {
        $query = CensusRecord::query()->where('census_campaign_id', $campaign->id);

        if ($this->access->hasStatewide($user, 'census.view') || $this->access->hasStatewide($user, 'census.review')) {
            return $query;
        }

        return $query->where(fn ($w) => $w
            ->where(fn ($q) => $this->access->scopeQuery($q, $user, 'census.view'))
            ->orWhere(fn ($q) => $this->access->scopeQuery($q, $user, 'census.review'))
            ->orWhere('enumerator_id', $user->id));
    }

    /**
     * Aggregates over approved records in the user's census.view areas.
     * Disability and displacement totals need census.sensitive.
     */
    private function report(User $user, CensusCampaign $campaign): array
    {
        $records = $this->access->scopeQuery(
            CensusRecord::query()->where('census_campaign_id', $campaign->id)->where('status', CensusRecord::STATUS_APPROVED),
            $user,
            'census.view',
        )->get(['geographic_area_id', 'sex', 'date_of_birth', 'age_years', 'education_level', 'in_school', 'employment_status', 'disability', 'displacement_status']);

        $options = config('portal.census');
        $tally = fn (string $field, array $labels) => $this->tally($records->pluck($field), $labels);

        $report = [
            'total' => $records->count(),
            'byCounty' => $this->byCounty($records),
            'bySex' => $tally('sex', $options['sex']),
            'byAge' => collect(self::AGE_BANDS)->map(fn ($range, $label) => [
                'label' => $label,
                'count' => $records->filter(fn ($r) => $r->age !== null && $r->age >= $range[0] && $r->age <= $range[1])->count(),
            ])->values(),
            'byEducation' => $tally('education_level', $options['education_levels']),
            'inSchool' => $tally('in_school', [1 => 'In school', 0 => 'Not in school']),
            'byEmployment' => $tally('employment_status', $options['employment_statuses']),
            'sensitive' => null,
        ];

        if (Gate::allows('census.sensitive')) {
            $report['sensitive'] = [
                'disability' => $tally('disability', $options['disability']),
                'displacement' => $tally('displacement_status', $options['displacement_statuses']),
            ];
        }

        return $report;
    }

    /** Counts per option in display order, plus "Not recorded" for blanks. */
    private function tally(Collection $values, array $labels): array
    {
        $counts = $values->map(fn ($v) => is_bool($v) ? (int) $v : $v)->countBy(fn ($v) => $v ?? '__none');

        $rows = collect($labels)->map(fn ($label, $key) => ['label' => $label, 'count' => $counts[$key] ?? 0])->values();

        if ($counts->has('__none')) {
            $rows->push(['label' => 'Not recorded', 'count' => $counts['__none']]);
        }

        return $rows->all();
    }

    /** Records sit at county, payam or boma level; roll them up to their county. */
    private function byCounty(Collection $records): array
    {
        $areaIds = $records->pluck('geographic_area_id')->unique();
        $areas = GeographicArea::query()->whereKey($areaIds)->get(['id', 'name', 'level', 'path']);
        $countyIds = $areas->mapWithKeys(fn ($a) => [$a->id => $a->level === 'county'
            ? $a->id
            : GeographicArea::query()->whereKey($a->ancestorIds())->where('level', 'county')->value('id')]);
        $names = GeographicArea::query()->whereKey($countyIds->filter()->unique())->pluck('name', 'id');

        return $records->countBy(fn ($r) => $countyIds[$r->geographic_area_id] ?? 0)
            ->map(fn ($count, $countyId) => ['label' => $names[$countyId] ?? 'Other', 'count' => $count])
            ->sortByDesc('count')
            ->values()
            ->all();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'geographic_area_id' => ['nullable', 'integer', 'exists:geographic_areas,id'],
            'starts_on' => ['required', 'date'],
            'ends_on' => ['nullable', 'date', 'after_or_equal:starts_on'],
        ]);
    }

    private function summary(CensusCampaign $c): array
    {
        return [
            'id' => $c->id,
            'name' => $c->name,
            'status' => $c->status,
            'geographic_area_id' => $c->geographic_area_id,
            'area' => $c->geographicArea?->name,
            'starts_on' => $c->starts_on?->toDateString(),
            'ends_on' => $c->ends_on?->toDateString(),
        ];
    }
}
