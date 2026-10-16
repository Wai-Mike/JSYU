<?php

namespace App\Services\Documents;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Stores attachments on a private disk under random names. */
class DocumentStorage
{
    public static function validationRules(): array
    {
        return ['file', 'max:'.config('portal.documents.max_kb'), 'mimes:'.implode(',', config('portal.documents.mimes'))];
    }

    public function store(Model $attachable, UploadedFile $file, User $uploader, ?string $title = null): Document
    {
        $disk = config('portal.documents.disk');
        $folder = Str::of(class_basename($attachable))->snake()->plural();
        $path = $file->storeAs("documents/{$folder}/".now()->format('Y'), Str::uuid().'.'.$file->guessExtension(), $disk);

        $document = new Document(['title' => $title]);
        $document->forceFill([
            'documentable_type' => $attachable->getMorphClass(),
            'documentable_id' => $attachable->getKey(),
            'disk' => $disk,
            'path' => $path,
            'original_name' => Str::limit($file->getClientOriginalName(), 250, ''),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $uploader->id,
        ])->save();

        return $document;
    }

    public function download(Document $document): StreamedResponse
    {
        return Storage::disk($document->disk)->download($document->path, $document->original_name);
    }

    public function delete(Document $document): void
    {
        Storage::disk($document->disk)->delete($document->path);
        $document->delete();
    }
}
