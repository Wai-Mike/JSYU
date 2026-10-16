<?php

namespace Tests\Feature\Portal;

use App\Models\AuditLog;
use App\Models\Post;
use App\Services\Audit\AuditLogger;

class ContentAndAuditTest extends PortalTestCase
{
    private function postPayload(array $extra = []): array
    {
        return ['title' => 'Youth forum', 'content' => '<p>Body</p>', 'type' => 'announcement', 'status' => 'draft', ...$extra];
    }

    public function test_content_writers_can_draft_but_not_publish(): void
    {
        $writer = $this->userWithRole('communications_officer');

        $this->actingAs($writer)->post(route('admin.posts.store'), $this->postPayload())->assertRedirect(route('admin.posts.index'));
        $post = Post::query()->firstOrFail();
        $this->assertSame('draft', $post->status);

        $this->actingAs($writer)->post(route('admin.posts.store'), $this->postPayload(['title' => 'Sneaky', 'status' => 'published']))
            ->assertForbidden();
        $this->actingAs($writer)->post(route('admin.posts.approve', $post))->assertForbidden();
        $this->assertSame('draft', $post->fresh()->status);
    }

    public function test_publishers_can_approve_and_publication_is_audited(): void
    {
        $admin = $this->userWithRole('super_admin');
        $post = Post::query()->create(['user_id' => $admin->id, 'title' => 'Draft', 'slug' => 'draft', 'content' => 'x', 'type' => 'article', 'status' => 'draft']);

        $this->actingAs($admin)->post(route('admin.posts.approve', $post))->assertRedirect();

        $this->assertSame('published', $post->fresh()->status);
        $this->assertTrue(AuditLog::query()->where('action', 'post.published')->where('subject_id', $post->id)->exists());
    }

    public function test_writers_cannot_edit_live_posts(): void
    {
        $writer = $this->userWithRole('communications_officer');
        $post = Post::query()->create(['user_id' => $writer->id, 'title' => 'Live', 'slug' => 'live', 'content' => 'x', 'type' => 'article', 'status' => 'published', 'published_at' => now()]);

        $this->actingAs($writer)->put(route('admin.posts.update', $post), $this->postPayload(['title' => 'Changed']))->assertForbidden();
        $this->actingAs($writer)->delete(route('admin.posts.destroy', $post))->assertForbidden();
        $this->assertSame('Live', $post->fresh()->title);
    }

    public function test_audit_log_requires_statewide_audit_permission(): void
    {
        $this->actingAs($this->userWithRole('county_coordinator', $this->countyA))->get(route('admin.audit.index'))->assertForbidden();
        $this->actingAs($this->userWithRole('state_executive'))->get(route('admin.audit.index'))->assertOk();
    }

    public function test_audit_logger_redacts_sensitive_values(): void
    {
        $log = app(AuditLogger::class)->log('test.action', null, 'Test', ['password' => 'hunter2', 'nested' => ['token' => 'abc', 'kept' => 'ok']]);

        $this->assertSame('[redacted]', $log->properties['password']);
        $this->assertSame('[redacted]', $log->properties['nested']['token']);
        $this->assertSame('ok', $log->properties['nested']['kept']);
    }
}
