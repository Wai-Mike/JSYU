<?php

namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Organisation\PositionRequest;
use App\Models\OrganisationUnit;
use App\Models\Position;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class PositionController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function store(PositionRequest $request, OrganisationUnit $unit): RedirectResponse
    {
        Gate::authorize('managePositions', $unit);

        $position = $unit->positions()->create($request->validated());
        $this->audit->log('organisation.position_created', $position, "Created position \"{$position->title}\" in {$unit->name}");

        return back()->with('success', "{$position->title} added.");
    }

    public function update(PositionRequest $request, Position $position): RedirectResponse
    {
        Gate::authorize('managePositions', $position->organisationUnit);

        $data = $request->validated();

        if (isset($data['seats']) && $data['seats'] < $position->activeAppointments()->count()) {
            throw ValidationException::withMessages(['seats' => 'Seats cannot be fewer than the current number of holders.']);
        }

        $position->update($data);

        if ($position->wasChanged()) {
            $this->audit->log('organisation.position_updated', $position, "Updated position \"{$position->title}\"", $this->audit->changes($position));
        }

        return back()->with('success', "{$position->title} updated.");
    }

    public function destroy(Position $position): RedirectResponse
    {
        Gate::authorize('managePositions', $position->organisationUnit);

        // Positions with any appointment history are kept as leadership records
        if ($position->appointments()->exists()) {
            throw ValidationException::withMessages(['position' => 'This position has appointment history. Deactivate it instead of deleting.']);
        }

        $position->delete();
        $this->audit->log('organisation.position_deleted', null, "Deleted position \"{$position->title}\"", ['position_id' => $position->id]);

        return back()->with('success', "{$position->title} deleted.");
    }
}
