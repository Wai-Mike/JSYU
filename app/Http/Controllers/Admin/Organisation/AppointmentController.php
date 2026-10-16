<?php

namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Organisation\AppointmentRequest;
use App\Models\Appointment;
use App\Models\Person;
use App\Models\Position;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use App\Services\Documents\DocumentStorage;
use App\Services\Organisation\AppointmentService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AppointmentService $appointments,
        private readonly DocumentStorage $documents,
        private readonly AuditLogger $audit,
    ) {}

    /** Leadership register: current holders, history and vacancies. */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Appointment::class);

        $user = $request->user();
        $filters = $request->validate([
            'view' => ['nullable', Rule::in(['active', 'history', 'vacancies'])],
            'search' => ['nullable', 'string', 'max:100'],
        ]);
        $view = $filters['view'] ?? 'active';
        $search = $filters['search'] ?? null;

        $inScope = fn (Builder $units) => $this->access->scopeQuery($units, $user, 'appointments.view');

        if ($view === 'vacancies') {
            $rows = Position::query()
                ->where('is_active', true)
                ->whereHas('organisationUnit', $inScope)
                ->with('organisationUnit:id,name')
                ->withCount('activeAppointments')
                ->when($search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
                ->orderBy('title')
                ->get()
                ->filter(fn (Position $p) => $p->active_appointments_count < $p->seats)
                ->values()
                ->map(fn (Position $p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'unit' => $p->organisationUnit->only(['id', 'name']),
                    'seats' => $p->seats,
                    'vacant' => $p->seats - $p->active_appointments_count,
                ]);

            $paginated = null;
        } else {
            $paginated = Appointment::query()
                ->where('status', $view === 'history' ? Appointment::STATUS_ENDED : Appointment::STATUS_ACTIVE)
                ->whereHas('position.organisationUnit', $inScope)
                ->with(['person:id,full_name', 'position:id,title,organisation_unit_id', 'position.organisationUnit:id,name'])
                ->when($search, fn ($q, $s) => $q->where(fn ($w) => $w
                    ->whereHas('person', fn ($p) => $p->where('full_name', 'like', "%{$s}%"))
                    ->orWhereHas('position', fn ($p) => $p->where('title', 'like', "%{$s}%"))))
                ->orderByDesc($view === 'history' ? 'ended_on' : 'starts_on')
                ->paginate(20)
                ->withQueryString()
                ->through(fn (Appointment $a) => $this->summary($a));

            $rows = null;
        }

        return Inertia::render('admin/organisation/appointments/index', [
            'view' => $view,
            'filters' => ['search' => $search],
            'appointments' => $paginated,
            'vacancies' => $rows,
        ]);
    }

    public function show(Request $request, Appointment $appointment): Response
    {
        Gate::authorize('view', $appointment);

        $user = $request->user();
        $appointment->load(['person', 'position.organisationUnit:id,name,geographic_area_id', 'appointedBy:id,name', 'endedBy:id,name', 'replaces.person:id,full_name']);
        $canViewDocuments = $user->can('viewDocuments', $appointment);

        return Inertia::render('admin/organisation/appointments/show', [
            'appointment' => [
                ...$this->summary($appointment),
                'notes' => $appointment->notes,
                'end_reason' => $appointment->end_reason,
                'appointed_by' => $appointment->appointedBy?->name,
                'ended_by' => $appointment->endedBy?->name,
                'replaces' => $appointment->replaces ? [
                    'id' => $appointment->replaces->id,
                    'person' => $appointment->replaces->person?->full_name,
                ] : null,
                'person' => $appointment->person->only(['id', 'full_name', 'email', 'phone']),
            ],
            // Everyone who has held this position, newest first
            'history' => $appointment->position->appointments()
                ->with('person:id,full_name')
                ->orderByDesc('starts_on')
                ->get()
                ->map(fn (Appointment $a) => $this->summary($a)),
            'documents' => $canViewDocuments
                ? $appointment->documents()->with('uploader:id,name')->get()->map(fn ($d) => [
                    ...$d->only(['id', 'title', 'original_name', 'mime_type', 'size']),
                    'uploaded_by' => $d->uploader?->name,
                    'created_at' => $d->created_at->toDateTimeString(),
                ])
                : null,
            'endReasons' => config('portal.appointment_end_reasons'),
            'can' => [
                'update' => $user->can('update', $appointment),
                'viewDocuments' => $canViewDocuments,
            ],
        ]);
    }

    public function store(AppointmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $position = Position::query()->findOrFail($data['position_id']);
        $person = Person::query()->findOrFail($data['person_id']);

        Gate::authorize('create', [Appointment::class, $position]);
        Gate::authorize('view', $person);

        $appointment = DB::transaction(function () use ($request, $data, $position, $person) {
            $appointment = $this->appointments->appoint(
                $request->user(), $position, $person, $data['starts_on'], $data['term_ends_on'] ?? null, $data['notes'] ?? null,
            );

            if ($request->hasFile('document')) {
                $this->storeDocument($request, $appointment, $data['document_title'] ?? 'Appointment letter');
            }

            return $appointment;
        });

        return redirect()->route('admin.organisation.appointments.show', $appointment)
            ->with('success', "{$person->full_name} appointed as {$position->title}.");
    }

    public function end(Request $request, Appointment $appointment): RedirectResponse
    {
        Gate::authorize('update', $appointment);

        $data = $request->validate([
            'ended_on' => ['required', 'date'],
            'end_reason' => ['required', Rule::in(array_keys(config('portal.appointment_end_reasons')))],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $this->appointments->end($request->user(), $appointment, $data['ended_on'], $data['end_reason'], $data['notes'] ?? null);

        return back()->with('success', 'Appointment ended. It remains in the leadership history.');
    }

    public function transfer(Request $request, Appointment $appointment): RedirectResponse
    {
        Gate::authorize('update', $appointment);

        $data = $request->validate([
            'person_id' => ['required', 'integer', 'exists:people,id', Rule::notIn([$appointment->person_id])],
            'effective_on' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $successor = Person::query()->findOrFail($data['person_id']);
        Gate::authorize('view', $successor);

        $new = $this->appointments->transfer($request->user(), $appointment, $successor, $data['effective_on'], $data['notes'] ?? null);

        return redirect()->route('admin.organisation.appointments.show', $new)
            ->with('success', "Responsibilities transferred to {$successor->full_name}.");
    }

    private function storeDocument(Request $request, Appointment $appointment, ?string $title): void
    {
        $document = $this->documents->store($appointment, $request->file('document'), $request->user(), $title);
        $this->audit->log('appointment.document_uploaded', $appointment, "Uploaded \"{$document->original_name}\"", ['document_id' => $document->id]);
    }

    private function summary(Appointment $a): array
    {
        return [
            'id' => $a->id,
            'status' => $a->status,
            'person' => $a->person?->only(['id', 'full_name']),
            'position' => $a->position?->only(['id', 'title']),
            'unit' => $a->position?->organisationUnit?->only(['id', 'name']),
            'starts_on' => $a->starts_on?->toDateString(),
            'term_ends_on' => $a->term_ends_on?->toDateString(),
            'ended_on' => $a->ended_on?->toDateString(),
            'end_reason' => $a->end_reason,
        ];
    }
}
