<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\Guest\AssociationPageController;
use App\Http\Controllers\Guest\BlogController;
use App\Http\Controllers\PostReactionController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\UserPostController;

// Include auth routes
require __DIR__.'/auth.php';

// Include admin routes
require __DIR__.'/admin.php';

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Jonglei State Youth Union public pages
Route::get('/', [AssociationPageController::class, 'index'])->name('home');
Route::get('/programs', [AssociationPageController::class, 'programs'])->name('programs');
Route::get('/work-plan', [AssociationPageController::class, 'workPlan'])->name('work-plan');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// Authenticated users: write post (draft, pending approval) and comment
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/blog-create', [UserPostController::class, 'create'])->name('blog.create');
    Route::post('/blog-create', [UserPostController::class, 'store'])->name('blog.store');
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/reactions/toggle', [PostReactionController::class, 'toggle'])->name('reactions.toggle');
});

// Student Routes (Authenticated Students)
Route::middleware(['auth', 'verified', 'role:student'])->prefix('student')->group(function () {
    Route::get('/', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});

