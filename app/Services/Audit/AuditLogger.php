<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

/**
 * Records privileged actions. Never pass passwords, tokens or sensitive
 * personal content in $properties: store identifiers and changed field names.
 */
class AuditLogger
{
    private const REDACTED_KEYS = ['password', 'password_confirmation', 'remember_token', 'token', 'secret', 'notes'];

    public function log(string $action, ?Model $subject = null, ?string $description = null, array $properties = []): AuditLog
    {
        $request = request();

        return AuditLog::query()->forceCreate([
            'user_id' => $request?->user()?->id,
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $this->redact($properties) ?: null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request ? substr((string) $request->userAgent(), 0, 255) : null,
            'created_at' => now(),
        ]);
    }

    /** Old/new values for the fields that changed on a just-saved model. */
    public function changes(Model $model): array
    {
        $changed = array_diff(array_keys($model->getChanges()), ['updated_at', 'path']);

        return [
            'old' => array_intersect_key($model->getPrevious(), array_flip($changed)),
            'new' => array_intersect_key($model->getChanges(), array_flip($changed)),
        ];
    }

    private function redact(array $properties): array
    {
        foreach ($properties as $key => $value) {
            if (is_array($value)) {
                $properties[$key] = $this->redact($value);
            } elseif (in_array($key, self::REDACTED_KEYS, true)) {
                $properties[$key] = '[redacted]';
            }
        }

        return $properties;
    }
}
