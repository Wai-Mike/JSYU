<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssociationPageController extends Controller
{
    /**
     * Display the association home page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('association/main/index', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Display the association programs page.
     */
    public function programs(Request $request): Response
    {
        return Inertia::render('association/programs/index', [
            'user' => $request->user(),
        ]);
    }
}


