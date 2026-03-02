<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $quote = ['message' => 'Together we can make a difference.', 'author' => 'Jonglei State Youth Union'];
        try {
            $quoteStr = Inspiring::quotes()->random();
            $parts = str($quoteStr)->explode('-');
            $quote = [
                'message' => trim($parts[0] ?? $quoteStr),
                'author' => trim($parts[1] ?? ''),
            ];
        } catch (\Throwable $e) {
            // Use default quote if Inspiring fails
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => $quote,
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ]
        ];
    }
}
