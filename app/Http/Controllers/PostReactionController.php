<?php

namespace App\Http\Controllers;

use App\Models\PostReaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PostReactionController extends Controller
{
    public function toggle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'post_id' => ['required', 'integer', Rule::exists('posts', 'id')],
            'type' => ['required', 'string', Rule::in(['like', 'heart'])],
        ]);

        $userId = $request->user()->id;

        $existing = PostReaction::where('post_id', $validated['post_id'])
            ->where('user_id', $userId)
            ->where('type', $validated['type'])
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            PostReaction::create([
                'post_id' => $validated['post_id'],
                'user_id' => $userId,
                'type' => $validated['type'],
            ]);
        }

        return back();
    }
}

