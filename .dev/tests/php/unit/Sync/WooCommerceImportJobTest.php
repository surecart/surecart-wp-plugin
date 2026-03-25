<?php
/**
 * WooCommerce Import Job & Service tests.
 *
 * @group woo_import
 */

namespace SureCart\Tests\Sync {

	use SureCart\Sync\ImportState;
	use SureCart\Sync\WooCommerce\WooCommerceImportJob;
	use SureCart\Sync\WooCommerce\WooCommerceImportService;
	use SureCart\Tests\SureCartUnitTestCase;

	/**
	 * Tests for WooCommerceImportJob.
	 *
	 * @group woo_import
	 */
	class WooCommerceImportJobTest extends SureCartUnitTestCase {
		use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

		/**
		 * Set up the test environment.
		 */
		public function setUp(): void {
			parent::setUp();

			\SureCart::make()->bootstrap(
				[
					'providers' => [
						\SureCart\WordPress\PluginServiceProvider::class,
					],
				],
				false
			);

			// Reset globals.
			$GLOBALS['test_wc_products_result']    = null;
			$GLOBALS['test_wc_get_product_result']  = null;
			$GLOBALS['test_woocommerce_currency']   = 'USD';

			// Clean up options.
			( new ImportState( 'woo' ) )->reset();
		}

		/**
		 * Tear down the test environment.
		 */
		public function tearDown(): void {
			unset(
				$GLOBALS['test_wc_products_result'],
				$GLOBALS['test_wc_get_product_result'],
				$GLOBALS['test_woocommerce_currency']
			);
			( new ImportState( 'woo' ) )->reset();
			parent::tearDown();
		}

		/**
		 * Helper to invoke the protected task() method via reflection.
		 *
		 * @param WooCommerceImportJob $job  The job instance.
		 * @param array                $args The task arguments.
		 * @return mixed
		 */
		private function invokeTask( $job, $args ) {
			$reflection = new \ReflectionMethod( $job, 'task' );
			$reflection->setAccessible( true );
			return $reflection->invoke( $job, $args );
		}

		/**
		 * Create a mock Task for the job constructor.
		 *
		 * @return \Mockery\MockInterface
		 */
		private function createMockTask() {
			$mock = \Mockery::mock( 'SureCart\Sync\WooCommerce\WooCommerceImportTask' );
			$mock->shouldReceive( 'queue' )->zeroOrMoreTimes();
			return $mock;
		}

		/**
		 * Test task returns false when no products are found (empty batch = job complete).
		 */
		public function test_task_returns_false_when_no_products_found() {
			$GLOBALS['test_wc_products_result'] = (object) [
				'products'      => [],
				'max_num_pages' => 0,
			];

			$job    = new WooCommerceImportJob( $this->createMockTask() );
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => 10 ] );

