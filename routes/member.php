<?php

use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\MembershipController;
use Illuminate\Support\Facades\Route;

// Member area, served from its own subdomain (config: app.member_domain)
Route::domain(config('app.member_domain'))->middleware(['auth', 'verified'])->name('member.')->group(function () {
    Route::get('/', [MemberDashboardController::class, 'index'])->name('dashboard');
    Route::get('/membership', [MembershipController::class, 'edit'])->name('membership.edit');
    Route::post('/membership', [MembershipController::class, 'update'])->name('membership.update');
});
