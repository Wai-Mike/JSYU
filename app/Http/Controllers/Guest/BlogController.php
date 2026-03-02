<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Post::with('user:id,name')
            ->withCount([
                'comments',
                'reactions as likes_count' => fn ($q) => $q->where('type', 'like'),
                'reactions as hearts_count' => fn ($q) => $q->where('type', 'heart'),
            ])
            ->published()
            ->when($request->type, fn ($q) => $q->where('type', $request->type))
            ->latest('published_at');

        if ($user) {
            $query->with(['reactions' => fn ($q) => $q->where('user_id', $user->id)]);
        }

        $posts = $query->paginate(9)->withQueryString();

        if ($user) {
            $posts->getCollection()->transform(function (Post $post) {
                $post->current_user_reactions = [
                    'like' => $post->reactions->contains(fn ($r) => $r->type === 'like'),
                    'heart' => $post->reactions->contains(fn ($r) => $r->type === 'heart'),
                ];
                unset($post->reactions);
                return $post;
            });
        }

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'filters' => $request->only(['type']),
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Post::with(['user:id,name', 'comments' => fn ($q) => $q->with('user:id,name')->latest()])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        return Inertia::render('blog/show', [
            'post' => $post,
        ]);
    }
}
