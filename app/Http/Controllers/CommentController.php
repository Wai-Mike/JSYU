<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommentController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'post_id' => ['required', Rule::exists('posts', 'id')],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $post = Post::published()->where('id', $validated['post_id'])->firstOrFail();

        Comment::create([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        return back()->with('success', 'Comment added.');
    }
}
