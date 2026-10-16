<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\Guest\AssociationPageController;
use App\Http\Controllers\Guest\BlogController;
use App\Http\Controllers\PostReactionController;
use App\Http\Controllers\UserPostController;

// Include the subdomain routes first: they are bound to their own hosts and
// must take precedence over the domain-less auth routes (e.g. /login).
require __DIR__.'/admin.php';
require __DIR__.'/member.php';

// Include auth routes
require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::domain(config('app.domain'))->group(function () {
    // Jonglei State Youth Union public pages
    Route::get('/', [AssociationPageController::class, 'index'])->name('home');
    Route::get('/programs', [AssociationPageController::class, 'programs'])->name('programs');
    Route::get('/work-plan', [AssociationPageController::class, 'workPlan'])->name('work-plan');
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

    // Old /admin URLs now live on the admin subdomain
    Route::get('/admin/{path?}', function (?string $path = null) {
        return redirect()->away(rtrim(route('admin.dashboard'), '/').'/'.$path);
    })->where('path', '.*');

    // The old student dashboard is replaced by the member subdomain
    Route::get('/student/{path?}', fn () => redirect()->away(route('member.dashboard'), 301))->where('path', '.*');

    // Authenticated users: write post (draft, pending approval) and comment
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/blog-create', [UserPostController::class, 'create'])->name('blog.create');
        Route::post('/blog-create', [UserPostController::class, 'store'])->name('blog.store');
        Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
        Route::post('/reactions/toggle', [PostReactionController::class, 'toggle'])->name('reactions.toggle');
    });
});
