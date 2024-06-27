<?php

namespace SureCart\Tests;

use SureCart\Background\QueueService;
use WP_UnitTestCase;
use SureCart\Request\RequestService;

abstract class SureCartUnitTestCase extends WP_UnitTestCase
{
	public $mock_requests;

	public function tearDown() : void
	{
		parent::tearDown();
		\SureCart::setApplication(null);
		\Mockery::close();
	}

	public function setupMockRequests()
	{
		// mock the requests in the container
		$requests = $this->createMock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$this->mock_requests = $requests;
	}

	public function shouldSyncProduct( $id, $times = null ) {
		// mock the requests in the container
		$queue_service =  \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});

		$ids = !is_array( $id ) ? [$id] : $id;

		// it should cancel the queue since the post has been created.
		foreach( $ids as $id ) {
		$queue_service
		->shouldReceive('cancel')
		->times($times)
		->with(
			'surecart/sync/product',
			[
				'id'               => $id,
			],
			'product-' . $id, // unique id for the product.
			true // force unique. This will replace any existing jobs.
		)->andReturn(true);


		// it should queue the an async request since the post has not yet been created.
		$queue_service
			->shouldReceive('async')
			->times($times)
			->with(
				'surecart/sync/product',
				[
					'id'               => $id,
				],
				'product-' . $id, // unique id for the product.
				true // force unique. This will replace any existing jobs.
			)->andReturn(true);
		}
	}
}
