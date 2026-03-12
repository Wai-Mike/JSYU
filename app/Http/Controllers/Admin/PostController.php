<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    private function deletePublicStorageUrl(?string $url): void
    {
        if (! $url) {
            return;
        }
        // We store uploaded images as Storage::url($path) => /storage/...
        if (str_starts_with($url, '/storage/')) {
            $relative = ltrim(str_replace('/storage/', '', $url), '/');
            Storage::disk('public')->delete($relative);
        }
    }

    public function index(Request $request): Response
    {
        $posts = Post::with('user:id,name')
            ->when($request->search, fn ($q) => $q->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('excerpt', 'like', '%' . $request->search . '%'))
            ->when($request->type, fn ($q) => $q->where('type', $request->type))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create', [
            'types' => Post::types(),
            'statuses' => Post::statuses(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $slug = Str::slug($request->input('slug', $request->input('title')));
        $slug = $this->ensureUniqueSlug($slug);

        $featuredImageUrl = $request->input('featured_image');
        if ($request->hasFile('featured_image_upload')) {
            $path = $request->file('featured_image_upload')->store('posts', 'public');
            $featuredImageUrl = Storage::url($path);
        }

        $post = Post::create([
            'user_id' => $request->user()->id,
            'title' => $request->input('title'),
            'slug' => $slug,
            'excerpt' => $request->input('excerpt'),
            'content' => $request->input('content'),
            'type' => $request->input('type'),
            'status' => $request->input('status'),
            'published_at' => $request->input('status') === Post::STATUS_PUBLISHED
                ? ($request->input('published_at') ?? now())
                : null,
            'featured_image' => $featuredImageUrl,
        ]);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post created successfully.');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'types' => Post::types(),
            'statuses' => Post::statuses(),
        ]);
    }

    public function update(StorePostRequest $request, Post $post): RedirectResponse
    {
        $slug = Str::slug($request->input('slug', $request->input('title')));
        $slug = $this->ensureUniqueSlug($slug, $post->id);

        $featuredImageUrl = $request->input('featured_image');
        if ($request->hasFile('featured_image_upload')) {
            $this->deletePublicStorageUrl($post->featured_image);
            $path = $request->file('featured_image_upload')->store('posts', 'public');
            $featuredImageUrl = Storage::url($path);
        }

        $post->update([
            'title' => $request->input('title'),
            'slug' => $slug,
            'excerpt' => $request->input('excerpt'),
            'content' => $request->input('content'),
            'type' => $request->input('type'),
            'status' => $request->input('status'),
            'published_at' => $request->input('status') === Post::STATUS_PUBLISHED
                ? ($request->input('published_at') ?? $post->published_at ?? now())
                : null,
            'featured_image' => $featuredImageUrl,
        ]);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post updated successfully.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        return redirect()->route('admin.posts.index')
            ->with('success', 'Post deleted.');
    }

    public function approve(Post $post): RedirectResponse
    {
        $post->update([
            'status' => Post::STATUS_PUBLISHED,
            'published_at' => $post->published_at ?? now(),
        ]);
        return redirect()->route('admin.posts.index')
            ->with('success', 'Post approved and published.');
    }

    private function ensureUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $query = Post::where('slug', $slug);
        if ($ignoreId !== null) {
            $query->where('id', '!=', $ignoreId);
        }
        if ($query->exists()) {
            return $slug . '-' . Str::lower(Str::random(5));
        }
        return $slug;
    }
}
