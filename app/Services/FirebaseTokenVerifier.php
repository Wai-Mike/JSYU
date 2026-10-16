<?php

namespace App\Services;

use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Exception\Auth\RevokedIdToken;
use Kreait\Firebase\Factory;
use Kreait\Firebase\JWT\Error\IdTokenVerificationFailed;
use Kreait\Firebase\JWT\IdTokenVerifier;
use RuntimeException;

class FirebaseTokenVerifier
{
    private ?FirebaseAuth $auth = null;

    /**
     * Verify a Firebase ID token and return normalized identity claims.
     *
     * @return array{uid: string, email: ?string, name: ?string, picture: ?string, email_verified: bool}
     *
     * @throws FailedToVerifyToken
     * @throws RevokedIdToken
     * @throws IdTokenVerificationFailed
     * @throws RuntimeException
     */
    public function verify(string $idToken): array
    {
        $claims = $this->claims($idToken);
        $uid = (string) ($claims['sub'] ?? '');
        $projectId = config('firebase.project_id');

        if ($projectId) {
            $audience = $claims['aud'] ?? null;
            $audiences = is_array($audience) ? $audience : [$audience];

            if (! in_array($projectId, $audiences, true)) {
                throw new RuntimeException('Firebase token audience does not match this application.');
            }
        }

        $email = $claims['email'] ?? null;
        $name = $claims['name'] ?? null;
        $picture = $claims['picture'] ?? null;
        $emailVerified = (bool) ($claims['email_verified'] ?? false);

        if ($uid === '') {
            throw new RuntimeException('Firebase token is missing a subject.');
        }

        return [
            'uid' => $uid,
            'email' => is_string($email) ? strtolower($email) : null,
            'name' => is_string($name) ? $name : null,
            'picture' => is_string($picture) ? $picture : null,
            'email_verified' => $emailVerified,
        ];
    }

    /**
     * Verify the token and return its payload. Uses the Admin SDK when a service account is
     * configured; otherwise verifies against Google's public keys using only the project ID.
     *
     * @return array<string, mixed>
     */
    protected function claims(string $idToken): array
    {
        if ($this->auth instanceof FirebaseAuth || $this->hasCredentials()) {
            return $this->auth()
                ->verifyIdToken($idToken, config('firebase.check_revoked', false))
                ->claims()
                ->all();
        }

        $projectId = config('firebase.project_id');

        if (! is_string($projectId) || trim($projectId) === '') {
            throw new RuntimeException('Firebase is not configured. Set FIREBASE_PROJECT_ID or FIREBASE_CREDENTIALS.');
        }

        return IdTokenVerifier::createWithProjectId($projectId)
            ->verifyIdToken($idToken)
            ->payload();
    }

    protected function hasCredentials(): bool
    {
        $credentials = config('firebase.credentials');

        return is_string($credentials) && trim($credentials) !== '';
    }

    protected function auth(): FirebaseAuth
    {
        if ($this->auth instanceof FirebaseAuth) {
            return $this->auth;
        }

        $credentials = config('firebase.credentials');

        if (! is_string($credentials) || trim($credentials) === '') {
            throw new RuntimeException('Firebase Admin credentials are not configured.');
        }

        $factory = new Factory;

        if (is_file($credentials)) {
            $factory = $factory->withServiceAccount($credentials);
        } else {
            $decoded = json_decode($credentials, true);

            if (! is_array($decoded)) {
                throw new RuntimeException('Firebase Admin credentials must be a valid JSON file path or JSON string.');
            }

            $factory = $factory->withServiceAccount($decoded);
        }

        if ($projectId = config('firebase.project_id')) {
            $factory = $factory->withProjectId($projectId);
        }

        $this->auth = $factory->createAuth();

        return $this->auth;
    }

    /**
     * Allow tests to inject a mock Auth contract without touching credentials.
     */
    public function setAuth(FirebaseAuth $auth): void
    {
        $this->auth = $auth;
    }
}
