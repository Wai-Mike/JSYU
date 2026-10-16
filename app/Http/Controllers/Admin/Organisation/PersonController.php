<?php

namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Organisation\PersonRequest;
use App\Models\GeographicArea;
use App\Models\Person;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PersonController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Person::class);

        $user = $request->user();
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'area' => ['nullable', 'integer'],
        ]);

        $people = $this->visiblePeople($user)
            ->with(['geographicArea:id,name', 'user:id', 'appointments' => fn ($q) => $q->where('status', 'active')->with('position:id,title')])
            ->when($filters['search'] ?? null, fn ($q, $s) => $this->applySearch($q, $s))
            ->when($filters['area'] ?? null, fn ($q, $a) => $q->where('geographic_area_id', $a))
            ->orderBy('full_name')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Person $person) => [
                ...$person->only(['id', 'full_name', 'email', 'phone', 'gender', 'geographic_area_id']),
                // Restricted notes are only sent to users who may edit the record
                'notes' => $user->can('update', $person) ? $person->notes : null,
                'area' => $person->geographicArea?->name,
                'has_account' => $person->user !== null,
                'positions' => $person->appointments->map(fn ($a) => $a->position?->title)->filter()->values(),
                'can' => ['update' => $user->can('update', $person)],
            ]);

        return Inertia::render('admin/organisation/people/index', [
            'people' => $people,
            'filters' => $filters,
            'areas' => $this->access->scopeQuery(GeographicArea::query(), $user, 'people.view', 'id')
                ->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']),
            'manageAreas' => $this->access->scopeQuery(GeographicArea::query(), $user, 'people.manage', 'id')
                ->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']),
            'canCreate' => $this->access->hasAnywhere($user, 'people.manage'),
            'canCreateStatewide' => $this->access->hasStatewide($user, 'people.manage'),
        ]);
    }

    /** JSON lookup used by the appointment forms. */
    public function search(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Person::class);

        $term = (string) ($request->validate(['q' => ['nullable', 'string', 'max:100']])['q'] ?? '');

        $people = $this->visiblePeople($request->user())
            ->when($term !== '', fn ($q) => $this->applySearch($q, $term))
            ->orderBy('full_name')
            ->limit(15)
            ->get(['id', 'full_name', 'email', 'phone']);

        return response()->json($people);
    }

    public function store(PersonRequest $request): RedirectResponse
    {
        $data = $request->validated();
        Gate::authorize('create', [Person::class, $data['geographic_area_id'] ?? null]);

        $person = new Person(collect($data)->except('link_account')->all());

        if ($request->boolean('link_account')) {
            $person->user_id = $this->linkableUserId($data['email'] ?? null);
        }

        $person->save();
        $this->audit->log('person.created', $person, "Created person record \"{$person->full_name}\"");

        return back()->with('success', "{$person->full_name} added.");
    }

    public function update(PersonRequest $request, Person $person): RedirectResponse
    {
        Gate::authorize('update', $person);

        $data = $request->validated();

        // Moving a record to another area requires authority there too
        if (array_key_exists('geographic_area_id', $data) && $data['geographic_area_id'] != $person->geographic_area_id) {
            Gate::authorize('create', [Person::class, $data['geographic_area_id']]);
        }

        $person->fill(collect($data)->except('link_account')->all());

        if ($request->boolean('link_account') && ! $person->user_id) {
            $person->user_id = $this->linkableUserId($person->email);
        }

        $person->save();

        if ($person->wasChanged()) {
            $this->audit->log('person.updated', $person, "Updated person record \"{$person->full_name}\"", [
                'fields' => array_values(array_diff(array_keys($person->getChanges()), ['updated_at'])),
            ]);
        }

        return back()->with('success', "{$person->full_name} updated.");
    }

    private function visiblePeople(User $user)
    {
        return $this->access->scopeQuery(Person::query(), $user, 'people.view');
    }

    private function applySearch($query, string $term)
    {
        return $query->where(fn ($w) => $w
            ->where('full_name', 'like', "%{$term}%")
            ->orWhere('email', 'like', "%{$term}%")
            ->orWhere('phone', 'like', "%{$term}%"));
    }

    private function linkableUserId(?string $email): int
    {
        $user = $email ? User::query()->where('email', $email)->first() : null;

        if (! $user) {
            throw ValidationException::withMessages(['link_account' => 'No user account uses this email address.']);
        }

        if (Person::withTrashed()->where('user_id', $user->id)->exists()) {
            throw ValidationException::withMessages(['link_account' => 'That account is already linked to another person record.']);
        }

        return $user->id;
    }
}
