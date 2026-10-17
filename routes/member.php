<?php

use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\MembershipController;
use Illuminate\Support\Facades\Route;

// Member area, part of the portal (config: app.admin_domain) under /member
Route::domain(config('app.admin_domain'))->prefix('member')->middleware(['auth', 'verified'])->name('member.')->group(function () {
    Route::get('/', [MemberDashboardController::class, 'index'])->name('dashboard');
    Route::get('/membership', [MembershipController::class, 'edit'])->name('membership.edit');
    Route::post('/membership', [MembershipController::class, 'update'])->name('membership.update');
});