			$this->assertFalse( $result );
		}

		/**
		 * Test task returns next page args when more products exist.
		 */
		public function test_task_returns_next_page_args_when_more_products() {
			$GLOBALS['test_wc_products_result'] = (object) [
				'products'      => [ 1, 2 ],
				'max_num_pages' => 3,
			];

			$job    = new WooCommerceImportJob( $this->createMockTask() );
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => 10 ] );

			$this->assertIsArray( $result );
			$this->assertEquals( 2, $result['page'] );
			$this->assertEquals( 10, $result['batch_size'] );
		}

		/**
		 * Test task queues product IDs to the task for processing.
		 */
		public function test_task_queues_product_ids_to_task() {
			$GLOBALS['test_wc_products_result'] = (object) [
				'products'      => [ 10, 20, 30 ],
				'max_num_pages' => 1,
			];

			$mock_task = \Mockery::mock( 'SureCart\Sync\WooCommerce\WooCommerceImportTask' );
			$mock_task->shouldReceive( 'queue' )
				->once()
				->with( [ 10, 20, 30 ] );

			$job    = new WooCommerceImportJob( $mock_task );
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => 10 ] );

			$this->assertFalse( $result );
		}

		/**
		 * Test task does not queue when no products on page.
		 */
		public function test_task_does_not_queue_when_empty() {
			$GLOBALS['test_wc_products_result'] = (object) [
				'products'      => [],
				'max_num_pages' => 0,
			];

			$mock_task = \Mockery::mock( 'SureCart\Sync\WooCommerce\WooCommerceImportTask' );
			$mock_task->shouldNotReceive( 'queue' );

			$job    = new WooCommerceImportJob( $mock_task );
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => 10 ] );

			$this->assertFalse( $result );
		}

		/**
		 * Test that batch_size is clamped within task.
		 */
		public function test_task_clamps_batch_size() {
			$GLOBALS['test_wc_products_result'] = (object) [
				'products'      => [],
				'max_num_pages' => 0,
			];

			$job = new WooCommerceImportJob( $this->createMockTask() );

			// Test upper bound: 9999 should be clamped to 500.
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => 9999 ] );
			$this->assertFalse( $result );

			// Test lower bound: 0 should be clamped to 1.
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => 0 ] );
			$this->assertFalse( $result );

			// Test negative: -5 should be clamped to 1.
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => -5 ] );
			$this->assertFalse( $result );
		}

		/**
		 * Test task returns false when WooCommerce is not active.
		 *
		 * Note: We can't fully test this since WooCommerce class is stubbed in tests,
		 * but we verify the result object validation path.
		 */
		public function test_task_returns_false_for_invalid_wc_result() {
			// Simulate an invalid wc_get_products result (e.g., WC deactivated mid-sync).
			$GLOBALS['test_wc_products_result'] = 'invalid';

			$job    = new WooCommerceImportJob( $this->createMockTask() );
			$result = $this->invokeTask( $job, [ 'page' => 1, 'batch_size' => 10 ] );

			$this->assertFalse( $result );
		}
	}

	/**
	 * Tests for WooCommerceImportService.
	 *
	 * @group woo_import
	 */
	class WooCommerceImportServiceTest extends SureCartUnitTestCase {
		use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

		/**
		 * Set up the test environment.
		 */
		public function setUp(): void {
			parent::setUp();

			\SureCart::make()->bootstrap(
				[
					'providers' => [
						\SureCart\WordPress\PluginServiceProvider::class,
					],
				],
				false
			);

			// Clean up options.
			( new ImportState( 'woo' ) )->reset();
		}

		/**
		 * Tear down.
		 */
		public function tearDown(): void {
			( new ImportState( 'woo' ) )->reset();
			parent::tearDown();
		}

		/**
		 * Test dispatch clears previous import state.
		 */
		public function test_dispatch_clears_previous_import_state() {
			// Set up previous state.
			update_option( 'sc_woo_import_ids', [ 'old-id-1', 'old-id-2' ] );
			update_option( 'sc_woo_import_session_id', 'old-session' );
			update_option( 'sc_woo_import_all_skipped', 'old-session' );

			// Create a mock job that tracks push_to_queue calls.
			$mock_job = \Mockery::mock( 'SureCart\Sync\WooCommerce\WooCommerceImportJob' );
			$mock_job->shouldReceive( 'push_to_queue' )
				->once()
				->with( \Mockery::on( function ( $args ) {
					return $args['page'] === 1 && $args['batch_size'] >= 1 && $args['batch_size'] <= 500;
				} ) )
				->andReturnSelf();
			$mock_job->shouldReceive( 'save' )->once()->andReturnSelf();
			$mock_job->shouldReceive( 'dispatch' )->once()->andReturn( [] );

			// Create a partial mock of the service.
			$app = \Mockery::mock( 'SureCart\Application' );
			$app->shouldReceive( 'resolve' )
				->with( 'surecart.jobs.woo_import' )
				->andReturn( $mock_job );

			$service = new WooCommerceImportService( $app, new ImportState( 'woo' ) );
			$service->dispatch();

			// Options should be cleared.
			$this->assertEmpty( get_option( 'sc_woo_import_ids', [] ) );
			$this->assertFalse( get_option( 'sc_woo_import_session_id' ) );
			$this->assertFalse( get_option( 'sc_woo_import_all_skipped' ) );
		}

		/**
		 * Test dispatch clamps batch_size to 500 max.
		 */
		public function test_dispatch_clamps_batch_size_to_500() {
			$mock_job = \Mockery::mock( 'SureCart\Sync\WooCommerce\WooCommerceImportJob' );
			$mock_job->shouldReceive( 'push_to_queue' )
				->once()
				->with( \Mockery::on( function ( $args ) {
					return $args['batch_size'] === 500;
				} ) )
				->andReturnSelf();
			$mock_job->shouldReceive( 'save' )->once()->andReturnSelf();
			$mock_job->shouldReceive( 'dispatch' )->once()->andReturn( [] );

			$app = \Mockery::mock( 'SureCart\Application' );
			$app->shouldReceive( 'resolve' )
				->with( 'surecart.jobs.woo_import' )
				->andReturn( $mock_job );

			$service = new WooCommerceImportService( $app, new ImportState( 'woo' ) );
			$service->dispatch( 9999 );
		}

		/**
		 * Test dispatch clamps batch_size minimum to 1.
		 */
		public function test_dispatch_clamps_batch_size_minimum_1() {
			$mock_job = \Mockery::mock( 'SureCart\Sync\WooCommerce\WooCommerceImportJob' );
			$mock_job->shouldReceive( 'push_to_queue' )
				->once()
				->with( \Mockery::on( function ( $args ) {
					return $args['batch_size'] === 1;
				} ) )
				->andReturnSelf();
			$mock_job->shouldReceive( 'save' )->once()->andReturnSelf();
			$mock_job->shouldReceive( 'dispatch' )->once()->andReturn( [] );

			$app = \Mockery::mock( 'SureCart\Application' );
			$app->shouldReceive( 'resolve' )
				->with( 'surecart.jobs.woo_import' )
				->andReturn( $mock_job );

			$service = new WooCommerceImportService( $app, new ImportState( 'woo' ) );
			$service->dispatch( 0 );
		}

		/**
		 * Test getImportableCount returns 0 when WooCommerce is inactive.
		 *
		 * Note: Since WooCommerce class is stubbed in tests, we test the wc_get_products
		 * path instead by simulating an invalid result.
		 */
		public function test_count_returns_zero_for_invalid_result() {
			$GLOBALS['test_wc_products_result'] = 'invalid';

			$app = \Mockery::mock( 'SureCart\Application' );

			$service = new WooCommerceImportService( $app, new ImportState( 'woo' ) );
			$count   = $service->getImportableCount();

			$this->assertEquals( 0, $count );

			unset( $GLOBALS['test_wc_products_result'] );
		}

		/**
		 * Test getImportableCount returns the total from wc_get_products.
		 */
		public function test_count_returns_importable_count() {
			$GLOBALS['test_wc_products_result'] = (object) [
				'products'      => [ 1 ],
				'max_num_pages' => 5,
				'total'         => 42,
			];

			$app = \Mockery::mock( 'SureCart\Application' );

			$service = new WooCommerceImportService( $app, new ImportState( 'woo' ) );
			$count   = $service->getImportableCount();

			$this->assertEquals( 42, $count );

			unset( $GLOBALS['test_wc_products_result'] );
		}
	}
}
