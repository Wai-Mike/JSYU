<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guest\AssociationPageController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;

// Include auth routes
require __DIR__.'/auth.php';

// Include admin routes
require __DIR__.'/admin.php';

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Jonglei State Youth Union public pages
Route::get('/', [AssociationPageController::class, 'index'])->name('home');
Route::get('/programs', [AssociationPageController::class, 'programs'])->name('programs');

// Student Routes (Authenticated Students)
Route::middleware(['auth', 'verified', 'role:student'])->prefix('student')->group(function () {
    Route::get('/', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});

