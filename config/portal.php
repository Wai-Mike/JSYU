<?php

/*
|--------------------------------------------------------------------------
| JSYU Management Portal
|--------------------------------------------------------------------------
|
| Permission and role definitions for the admin portal. Run
| `php artisan portal:sync-access` after changing this file. Syncing only
| adds missing roles/permissions and keeps super_admin complete; it never
| removes grants that administrators changed through the portal.
|
| "Scoped" permissions can be granted for a county/payam (a geographic area)
| and then only apply to records inside that area. All other permissions
| only take effect when granted state-wide.
|
*/

return [

    'permissions' => [
        // Portal
        'portal.access' => ['name' => 'Access the management portal', 'group' => 'Portal', 'scoped' => true],

        // Organisation & Leadership
        'geography.view' => ['name' => 'View geographic areas', 'group' => 'Organisation', 'scoped' => true],
        'geography.manage' => ['name' => 'Manage geographic areas', 'group' => 'Organisation', 'scoped' => true],
        'organisation.view' => ['name' => 'View organisational structure', 'group' => 'Organisation', 'scoped' => true],
        'organisation.manage' => ['name' => 'Manage organisational units', 'group' => 'Organisation', 'scoped' => true],
        'positions.manage' => ['name' => 'Manage positions', 'group' => 'Organisation', 'scoped' => true],
        'appointments.view' => ['name' => 'View appointments & leadership history', 'group' => 'Organisation', 'scoped' => true],
        'appointments.manage' => ['name' => 'Appoint, transfer and end appointments', 'group' => 'Organisation', 'scoped' => true],
        'appointments.documents' => ['name' => 'View appointment documents', 'group' => 'Organisation', 'scoped' => true],
        'people.view' => ['name' => 'View people records', 'group' => 'Organisation', 'scoped' => true],
        'people.manage' => ['name' => 'Create and edit people records', 'group' => 'Organisation', 'scoped' => true],
        'teams.view' => ['name' => 'View management teams', 'group' => 'Organisation', 'scoped' => true],
        'teams.manage' => ['name' => 'Create and edit management teams', 'group' => 'Organisation', 'scoped' => true],

        // Youth management
        'members.view' => ['name' => 'View member profiles shared with officials', 'group' => 'Youth Management', 'scoped' => true],
        'members.review' => ['name' => 'Review, approve and reject membership applications', 'group' => 'Youth Management', 'scoped' => true],

        // Youth census
        'census.view' => ['name' => 'View census records and reports', 'group' => 'Census', 'scoped' => true],
        'census.collect' => ['name' => 'Enter census records', 'group' => 'Census', 'scoped' => true],
        'census.review' => ['name' => 'Approve and reject census records', 'group' => 'Census', 'scoped' => true],
        'census.manage' => ['name' => 'Create, open and close census campaigns', 'group' => 'Census', 'scoped' => true],
        // Disability and displacement status; state-wide only and granted deliberately
        'census.sensitive' => ['name' => 'View sensitive census fields (disability, displacement)', 'group' => 'Census', 'scoped' => false],

        // Elections
        'elections.view' => ['name' => 'View elections, turnout and results', 'group' => 'Elections', 'scoped' => true],
        'elections.manage' => ['name' => 'Create, open and close elections', 'group' => 'Elections', 'scoped' => true],
        'elections.certify' => ['name' => 'Certify and publish election results', 'group' => 'Elections', 'scoped' => true],

        // Content
        'content.manage' => ['name' => 'Create and edit website posts', 'group' => 'Content', 'scoped' => false],
        'content.publish' => ['name' => 'Approve and publish website posts', 'group' => 'Content', 'scoped' => false],

        // Administration
        'users.view' => ['name' => 'View user accounts', 'group' => 'Administration', 'scoped' => false],
        'roles.assign' => ['name' => 'Assign and revoke user roles', 'group' => 'Administration', 'scoped' => false],
        'roles.manage' => ['name' => 'Edit role permissions', 'group' => 'Administration', 'scoped' => false],
        'audit.view' => ['name' => 'View audit logs', 'group' => 'Administration', 'scoped' => false],
    ],

    /*
     | Default grants, applied only when a role is first created. super_admin
     | always receives every permission defined above.
     */
    'roles' => [
        'super_admin' => [
            'name' => 'Super Administrator',
            'description' => 'Full administrative access to configured modules.',
            'permissions' => '*',
        ],
        'state_executive' => [
            'name' => 'State Executive',
            'description' => 'State-level leadership with oversight of the whole Union.',
            'permissions' => [
                'portal.access', 'geography.view', 'organisation.view', 'appointments.view',
                'appointments.documents', 'people.view', 'teams.view', 'users.view', 'audit.view',
                'census.view', 'elections.view', 'elections.certify',
            ],
        ],
        'secretariat_admin' => [
            'name' => 'Secretariat Administrator',
            'description' => 'Maintains the organisational structure, positions and appointments.',
            'permissions' => [
                'portal.access', 'geography.view', 'geography.manage', 'organisation.view', 'organisation.manage',
                'positions.manage', 'appointments.view', 'appointments.manage', 'appointments.documents',
                'people.view', 'people.manage', 'teams.view', 'teams.manage', 'content.manage', 'users.view',
            ],
        ],
        'department_head' => [
            'name' => 'Department Head',
            'description' => 'Leads a department or office.',
            'permissions' => ['portal.access', 'organisation.view', 'appointments.view', 'people.view', 'teams.view'],
        ],
        'county_coordinator' => [
            'name' => 'County Coordinator',
            'description' => 'Coordinates Union structures within an assigned county.',
            'permissions' => [
                'portal.access', 'geography.view', 'organisation.view', 'appointments.view', 'people.view', 'teams.view',
            ],
        ],
        'payam_coordinator' => [
            'name' => 'Payam Coordinator',
            'description' => 'Coordinates Union structures within an assigned payam.',
            'permissions' => ['portal.access', 'geography.view', 'organisation.view', 'appointments.view', 'people.view', 'teams.view', 'members.view'],
        ],
        'membership_officer' => [
            'name' => 'Membership Officer',
            'description' => 'Reviews, approves and rejects membership applications.',
            'permissions' => ['portal.access', 'people.view', 'members.view', 'members.review'],
        ],
        'census_supervisor' => [
            'name' => 'Census Supervisor',
            'description' => 'Runs census campaigns and reviews collected records.',
            'permissions' => ['portal.access', 'geography.view', 'census.view', 'census.collect', 'census.review', 'census.manage'],
        ],
        'census_enumerator' => [
            'name' => 'Census Enumerator',
            'description' => 'Collects youth census records in an assigned area.',
            'permissions' => ['portal.access', 'census.collect'],
        ],
        'communications_officer' => [
            'name' => 'Communications Officer',
            'description' => 'Manages website content and communications.',
            'permissions' => ['portal.access', 'content.manage'],
        ],
        'election_officer' => [
            'name' => 'Election Officer',
            'description' => 'Sets up and runs internal elections.',
            'permissions' => ['portal.access', 'elections.view', 'elections.manage'],
        ],
        'program_officer' => [
            'name' => 'Program Officer',
            'description' => 'Manages programs and projects (module planned).',
            'permissions' => ['portal.access', 'organisation.view'],
        ],
    ],

    'geographic_levels' => [
        'country' => 'Country',
        'state' => 'State',
        'county' => 'County',
        'payam' => 'Payam',
        'boma' => 'Boma',
    ],

    // Which levels may sit directly under each level
    'geographic_children' => [
        'country' => ['state'],
        'state' => ['county'],
        'county' => ['payam'],
        'payam' => ['boma'],
        'boma' => [],
    ],

    // Levels allowed at the top of the tree. "state" stays allowed so trees
    // created before countries existed remain valid.
    'geographic_roots' => ['country', 'state'],

    'unit_types' => [
        'headquarters' => 'Headquarters',
        'county_office' => 'County Office',
        'payam_office' => 'Payam Coordination',
        'department' => 'Department',
        'committee' => 'Committee',
        'working_group' => 'Working Group',
        'special_assignment' => 'Special Assignment',
    ],

    'appointment_end_reasons' => [
        'term_completed' => 'Term completed',
        'resigned' => 'Resigned',
        'removed' => 'Removed from office',
        'transferred' => 'Transferred / replaced',
        'deceased' => 'Deceased',
        'other' => 'Other',
    ],

    'documents' => [
        'disk' => env('PORTAL_DOCUMENTS_DISK', 'local'),
        'max_kb' => 10240,
        'mimes' => ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    ],

    // Answer options for census records (keys are stored, labels are shown)
    'census' => [
        'min_age' => 15,
        'max_age' => 35,
        'sex' => ['male' => 'Male', 'female' => 'Female'],
        'education_levels' => [
            'none' => 'No formal education',
            'primary' => 'Primary',
            'secondary' => 'Secondary',
            'vocational' => 'Vocational / technical',
            'diploma' => 'Diploma',
            'degree' => 'University degree',
            'postgraduate' => 'Postgraduate',
        ],
        'employment_statuses' => [
            'student' => 'Student',
            'employed' => 'Employed',
            'self_employed' => 'Self-employed',
            'farming' => 'Farming / cattle keeping',
            'unemployed' => 'Unemployed, looking for work',
            'not_working' => 'Not working, not looking',
            'volunteer' => 'Volunteer',
        ],
        'disability' => ['none' => 'No disability', 'yes' => 'Has a disability', 'not_stated' => 'Prefers not to say'],
        'displacement_statuses' => [
            'none' => 'Not displaced',
            'idp' => 'Internally displaced (IDP)',
            'refugee' => 'Refugee',
            'returnee' => 'Returnee',
            'not_stated' => 'Prefers not to say',
        ],
    ],
];
