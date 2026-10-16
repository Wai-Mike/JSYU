<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Changing a live post, or publishing one, needs publishing rights (checked before validation)
        $post = $this->route('post');
        $touchesLiveContent = ($post && $post->status === \App\Models\Post::STATUS_PUBLISHED)
            || $this->input('status') === \App\Models\Post::STATUS_PUBLISHED;

        return ! $touchesLiveContent || \Illuminate\Support\Facades\Gate::allows('content.publish');
    }

    public function rules(): array
    {
        $post = $this->route('post');
        $slugRules = [$post ? 'required' : 'nullable', 'string', 'max:255'];
        $slugRules[] = $post
            ? Rule::unique('posts', 'slug')->ignore($post->id)
            : Rule::unique('posts', 'slug');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => $slugRules,
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string', 'in:article,program,announcement,resource'],
            'status' => ['required', 'string', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
            // Either upload an image, or provide an external URL.
            'featured_image' => ['nullable', 'string', 'max:500'],
            'featured_image_upload' => ['nullable', 'image', 'max:4096'],
        ];
    }
}
