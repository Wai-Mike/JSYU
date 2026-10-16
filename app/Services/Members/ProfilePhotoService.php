<?php

namespace App\Services\Members;

use App\Models\MemberProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Profile photos are re-encoded with GD: this resizes them, strips EXIF data
 * (including GPS location) and guarantees the stored file is a real image.
 * They are stored privately under random names and served by a controller.
 */
class ProfilePhotoService
{
    public const MAX_DIMENSION = 600;

    public const MAX_KB = 5120;

    public static function validationRules(): array
    {
        return ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.self::MAX_KB, 'dimensions:min_width=100,min_height=100,max_width=8000,max_height=8000'];
    }

    public function store(MemberProfile $profile, UploadedFile $file): void
    {
        $source = @imagecreatefromstring((string) file_get_contents($file->getRealPath()));

        if ($source === false) {
            throw ValidationException::withMessages(['photo' => 'This image could not be read. Please upload a JPG, PNG or WebP photo.']);
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $scale = min(1, self::MAX_DIMENSION / max($width, $height));
        $newWidth = max(1, (int) round($width * $scale));
        $newHeight = max(1, (int) round($height * $scale));

        $canvas = imagecreatetruecolor($newWidth, $newHeight);
        // Flatten transparency onto white, since the output is JPEG
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        ob_start();
        imagejpeg($canvas, null, 85);
        $jpeg = (string) ob_get_clean();
        imagedestroy($source);
        imagedestroy($canvas);

        $disk = config('portal.documents.disk');
        $path = 'members/photos/'.Str::uuid().'.jpg';
        Storage::disk($disk)->put($path, $jpeg);

        $this->deleteFile($profile);
        $profile->forceFill(['photo_disk' => $disk, 'photo_path' => $path])->save();
    }

    public function delete(MemberProfile $profile): void
    {
        $this->deleteFile($profile);
        $profile->forceFill(['photo_disk' => null, 'photo_path' => null])->save();
    }

    public function response(MemberProfile $profile): StreamedResponse
    {
        return Storage::disk($profile->photo_disk)->response($profile->photo_path, null, [
            'Content-Type' => 'image/jpeg',
            // Private: the photo may only be visible to some users
            'Cache-Control' => 'private, max-age=300',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function deleteFile(MemberProfile $profile): void
    {
        if ($profile->photo_path) {
            Storage::disk($profile->photo_disk)->delete($profile->photo_path);
        }
    }
}
