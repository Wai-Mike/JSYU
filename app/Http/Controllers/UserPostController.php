<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserPostController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('blog/create', [
            'types' => Post::types(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string', 'in:article,program,announcement,resource'],
        ]);

        $slug = $this->uniqueSlug(Str::slug($validated['title']));

        Post::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'type' => $validated['type'],
            'status' => Post::STATUS_DRAFT,
            'published_at' => null,
        ]);

        return redirect()->route('blog.index')->with('success', 'Your post has been submitted and is pending approval.');
    }

    private function uniqueSlug(string $slug): string
    {
        $base = $slug;
        $n = 0;
        while (Post::where('slug', $slug)->exists()) {
            $slug = $base . '-' . (++$n);
        }
        return $slug;
    }
}
