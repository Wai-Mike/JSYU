<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A member's profile, attached to their person record (never a separate
 * identity). Contact name/email/phone/gender live on the person.
 */
class MemberProfile extends Model
{
    public const VISIBILITY_PRIVATE = 'private';

    public const VISIBILITY_OFFICIALS = 'officials';

    public const VISIBILITY_MEMBERS = 'members';

    public const VISIBILITIES = [
        self::VISIBILITY_PRIVATE => 'Only me',
        self::VISIBILITY_OFFICIALS => 'Me and authorised JSYU officials',
        self::VISIBILITY_MEMBERS => 'Also other signed-in members',
    ];

    protected $fillable = [
        'first_name', 'middle_name', 'last_name', 'date_of_birth', 'alternative_phone',
        'home_area_id', 'current_country_code', 'current_location', 'bio', 'visibility',
    ];

    protected $hidden = ['photo_disk', 'photo_path'];

    protected function casts(): array
    {
        return ['date_of_birth' => 'date'];
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    public function homeArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class, 'home_area_id');
    }

    /** Age in whole years, always derived from the date of birth. */
    protected function age(): Attribute
    {
        return Attribute::get(fn () => $this->date_of_birth?->age);
    }

    public function hasPhoto(): bool
    {
        return $this->photo_path !== null;
    }

    public function isOwnedBy(?User $user): bool
    {
        return $user !== null && $this->person?->user_id === $user->id;
    }

    /**
     * Which applicable sections have been answered. This measures whether a
     * section is filled in, not how strong someone's background is.
     *
     * @return array<int, array{key: string, label: string, complete: bool}>
     */
    public function completeness(): array
    {
        $person = $this->person;

        return [
            ['key' => 'personal', 'label' => 'Name & date of birth', 'complete' => filled($this->first_name) && filled($this->last_name) && $this->date_of_birth !== null],
            ['key' => 'contact', 'label' => 'Contact details', 'complete' => filled($person?->phone) || filled($person?->email)],
            ['key' => 'origin', 'label' => 'Home area', 'complete' => $this->home_area_id !== null],
            ['key' => 'residence', 'label' => 'Where you live now', 'complete' => filled($this->current_country_code)],
        ];
    }
}
