<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\Organisation\AppointmentController;
use App\Http\Controllers\Admin\Organisation\AppointmentDocumentController;
use App\Http\Controllers\Admin\Organisation\GeographicAreaController;
use App\Http\Controllers\Admin\Organisation\OrganisationUnitController;
use App\Http\Controllers\Admin\Organisation\PersonController;
use App\Http\Controllers\Admin\Organisation\PositionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Auth\RegisterController;

// Admin portal, served from its own subdomain (config: app.admin_domain)
Route::domain(config('app.admin_domain'))->group(function () {
    // Admin-only login
    Route::middleware('guest')->group(function () {
        Route::get('/login', [RegisterController::class, 'showAdminLoginForm'])->name('admin.login');
        Route::post('/login', [RegisterController::class, 'adminLogin'])->middleware('throttle:10,1');
    });

    // Portal users (any account holding portal.access). Each controller action
    // also authorises the specific permission and jurisdiction it needs.
    Route::middleware(['auth', 'verified', 'portal'])->name('admin.')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Organisation & leadership
        Route::prefix('organisation')->name('organisation.')->group(function () {
            Route::get('/geography', [GeographicAreaController::class, 'index'])->name('geography.index');
            Route::post('/geography', [GeographicAreaController::class, 'store'])->name('geography.store');
            Route::put('/geography/{area}', [GeographicAreaController::class, 'update'])->name('geography.update');
            Route::delete('/geography/{area}', [GeographicAreaController::class, 'destroy'])->name('geography.destroy');

            Route::get('/units', [OrganisationUnitController::class, 'index'])->name('units.index');
            Route::post('/units', [OrganisationUnitController::class, 'store'])->name('units.store');
            Route::get('/units/{unit}', [OrganisationUnitController::class, 'show'])->name('units.show');
            Route::put('/units/{unit}', [OrganisationUnitController::class, 'update'])->name('units.update');
            Route::delete('/units/{unit}', [OrganisationUnitController::class, 'destroy'])->name('units.destroy');

            Route::post('/units/{unit}/positions', [PositionController::class, 'store'])->name('positions.store');
            Route::put('/positions/{position}', [PositionController::class, 'update'])->name('positions.update');
            Route::delete('/positions/{position}', [PositionController::class, 'destroy'])->name('positions.destroy');

            Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
            Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
            Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])->name('appointments.show');
            Route::post('/appointments/{appointment}/end', [AppointmentController::class, 'end'])->name('appointments.end');
            Route::post('/appointments/{appointment}/transfer', [AppointmentController::class, 'transfer'])->name('appointments.transfer');
            Route::post('/appointments/{appointment}/documents', [AppointmentDocumentController::class, 'store'])->name('appointments.documents.store');
            Route::get('/appointments/{appointment}/documents/{document}', [AppointmentDocumentController::class, 'download'])->name('appointments.documents.download');
            Route::delete('/appointments/{appointment}/documents/{document}', [AppointmentDocumentController::class, 'destroy'])->name('appointments.documents.destroy');

            Route::get('/people', [PersonController::class, 'index'])->name('people.index');
            Route::get('/people/search', [PersonController::class, 'search'])->name('people.search');
            Route::post('/people', [PersonController::class, 'store'])->name('people.store');
            Route::put('/people/{person}', [PersonController::class, 'update'])->name('people.update');
        });

        // Users, roles and audit
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users/{user}/roles', [AdminUserController::class, 'assignRole'])->name('users.roles.store');
        Route::delete('/role-assignments/{assignment}', [AdminUserController::class, 'revokeRole'])->name('users.roles.destroy');
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit.index');

        // Blog / Posts (articles, programs, announcements)
        Route::middleware('can:content.manage')->group(function () {
            Route::post('/posts/{post}/approve', [AdminPostController::class, 'approve'])->middleware('can:content.publish')->name('posts.approve');
            Route::resource('posts', AdminPostController::class)->names('posts')->except(['show']);
        });
    });
});
