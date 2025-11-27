<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('guest/main/index', [
            'user' => $request->user(),
        ]);
    }
}

