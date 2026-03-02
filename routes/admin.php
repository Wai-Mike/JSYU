<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\PostController as AdminPostController;

// Admin Routes (Authenticated Admins)
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Admin user management (promote users to admin)
    Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::post('/users/{user}/make-admin', [AdminUserController::class, 'makeAdmin'])->name('admin.users.make-admin');

    // Blog / Posts (articles, programs, announcements)
    Route::post('/posts/{post}/approve', [AdminPostController::class, 'approve'])->name('admin.posts.approve');
    Route::resource('posts', AdminPostController::class)->names('admin.posts')->except(['show']);
});

