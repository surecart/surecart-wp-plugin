<?php

namespace SureCart\Tests\Services;

use SureCart\Models\Product;
use SureCart\Sync\ContentSyncService;
use SureCart\Tests\SureCartUnitTestCase;

class ContentSyncServiceTest extends SureCartUnitTestCase {
    protected $service;

    public function setUp(): void {
        parent::setUp();

		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

        $this->service = new ContentSyncService();
    }

    public function test_setContent() {
        $product = new Product([
            'metadata' => [
                'surecart_content_sync_key' => '123',
            ],
        ]);
        set_transient( '123', 'test content' );
        $props = $this->service->setContent( [], $product);
        $this->assertEquals( 'test content', $props['post_content'] );
    }

    public function test_do_not_sync_if_no_content() {
        $props = $this->service->maybeStageContentSync( [
            'id' => '123',
        ] );
        $this->assertArrayNotHasKey( 'metadata', $props );
    }

    public function test_sync_if_content() {
        $props = $this->service->maybeStageContentSync( [
            'id' => '123',
            'content' => 'test content',
        ] );
        $this->assertNotEmpty( $props['metadata']['surecart_content_sync_key'] );
        $this->assertEquals( 'test content', get_transient( $props['metadata']['surecart_content_sync_key'] ) );
    }
}