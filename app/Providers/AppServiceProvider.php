<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        app()->setLocale(session('locale', 'ar'));

        // Register route middleware alias for role-based read/write
        Route::aliasMiddleware('role.readwrite', \App\Http\Middleware\RoleReadWrite::class);
    }
}
