<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\ImportRowsController;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class ImportRowsControllerTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp() : void {
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);
		parent::setUp();
	}

	public function test_index_returns_import_rows() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn((object) [
				'data' => [
					(object) [
						'id' => 'row_1',
						'object' => 'import_row',
						'status' => 'pending',
					],
					(object) [
						'id' => 'row_2',
						'object' => 'import_row',
						'status' => 'completed',
					],
				],
				'pagination' => (object) [
					'count' => 2,
					'limit' => 20,
				],
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create REST request
		$request = new WP_REST_Request('GET', '/surecart/v1/import_rows');

		// Call controller method
		$controller = \Mockery::mock(ImportRowsController::class)->makePartial();
		$response = $controller->index($request);

		// Assert results
		$this->assertNotWPError($response);
		$this->assertInstanceOf(\WP_REST_Response::class, $response);
		$data = $response->get_data();
		$this->assertIsArray($data);
		$this->assertCount(2, $data);
	}

	public function test_create_creates_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn((object) [
				'id' => 'new_row_id',
				'object' => 'import_row',
				'data' => 'test_data',
				'status' => 'pending',
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create REST request
		$request = new WP_REST_Request('POST', '/surecart/v1/import_rows');
		$request->set_body_params([
			'data' => 'test_data',
			'status' => 'pending',
		]);

		// Call controller method
		$controller = \Mockery::mock(ImportRowsController::class)->makePartial();
		$response = $controller->create($request);

		// Assert results
		$this->assertNotWPError($response);
		$this->assertSame('new_row_id', $response->id);
		$this->assertSame('import_row', $response->object);
		$this->assertSame('test_data', $response->data);
	}

	public function test_find_returns_specific_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows/test_id')
			->andReturn((object) [
				'id' => 'test_id',
				'object' => 'import_row',
				'data' => 'specific_data',
				'status' => 'completed',
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create REST request
		$request = new WP_REST_Request('GET', '/surecart/v1/import_rows/test_id');
		$request->set_url_params(['id' => 'test_id']);

		// Call controller method
		$controller = \Mockery::mock(ImportRowsController::class)->makePartial();
		$response = $controller->find($request);

		// Assert results
		$this->assertNotWPError($response);
		$this->assertSame('test_id', $response->id);
		$this->assertSame('completed', $response->status);
	}

	public function test_edit_updates_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows/edit_id')
			->andReturn((object) [
				'id' => 'edit_id',
				'object' => 'import_row',
				'status' => 'completed',
				'data' => 'updated_data',
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create REST request
		$request = new WP_REST_Request('PATCH', '/surecart/v1/import_rows/edit_id');
		$request->set_body_params([
			'status' => 'completed',
			'data' => 'updated_data',
		]);
		$request->set_url_params(['id' => 'edit_id']);

		// Call controller method
		$controller = \Mockery::mock(ImportRowsController::class)->makePartial();
		$response = $controller->edit($request);

		// Assert results
		$this->assertNotWPError($response);
		$this->assertSame('edit_id', $response->id);
		$this->assertSame('completed', $response->status);
		$this->assertSame('updated_data', $response->data);
	}

	public function test_delete_removes_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows/delete_id')
			->andReturn((object) [
				'id' => 'delete_id',
				'deleted' => true,
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create REST request
		$request = new WP_REST_Request('DELETE', '/surecart/v1/import_rows/delete_id');
		$request->set_url_params(['id' => 'delete_id']);

		// Call controller method
		$controller = \Mockery::mock(ImportRowsController::class)->makePartial();
		$response = $controller->delete($request);

		// Assert results
		$this->assertNotWPError($response);
		$this->assertTrue($response->deleted ?? false);
	}

	public function test_handles_api_errors_gracefully() {
		// Mock RequestService to return WP_Error
		$requests = \Mockery::mock(RequestService::class);
		$error = new \WP_Error('api_error', 'Import row not found');
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows/invalid_id')
			->andReturn($error);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create REST request
		$request = new WP_REST_Request('GET', '/surecart/v1/import_rows/invalid_id');
		$request->set_url_params(['id' => 'invalid_id']);

		// Call controller method
		$controller = \Mockery::mock(ImportRowsController::class)->makePartial();
		$response = $controller->find($request);

		// Assert error handling
		$this->assertWPError($response);
		$this->assertSame('api_error', $response->get_error_code());
		$this->assertSame('Import row not found', $response->get_error_message());
	}

	public function test_validates_request_parameters() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn((object) [
				'data' => [],
				'pagination' => (object) [
					'count' => 0,
					'limit' => 20,
				],
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create REST request with query parameters
		$request = new WP_REST_Request('GET', '/surecart/v1/import_rows');
		$request->set_query_params([
			'status' => 'pending',
			'limit' => 20,
		]);

		// Call controller method
		$controller = \Mockery::mock(ImportRowsController::class)->makePartial();
		$response = $controller->index($request);

		// Assert request was processed (no errors)
		$this->assertNotWPError($response);
		$this->assertInstanceOf(\WP_REST_Response::class, $response);
		$data = $response->get_data();
		$this->assertIsArray($data);
	}
}