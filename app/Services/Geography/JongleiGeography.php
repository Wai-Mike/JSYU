<?php

namespace App\Services\Geography;

use App\Models\GeographicArea;
use App\Models\GeographicAreaAlias;
use Illuminate\Support\Facades\DB;

/**
 * Seeds the approved South Sudan → Jonglei State → county structure.
 *
 * Safe to run repeatedly: records are matched by stable code, then by name or
 * known alias, and existing records are adopted rather than duplicated. It
 * never deletes, renames or merges; anything ambiguous is reported for a person
 * to reconcile. Payams and bomas are deliberately not seeded.
 */
class JongleiGeography
{
    public const COUNTRY = ['code' => 'SS', 'name' => 'South Sudan', 'aliases' => ['Republic of South Sudan']];

    public const STATE = ['code' => 'SS-JG', 'name' => 'Jonglei State', 'aliases' => ['Jonglei']];

    /** The nine canonical counties approved for JSYU, with recognised alternative names. */
    public const COUNTIES = [
        ['code' => 'SS-JG-AKO', 'name' => 'Akobo', 'aliases' => []],
        ['code' => 'SS-JG-AYO', 'name' => 'Ayod', 'aliases' => []],
        ['code' => 'SS-JG-BOR', 'name' => 'Bor', 'aliases' => ['Bor South']],
        ['code' => 'SS-JG-DUK', 'name' => 'Duk', 'aliases' => []],
        ['code' => 'SS-JG-FAN', 'name' => 'Fangak', 'aliases' => []],
        ['code' => 'SS-JG-NYI', 'name' => 'Nyirol', 'aliases' => []],
        ['code' => 'SS-JG-PIG', 'name' => 'Pigi', 'aliases' => ['Canal/Pigi', 'Canal-Pigi']],
        ['code' => 'SS-JG-TWE', 'name' => 'Twic East', 'aliases' => []],
        ['code' => 'SS-JG-URO', 'name' => 'Uror', 'aliases' => []],
    ];

    /** @var array{created: string[], adopted: string[], aliases: string[], conflicts: string[]} */
    private array $report;

    /** @return array{created: string[], adopted: string[], aliases: string[], conflicts: string[]} */
    public function sync(): array
    {
        $this->report = ['created' => [], 'adopted' => [], 'aliases' => [], 'conflicts' => []];

        DB::transaction(function () {
            $country = $this->ensure('country', self::COUNTRY, null);
            // Trees created before countries existed may have Jonglei as a top-level state
            $state = $this->ensure('state', self::STATE, $country, adoptFromRoot: true);

            if ($state) {
                foreach (self::COUNTIES as $county) {
                    $this->ensure('county', $county, $state);
                }
            }
        });

        return $this->report;
    }

    public function state(): ?GeographicArea
    {
        return GeographicArea::query()->where('code', self::STATE['code'])->first();
    }

    private function ensure(string $level, array $definition, ?GeographicArea $parent, bool $adoptFromRoot = false): ?GeographicArea
    {
        $label = "{$definition['name']} ({$level})";
        $area = GeographicArea::query()->where('code', $definition['code'])->first();

        if ($area) {
            if ($area->parent_id !== $parent?->id) {
                $this->report['conflicts'][] = "{$label}: record #{$area->id} with code {$definition['code']} sits under a different parent; left unchanged.";
            }
        } else {
            $area = $this->adopt($level, $definition, $parent, $adoptFromRoot);
        }

        if (! $area) {
            $area = GeographicArea::query()->create([
                'parent_id' => $parent?->id,
                'level' => $level,
                'name' => $definition['name'],
                'code' => $definition['code'],
            ]);
            $this->report['created'][] = $label;
        }

        $this->ensureAliases($area, $definition['aliases']);

        return $area;
    }

    /** Reuse an existing record that matches by name or alias instead of creating a duplicate. */
    private function adopt(string $level, array $definition, ?GeographicArea $parent, bool $adoptFromRoot): ?GeographicArea
    {
        $names = collect([$definition['name'], ...$definition['aliases']])->map(fn ($n) => GeographicAreaAlias::normalize($n));

        $candidates = GeographicArea::query()
            ->where('level', $level)
            ->where(function ($q) use ($parent, $adoptFromRoot) {
                $q->where('parent_id', $parent?->id);
                if ($adoptFromRoot) {
                    $q->orWhereNull('parent_id');
                }
            })
            ->get()
            ->filter(fn (GeographicArea $a) => $names->contains(GeographicAreaAlias::normalize($a->name))
                || $a->aliases()->whereIn('normalized', $names)->exists())
            ->values();

        if ($candidates->isEmpty()) {
            return null;
        }

        // Prefer an exact canonical-name match; flag any others as possible duplicates
        $canonical = GeographicAreaAlias::normalize($definition['name']);
        $chosen = $candidates->first(fn ($a) => GeographicAreaAlias::normalize($a->name) === $canonical) ?? $candidates->first();

        foreach ($candidates->reject(fn ($a) => $a->is($chosen)) as $other) {
            $this->report['conflicts'][] = "{$definition['name']} ({$level}): \"{$other->name}\" (#{$other->id}) looks like a duplicate of \"{$chosen->name}\" (#{$chosen->id}). Not merged — reconcile manually.";
        }

        if ($chosen->code !== null && $chosen->code !== $definition['code']) {
            $this->report['conflicts'][] = "{$definition['name']} ({$level}): existing record #{$chosen->id} already has code {$chosen->code}; left unchanged.";

            return $chosen;
        }

        $changes = ['code' => $definition['code']];
        $notes = [];

        if ($chosen->parent_id !== $parent?->id) {
            $changes['parent_id'] = $parent?->id;
            $notes[] = 'moved under '.$parent?->name;
        }

        if (GeographicAreaAlias::normalize($chosen->name) !== $canonical) {
            // Never rename silently: keep the existing name and record it as an alias-matched adoption
            $notes[] = "kept existing name \"{$chosen->name}\"; canonical name is \"{$definition['name']}\" — rename after review";
        }

        $chosen->update($changes);
        $this->report['adopted'][] = "{$definition['name']} ({$level}) ← existing #{$chosen->id}".($notes ? ' ('.implode('; ', $notes).')' : '');

        return $chosen;
    }

    private function ensureAliases(GeographicArea $area, array $aliases): void
    {
        $siblings = GeographicArea::query()->where('parent_id', $area->parent_id)->whereKeyNot($area->id)->pluck('id');

        foreach ($aliases as $alias) {
            $normalized = GeographicAreaAlias::normalize($alias);

            if ($normalized === GeographicAreaAlias::normalize($area->name)) {
                continue;
            }

            $takenBySibling = GeographicAreaAlias::query()->whereIn('geographic_area_id', $siblings)->where('normalized', $normalized)->exists()
                || GeographicArea::query()->whereIn('id', $siblings)->get()->contains(fn ($s) => GeographicAreaAlias::normalize($s->name) === $normalized);

            if ($takenBySibling) {
                $this->report['conflicts'][] = "Alias \"{$alias}\" for {$area->name} is already used by another area at the same level; not added.";

                continue;
            }

            $created = GeographicAreaAlias::query()->firstOrCreate(
                ['geographic_area_id' => $area->id, 'normalized' => $normalized],
                ['alias' => $alias],
            );

            if ($created->wasRecentlyCreated) {
                $this->report['aliases'][] = "{$alias} → {$area->name}";
            }
        }
    }
}
