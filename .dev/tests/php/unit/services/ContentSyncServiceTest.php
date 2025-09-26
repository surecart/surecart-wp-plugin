<?php

namespace SureCart\Tests\Services;

use SureCart\Sync\ContentSyncService;
use SureCart\Sync\BatchCheckService;
use SureCart\Sync\ProductsSyncService;
use SureCart\Models\Import;
use SureCart\Tests\SureCartUnitTestCase;

class ContentSyncServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Mock application container.
	 *
	 * @var \Mockery\MockInterface
	 */
	protected $app;

	/**
	 * ContentSyncService instance.
	 *
	 * @var ContentSyncService
	 */
	protected $service;

	/**
	 * Mock BatchCheckService.
	 *
	 * @var \Mockery\MockInterface
	 */
	protected $batch_service;

	/**
	 * Mock ProductsSyncService.
	 *
	 * @var \Mockery\MockInterface
	 */
	protected $sync_service;

	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		// Mock notices service to prevent actual output
		$notices = \Mockery::mock('stdClass');
		$notices->shouldReceive('add')
			->andReturn(true);
		\SureCart::alias('notices', function() use ($notices) {
			return $notices;
		});

		// Create mocks for dependencies
		$this->batch_service = \Mockery::mock(BatchCheckService::class);
		$this->sync_service = \Mockery::mock(ProductsSyncService::class);

		// Create mock app that will return our mocked services
		$this->app = \Mockery::mock('stdClass');
		$this->app->shouldReceive('resolve')
			->with('surecart.sync.batch')
			->andReturn($this->batch_service);
		$this->app->shouldReceive('resolve')
			->with('surecart.sync.products')
			->andReturn($this->sync_service);

		// Create service instance with mocked app
		$this->service = new ContentSyncService($this->app);
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

	/**
	 * Test maybeCheckImport returns false when no imports exist.
	 */
	public function test_maybe_check_import_returns_false_when_no_imports() {
		// Mock batch service to return empty array
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn([]);

		$result = $this->service->maybeCheckImport();

		$this->assertFalse($result);
	}

	/**
	 * Test maybeCheckImport returns false when Import::find returns WP_Error.
	 */
	public function test_maybe_check_import_returns_false_on_wp_error() {
		// Mock batch service to return an import ID
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_123']);

		// Mock Import::find to return WP_Error
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_123')
			->andReturn(new \WP_Error('error_code', 'Error message'));

		$result = $this->service->maybeCheckImport();

		$this->assertFalse($result);
	}

	/**
	 * Test maybeCheckImport returns false and shows notice for invalid status.
	 */
	public function test_maybe_check_import_returns_false_for_pending_status() {
		// Mock batch service to return an import ID
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_123']);

		// Create a mock import with pending status as a simple object
		$import = new \stdClass();
		$import->status = 'pending';
		$import->id = 'import_123';

		// Mock Import::find
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_123')
			->andReturn($import);

        $result = $this->service->maybeCheckImport();
        
		$this->assertFalse($result);
	}

	/**
	 * Test maybeCheckImport returns false and shows notice for processing status.
	 */
	public function test_maybe_check_import_returns_false_for_processing_status() {
		// Mock batch service to return an import ID
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_123']);

		// Create a mock import with processing status as a simple object
		$import = new \stdClass();
		$import->status = 'processing';
		$import->id = 'import_123';

		// Mock Import::find
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_123')
			->andReturn($import);

        $result = $this->service->maybeCheckImport();

		$this->assertFalse($result);
	}

	/**
	 * Test maybeCheckImport removes batch and returns false when sync is already active.
	 */
	public function test_maybe_check_import_returns_false_when_sync_is_active() {
		// Mock batch service to return an import ID
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_123']);

		// Mock Import::find
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_123')
			->andReturn((object)[
                'status' => 'completed',
                'id' => 'import_123'
            ]);

		// Mock batch remove
		$this->batch_service->shouldReceive('remove')
			->once()
			->with('surecart_import_content_syncimport_123');

		// Mock sync service to indicate it's already active
		$this->sync_service->shouldReceive('isActive')
			->once()
			->andReturn(true);

		$result = $this->service->maybeCheckImport();

		$this->assertFalse($result);
	}

	/**
	 * Test maybeCheckImport dispatches sync successfully for completed import.
	 */
	public function test_maybe_check_import_dispatches_sync_for_completed_import() {
		// Mock batch service to return an import ID
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_123']);

		// Mock Import::find
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_123')
			->andReturn((object)[
                'status' => 'completed',
                'id' => 'import_123'
            ]);

		// Mock batch remove
		$this->batch_service->shouldReceive('remove')
			->once()
			->with('surecart_import_content_syncimport_123');

		// Mock sync service
		$this->sync_service->shouldReceive('isActive')
			->once()
			->andReturn(false);

		$this->sync_service->shouldReceive('dispatch')
			->once()
			->andReturn(['job_id' => 'sync_job_123']);

		$result = $this->service->maybeCheckImport();

		$this->assertEquals(['job_id' => 'sync_job_123'], $result);
	}

	/**
	 * Test maybeCheckImport dispatches sync successfully for invalid import.
	 */
	public function test_maybe_check_import_dispatches_sync_for_invalid_import() {
		// Mock batch service to return an import ID
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_456']);

		// Mock Import::find
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_456')
			->andReturn((object)[
                'status' => 'invalid',
                'id' => 'import_456'
            ]);

		// Mock batch remove
		$this->batch_service->shouldReceive('remove')
			->once()
			->with('surecart_import_content_syncimport_456');

		// Mock sync service
		$this->sync_service->shouldReceive('isActive')
			->once()
			->andReturn(false);

		$this->sync_service->shouldReceive('dispatch')
			->once()
			->andReturn(['job_id' => 'sync_job_456']);

		$result = $this->service->maybeCheckImport();

		$this->assertEquals(['job_id' => 'sync_job_456'], $result);
	}

	/**
	 * Test maybeCheckImport processes multiple imports and stops at first dispatch.
	 */
	public function test_maybe_check_import_processes_multiple_imports() {
		// Mock batch service to return multiple import IDs
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_1', 'import_2', 'import_3']);

		// Mock Import::find for first import only (loop should stop after first successful dispatch)
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_1')
			->andReturn((object)[
                'status' => 'completed',
                'id' => 'import_1'
            ]);

		// Mock batch remove for first import
		$this->batch_service->shouldReceive('remove')
			->once()
			->with('surecart_import_content_syncimport_1');

		// Mock sync service for first import
		$this->sync_service->shouldReceive('isActive')
			->once()
			->andReturn(false);

		$this->sync_service->shouldReceive('dispatch')
			->once()
			->andReturn(['job_id' => 'sync_job_1']);

		$result = $this->service->maybeCheckImport();

		// Should return result from first successful dispatch
		$this->assertEquals(['job_id' => 'sync_job_1'], $result);
	}

	/**
	 * Test maybeCheckImport handles mixed import statuses correctly.
	 */
	public function test_maybe_check_import_handles_mixed_statuses() {
		// Mock batch service to return multiple import IDs
		$this->batch_service->shouldReceive('getByPrefix')
			->once()
			->with('surecart_import_content_sync')
			->andReturn(['import_pending', 'import_completed']);

		// Mock Import::find for pending import
		\Mockery::mock('overload:' . Import::class)
			->shouldReceive('find')
			->once()
			->with('import_pending')
			->andReturn((object)[
                'status' => 'pending',
                'id' => 'import_pending'
            ]);

		$result = $this->service->maybeCheckImport();

		// Should return false because the first import has pending status
		$this->assertFalse($result);
	}
}