<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('user/dashboard/index', [
            'user' => $request->user(),
            'role' => $request->user()->role ?? 'user',
        ]);
    }
}

