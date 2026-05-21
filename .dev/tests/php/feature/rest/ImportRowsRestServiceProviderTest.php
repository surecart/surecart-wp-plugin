<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Rest\ImportRowsRestServiceProvider;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class ImportRowsRestServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp() : void {
		parent::setUp();
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				ImportRowsRestServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
			],
		], false);
	}

	public function requestProvider() {
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/import_rows', [], 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/import_rows', [], 403],
			'List: Has Capability' => [['edit_sc_products'], 'GET', '/surecart/v1/import_rows', [], 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/import_rows/test', [], 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/import_rows/test', [], 403],
			'Find: Has Capability' => [['edit_sc_products'], 'GET', '/surecart/v1/import_rows/test', [], 200],
			'Create: Not Allowed' => [['edit_sc_products'], 'POST', '/surecart/v1/import_rows', ['data' => 'test'], 404],
			'Update: Not Allowed' => [['edit_sc_products'], 'PATCH', '/surecart/v1/import_rows/test', ['data' => 'test'], 404],
			'Delete: Not Allowed' => [['edit_sc_products'], 'DELETE', '/surecart/v1/import_rows/test', [], 404],
		];
	}

	/**
	 * @dataProvider requestProvider
	 */
	public function test_permissions($caps, $method, $route, $args = [], $status) {
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Mock successful responses for allowed methods
		if ($status === 200) {
			if (strpos($route, '/test') !== false) {
				// Find single item
				$requests->shouldReceive('makeRequest')
					->andReturn((object) [
						'id' => 'test',
						'object' => 'import_row',
						'data' => 'test_data',
					]);
			} else {
				// List items
				$requests->shouldReceive('makeRequest')
					->andReturn([
						(object) [
							'id' => 'row_1',
							'object' => 'import_row',
							'data' => 'data_1',
						],
						(object) [
							'id' => 'row_2',
							'object' => 'import_row',
							'data' => 'data_2',
						],
					]);
			}
		}

		// Set up user capabilities
		if (is_array($caps)) {
			$user = self::factory()->user->create_and_get();
			foreach ($caps as $cap) {
				$user->add_cap($cap);
			}
			wp_set_current_user($user->ID ?? null);
		}

		// Create and execute REST request
		$request = new \WP_REST_Request($method, $route);
		foreach($args as $key => $arg) {
			$request->set_param($key, $arg);
		}
		$response = rest_do_request($request);

		$this->assertSame($status, $response->get_status());
	}

	public function test_list_returns_import_rows() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn([
				(object) [
					'id' => 'row_1',
					'object' => 'import_row',
					'data' => 'test_data_1',
					'status' => 'pending',
				],
				(object) [
					'id' => 'row_2',
					'object' => 'import_row',
					'data' => 'test_data_2',
					'status' => 'completed',
				],
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create user with required capability
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_products');
		wp_set_current_user($user->ID);

		// Execute request
		$request = new \WP_REST_Request('GET', '/surecart/v1/import_rows');
		$response = rest_do_request($request);

		// Assert results
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertIsArray($data);
		$this->assertCount(2, $data);
		$this->assertSame('row_1', $data[0]['id']);
		$this->assertSame('row_2', $data[1]['id']);
	}

	public function test_find_returns_specific_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows/specific_id')
			->andReturn((object) [
				'id' => 'specific_id',
				'object' => 'import_row',
				'data' => 'specific_data',
				'status' => 'completed',
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create user with required capability
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_products');
		wp_set_current_user($user->ID);

		// Execute request
		$request = new \WP_REST_Request('GET', '/surecart/v1/import_rows/specific_id');
		$request->set_url_params(['id' => 'specific_id']);
		$response = rest_do_request($request);

		// Assert results
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertSame('specific_id', $data['id']);
		$this->assertSame('import_row', $data['object']);
		$this->assertSame('specific_data', $data['data']);
		$this->assertSame('completed', $data['status']);
	}

	public function test_query_parameters_work() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class);
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn([
				(object) [
					'id' => 'pending_row',
					'object' => 'import_row',
					'status' => 'pending',
				],
			]);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create user with required capability
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_products');
		wp_set_current_user($user->ID);

		// Execute request with query parameters
		$request = new \WP_REST_Request('GET', '/surecart/v1/import_rows');
		$request->set_query_params([
			'status' => 'pending',
			'limit' => 10,
		]);
		$response = rest_do_request($request);

		// Assert results
		$this->assertSame(200, $response->get_status());
		$data = $response->get_data();
		$this->assertIsArray($data);
		$this->assertCount(1, $data);
		$this->assertSame('pending_row', $data[0]['id']);
	}

	public function test_api_error_handling() {
		// Mock RequestService to return error
		$requests = \Mockery::mock(RequestService::class);
		$error = new \WP_Error('api_error', 'API service unavailable');
		$requests->shouldReceive('makeRequest')
			->once()
			->andReturn($error);

		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create user with required capability
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_products');
		wp_set_current_user($user->ID);

		// Execute request
		$request = new \WP_REST_Request('GET', '/surecart/v1/import_rows');
		$response = rest_do_request($request);

		// Assert error response
		$this->assertSame(500, $response->get_status());
		$data = $response->get_data();
		$this->assertSame('api_error', $data['code']);
		$this->assertSame('API service unavailable', $data['message']);
	}

	public function test_schema_includes_required_properties() {
		$provider = new ImportRowsRestServiceProvider();
		$schema = $provider->get_item_schema();

		// Assert schema structure
		$this->assertSame('http://json-schema.org/draft-04/schema#', $schema['$schema']);
		$this->assertSame('import_rows', $schema['title']);
		$this->assertSame('object', $schema['type']);

		// Assert required properties exist
		$this->assertArrayHasKey('properties', $schema);
		$this->assertArrayHasKey('id', $schema['properties']);

		// Assert id property structure
		$id_property = $schema['properties']['id'];
		$this->assertSame('string', $id_property['type']);
		$this->assertTrue($id_property['readonly']);
		$this->assertContains('view', $id_property['context']);
		$this->assertContains('edit', $id_property['context']);
	}
}