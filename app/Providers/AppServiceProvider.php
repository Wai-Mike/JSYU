<?php

namespace App\Providers;

use App\Models\User;
use App\Services\Access\AccessControl;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // One instance per request so permission lookups are cached but never leak between requests
        $this->app->scoped(AccessControl::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Every portal permission is also a Gate ability: Gate::allows('audit.view') or
        // `can:audit.view` checks the state-wide grant; pass an area for scoped checks.
        foreach (array_keys(config('portal.permissions', [])) as $permission) {
            Gate::define($permission, fn (User $user, $area = null) => app(AccessControl::class)->allows($user, $permission, $area));
        }
    }
}
