<?php

namespace App\Http\Controllers\Admin\Members;

use App\Http\Controllers\Controller;
use App\Models\GeographicArea;
use App\Models\MemberProfile;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use App\Services\Members\ProfilePhotoService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Member directory and membership review: officers view profiles in their
 * jurisdiction and approve or reject applications.
 */
class MemberController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', MemberProfile::class);

        $user = $request->user();
        $filters = $request->validate([
            'status' => ['nullable', Rule::in([...array_keys(MemberProfile::STATUSES), 'all'])],
            'search' => ['nullable', 'string', 'max:100'],
            'area' => ['nullable', 'integer'],
        ]);
        $status = $filters['status'] ?? MemberProfile::STATUS_PENDING;

        $base = fn () => $this->visibleProfiles($user)
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where(fn ($w) => $w
                ->whereHas('person', fn ($p) => $p
                    ->where('full_name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")
                    ->orWhere('phone', 'like', "%{$s}%"))))
            ->when($filters['area'] ?? null, fn ($q, $a) => $this->withinArea($q, (int) $a));

        $members = $base()
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->with(['person:id,user_id,full_name,email,phone,gender', 'homeArea:id,name,level'])
            ->latest('updated_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (MemberProfile $profile) => [
                'id' => $profile->id,
                'name' => $profile->person?->full_name,
                'email' => $profile->person?->email,
                'phone' => $profile->person?->phone,
                'gender' => $profile->person?->gender,
                'age' => $profile->age,
                'home_area' => $profile->homeArea?->name,
                'status' => $profile->status,
                'complete' => $profile->isMembershipComplete(),
                'has_photo' => $profile->hasPhoto(),
                'updated_at' => $profile->updated_at?->toDateString(),
            ]);

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'status' => $status,
            'filters' => ['search' => $filters['search'] ?? null, 'area' => $filters['area'] ?? null],
            // Per-status totals for the tabs, with the same search/area filters applied
            'counts' => $base()->toBase()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'statuses' => MemberProfile::STATUSES,
            'areas' => $this->filterAreas($user),
        ]);
    }

    public function show(Request $request, MemberProfile $member): Response
    {
        Gate::authorize('view', $member);

        $user = $request->user();
        $member->load(['person.user', 'homeArea', 'reviewer:id,name', 'person.appointments' => fn ($q) => $q
            ->where('status', 'active')->with('position:id,title,organisation_unit_id', 'position.organisationUnit:id,name')]);
        $person = $member->person;
        $account = $person?->user;

        return Inertia::render('admin/members/show', [
            'member' => [
                'id' => $member->id,
                'name' => $person?->full_name,
                'first_name' => $member->first_name,
                'middle_name' => $member->middle_name,
                'last_name' => $member->last_name,
                'gender' => $person?->gender,
                'date_of_birth' => $member->date_of_birth?->toDateString(),
                'age' => $member->age,
                'email' => $person?->email,
                'phone' => $person?->phone,
                'alternative_phone' => $member->alternative_phone,
                'home_area' => $member->homeArea?->fullName(),
                'country' => $member->current_country_code
                    ? (config('countries')[$member->current_country_code] ?? $member->current_country_code)
                    : null,
                'current_location' => $member->current_location,
                'bio' => $member->bio,
                'visibility' => MemberProfile::VISIBILITIES[$member->visibility] ?? $member->visibility,
                'photo_url' => $member->hasPhoto() ? route('admin.members.photo', $member) : null,
                'status' => $member->status,
                'complete' => $member->isMembershipComplete(),
                'sections' => $member->completeness(),
                'review' => $member->reviewed_at ? [
                    'by' => $member->reviewer?->name ?? 'Former officer',
                    'at' => $member->reviewed_at->toDateTimeString(),
                    'note' => $member->review_note,
                ] : null,
                'account' => $account ? [
                    'joined' => $account->created_at?->toDateString(),
                    'verified' => $account->email_verified_at !== null,
                    'sign_in' => $account->google_id ? 'Google' : 'Email & password',
                ] : null,
                'positions' => $person?->appointments->map(fn ($a) => [
                    'id' => $a->id,
                    'title' => $a->position?->title,
                    'unit' => $a->position?->organisationUnit?->name,
                ])->values() ?? [],
                'updated_at' => $member->updated_at?->toDateTimeString(),
            ],
            'statuses' => MemberProfile::STATUSES,
            'can' => [
                'review' => $user->can('review', $member),
                'viewAppointments' => $this->access->hasAnywhere($user, 'appointments.view'),
            ],
        ]);
    }

    /** Profile photos are private files, so they are served through the same permission check. */
    public function photo(MemberProfile $member, ProfilePhotoService $photos): StreamedResponse
    {
        Gate::authorize('view', $member);
        abort_unless($member->hasPhoto(), 404);

        return $photos->response($member);
    }

    public function approve(Request $request, MemberProfile $member): RedirectResponse
    {
        Gate::authorize('review', $member);

        $data = $request->validate(['note' => ['nullable', 'string', 'max:1000']]);

        if (! $member->isMembershipComplete()) {
            throw ValidationException::withMessages(['note' => 'This profile is incomplete. The member must finish their membership details before approval.']);
        }

        $this->review($request->user(), $member, MemberProfile::STATUS_APPROVED, $data['note'] ?? null);

        return back()->with('success', "{$member->person->full_name}'s membership has been approved.");
    }

    public function reject(Request $request, MemberProfile $member): RedirectResponse
    {
        Gate::authorize('review', $member);

        $data = $request->validate(['note' => ['required', 'string', 'max:1000']], [
            'note.required' => 'Give a reason so the member knows what to change.',
        ]);

        $this->review($request->user(), $member, MemberProfile::STATUS_REJECTED, $data['note']);

        return back()->with('success', "{$member->person->full_name}'s membership has been rejected.");
    }

    private function review(User $actor, MemberProfile $member, string $status, ?string $note): void
    {
        if ($member->status === $status) {
            throw ValidationException::withMessages(['note' => 'This membership is already '.strtolower(MemberProfile::STATUSES[$status]).'.']);
        }

        $previous = $member->status;
        $member->loadMissing('person');
        $member->forceFill([
            'status' => $status,
            'reviewed_by' => $actor->id,
            'reviewed_at' => now(),
            'review_note' => $note,
        ])->save();

        // The note may hold personal details, so only the status change is logged
        $this->audit->log("member.{$status}", $member, ucfirst($status)." membership of {$member->person->full_name}", [
            'from' => $previous,
            'to' => $status,
        ]);
    }

    /**
     * Profiles this user may see: those they can review, plus those shared
     * with officials (or members) in areas where they hold members.view.
     */
    private function visibleProfiles(User $user): Builder
    {
        $query = MemberProfile::query();

        if ($this->access->hasStatewide($user, 'members.review')) {
            return $query;
        }

        return $query->where(fn ($w) => $w
            ->where(fn ($q) => $this->access->scopeQuery($q, $user, 'members.review', 'home_area_id'))
            ->orWhere(fn ($q) => $this->access->scopeQuery(
                $q->where('visibility', '!=', MemberProfile::VISIBILITY_PRIVATE), $user, 'members.view', 'home_area_id',
            )));
    }

    /** The chosen area and everything below it. */
    private function withinArea(Builder $query, int $areaId): Builder
    {
        $area = GeographicArea::query()->find($areaId);

        if (! $area) {
            return $query->whereRaw('1 = 0');
        }

        return $query->whereIn('home_area_id', GeographicArea::query()
            ->where('id', $area->id)
            ->orWhere('path', 'like', $area->path.$area->id.'/%')
            ->select('id'));
    }

    private function filterAreas(User $user)
    {
        $areas = fn (string $permission) => $this->access->scopeQuery(GeographicArea::query(), $user, $permission, 'id')
            ->whereIn('level', ['county', 'payam'])
            ->get(['id', 'name', 'level', 'parent_id']);

        return $areas('members.review')->merge($areas('members.view'))->unique('id')->sortBy('name')->values();
    }
}
