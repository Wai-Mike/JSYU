<?php

namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Document;
use App\Services\Audit\AuditLogger;
use App\Services\Documents\DocumentStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AppointmentDocumentController extends Controller
{
    public function __construct(
        private readonly DocumentStorage $documents,
        private readonly AuditLogger $audit,
    ) {}

    public function store(Request $request, Appointment $appointment): RedirectResponse
    {
        Gate::authorize('update', $appointment);

        $data = $request->validate([
            'document' => ['required', ...DocumentStorage::validationRules()],
            'title' => ['nullable', 'string', 'max:150'],
        ]);

        $document = $this->documents->store($appointment, $request->file('document'), $request->user(), $data['title'] ?? null);
        $this->audit->log('appointment.document_uploaded', $appointment, "Uploaded \"{$document->original_name}\"", ['document_id' => $document->id]);

        return back()->with('success', 'Document uploaded.');
    }

    public function download(Appointment $appointment, Document $document): StreamedResponse
    {
        $this->ensureBelongs($appointment, $document);
        Gate::authorize('viewDocuments', $appointment);

        $this->audit->log('appointment.document_downloaded', $appointment, "Downloaded \"{$document->original_name}\"", ['document_id' => $document->id]);

        return $this->documents->download($document);
    }

    public function destroy(Appointment $appointment, Document $document): RedirectResponse
    {
        $this->ensureBelongs($appointment, $document);
        Gate::authorize('update', $appointment);

        $this->documents->delete($document);
        $this->audit->log('appointment.document_deleted', $appointment, "Deleted \"{$document->original_name}\"", ['document_id' => $document->id]);

        return back()->with('success', 'Document removed.');
    }

    private function ensureBelongs(Appointment $appointment, Document $document): void
    {
        abort_unless(
            $document->documentable_type === $appointment->getMorphClass() && (int) $document->documentable_id === $appointment->id,
            404,
        );
    }
}
