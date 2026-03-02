<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->orderByRaw("CASE WHEN role = 'admin' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString(['page']);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function makeAdmin(Request $request, User $user): RedirectResponse
    {
        if ($user->role !== 'admin') {
            $user->update(['role' => 'admin']);
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', "{$user->name} is now an admin.");
    }
}

