<?php

namespace SureCart\Tests\Sync\Jobs;

use SureCart\Sync\Jobs\JobService;
use SureCart\Sync\Jobs\SyncJob;
use SureCart\Sync\Jobs\CleanupJob;
use SureCart\Tests\SureCartUnitTestCase;

class JobServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

    protected $app;
    protected $job_service;
    protected $sync_job;
    protected $cleanup_job;

    public function setUp(): void {
        parent::setUp();

        // Create mock app
        $this->app = \Mockery::mock('SureCart\App');

        // Create mock jobs
        $this->sync_job = \Mockery::mock(SyncJob::class);
        $this->cleanup_job = \Mockery::mock(CleanupJob::class);

        // Setup app resolves
        $this->app->shouldReceive('resolve')
            ->with('surecart.jobs.sync')
            ->andReturn($this->sync_job);

        $this->app->shouldReceive('resolve')
            ->with('surecart.jobs.cleanup')
            ->andReturn($this->cleanup_job);

        $this->job_service = new JobService($this->app);
    }

    public function test_run_executes_all_jobs() {
        // Previous jobs should be cancelled
        $this->sync_job->shouldReceive('cancel')->once();
        $this->cleanup_job->shouldReceive('cancel')->once();

        // Mock cleanup collections process
        $collections_process = \Mockery::mock('SureCart\Background\Job');
        $this->cleanup_job->shouldReceive('collections')
            ->once()
            ->andReturn($collections_process);
        $collections_process->shouldReceive('data')
            ->with(['page' => 1, 'per_page' => 25])
            ->once()
            ->andReturn($collections_process);
        $collections_process->shouldReceive('save')
            ->once()
            ->andReturn(true);

        // Mock cleanup products process
        $products_cleanup_process = \Mockery::mock('SureCart\Background\Job');
        $this->cleanup_job->shouldReceive('products')
            ->once()
            ->andReturn($products_cleanup_process);
        $products_cleanup_process->shouldReceive('data')
            ->with(['page' => 1, 'per_page' => 25])
            ->andReturn($products_cleanup_process);
        $products_cleanup_process->shouldReceive('save')
            ->andReturn(true);

        // Mock sync products process
        $products_sync_process = \Mockery::mock('SureCart\Background\Job');
        $this->sync_job->shouldReceive('products')
            ->once()
            ->andReturn($products_sync_process);
        $products_sync_process->shouldReceive('data')
            ->with(['page' => 1, 'per_page' => 25])
            ->andReturn($products_sync_process);
        $products_sync_process->shouldReceive('save')
            ->andReturn($products_sync_process);
        $products_sync_process->shouldReceive('dispatch')
            ->andReturn(true);

        $result = $this->job_service->run();

        $this->assertIsArray($result);
        $this->assertArrayHasKey('cleanup_collections', $result);
        $this->assertArrayHasKey('cleanup_products', $result);
        $this->assertArrayHasKey('sync_products', $result);
        $this->assertTrue($result['cleanup_collections']);
        $this->assertTrue($result['cleanup_products']);
        $this->assertTrue($result['sync_products']);
    }

    public function test_cancel_stops_all_jobs() {
        $this->sync_job->shouldReceive('cancel')->once();
        $this->cleanup_job->shouldReceive('cancel')->once();
        $this->job_service->cancel();
    }

    public function test_is_active_checks_all_jobs() {
        $this->sync_job->shouldReceive('isActive')->once()->andReturn(false);
        $this->cleanup_job->shouldReceive('isActive')->once()->andReturn(true);

        $this->assertTrue($this->job_service->isActive());

        $this->sync_job->shouldReceive('isActive')->once()->andReturn(false);
        $this->cleanup_job->shouldReceive('isActive')->once()->andReturn(false);

        $this->assertFalse($this->job_service->isActive());
    }

    public function test_run_handles_wp_error() {
        // Mock cancel methods
        $this->sync_job->shouldReceive('cancel')->once();
        $this->cleanup_job->shouldReceive('cancel')->once();

        // Mock cleanup collections process
        $collections_process = \Mockery::mock('SureCart\Background\Job');
        $this->cleanup_job->shouldReceive('collections')
            ->once()
            ->andReturn($collections_process);
        $collections_process->shouldReceive('data')
            ->with(['page' => 1, 'per_page' => 25])
            ->andReturn($collections_process);
        $collections_process->shouldReceive('save')
            ->andReturn(new \WP_Error('test_error', 'Test Error'));

        // Mock cleanup products process since it's called before collections
        $products_cleanup_process = \Mockery::mock('SureCart\Background\Job');
        $this->cleanup_job->shouldReceive('products')
            ->once()
            ->andReturn($products_cleanup_process);
        $products_cleanup_process->shouldReceive('data')
            ->with(['page' => 1, 'per_page' => 25])
            ->andReturn($products_cleanup_process);
        $products_cleanup_process->shouldReceive('save')
            ->andReturn(true);

        // Mock sync products process
        $products_sync_process = \Mockery::mock('SureCart\Background\Job');
        $this->sync_job->shouldReceive('products')
            ->once()
            ->andReturn($products_sync_process);
        $products_sync_process->shouldReceive('data')
            ->with(['page' => 1, 'per_page' => 25])
            ->andReturn($products_sync_process);
        $products_sync_process->shouldReceive('save')
            ->andReturn($products_sync_process);
        $products_sync_process->shouldReceive('dispatch')
            ->andReturn(true);

        $result = $this->job_service->run();

        $this->assertInstanceOf(\WP_Error::class, $result);
        $this->assertEquals('test_error', $result->get_error_code());
    }
}
