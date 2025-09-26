<?php

namespace SureCart\Tests\Services;

use SureCart\Sync\ContentSyncService;
use SureCart\Tests\SureCartUnitTestCase;

class ContentSyncServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);
	}

	public function test_calls_content_batch_on_productimport_created() {
        $content_sync_service = \Mockery::mock(ContentSyncService::class)->makePartial();

        $content_sync_service->shouldReceive('setContentBatch')->once();
        $content_sync_service->bootstrap();

        do_action('surecart/models/productimport/created', (object) [
            'id' => 8507,
        ]);

        $this->assertSame(array('surecart_import_content_sync8507' => 8507), get_transient('surecart_batches_check'));
	}
}