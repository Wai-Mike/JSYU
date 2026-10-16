<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Firebase Project
    |--------------------------------------------------------------------------
    |
    | Project ID must match the Firebase project that issued ID tokens.
    | Used as an extra guard when verifying tokens server-side.
    |
    */

    'project_id' => env('FIREBASE_PROJECT_ID'),

    /*
    |--------------------------------------------------------------------------
    | Service Account Credentials
    |--------------------------------------------------------------------------
    |
    | Absolute path to a service-account JSON file, or a JSON string.
    | Never expose these credentials to the browser or commit them to git.
    |
    | Example path: storage/app/firebase/service-account.json
    |
    */

    'credentials' => env('FIREBASE_CREDENTIALS'),

    /*
    |--------------------------------------------------------------------------
    | Check revoked tokens
    |--------------------------------------------------------------------------
    |
    | When true, verifyIdToken also checks the Firebase revocation list.
    | Slightly slower; enable if you need immediate logout after revoke.
    |
    */

    'check_revoked' => (bool) env('FIREBASE_CHECK_REVOKED', false),

];
