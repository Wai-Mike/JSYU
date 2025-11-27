<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the student dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('student/dashboard/index', [
            'user' => $request->user(),
            'role' => $request->user()->role ?? 'student',
        ]);
    }
}

