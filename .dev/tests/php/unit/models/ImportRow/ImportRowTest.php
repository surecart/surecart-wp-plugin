<?php

namespace SureCart\Tests\Models\ImportRow;

use SureCart\Models\ImportRow;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class ImportRowTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp() : void {
		parent::setUp();
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
			]
		], false);
	}

	public function test_can_create_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class)->makePartial();

		// Set expectations for create request
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn((object) [
				'id' => 'test_import_row_id',
				'object' => 'import_row',
				'data' => 'test_data',
				'status' => 'pending',
			]);

		// Alias mock to container
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Execute model operation
		$result = ImportRow::create([
			'data' => 'test_data',
			'status' => 'pending',
		]);

		// Assert results
		$this->assertNotWPError($result);
		$this->assertSame('test_import_row_id', $result->id);
		$this->assertSame('import_row', $result->object);
		$this->assertSame('test_data', $result->data);
		$this->assertSame('pending', $result->status);
	}

	public function test_can_find_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class)->makePartial();

		// Set expectations for find request
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows/test_id')
			->andReturn((object) [
				'id' => 'test_id',
				'object' => 'import_row',
				'data' => 'test_data',
				'status' => 'completed',
			]);

		// Alias mock to container
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Execute model operation
		$result = ImportRow::find('test_id');

		// Assert results
		$this->assertNotWPError($result);
		$this->assertSame('test_id', $result->id);
		$this->assertSame('import_row', $result->object);
		$this->assertSame('completed', $result->status);
	}

	public function test_can_list_import_rows() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class)->makePartial();

		// Set expectations for list request
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn([
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
			]);

		// Alias mock to container
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Execute model operation
		$result = ImportRow::get();

		// Assert results
		$this->assertNotWPError($result);
		$this->assertIsArray($result);
		$this->assertCount(2, $result);
		$this->assertSame('row_1', $result[0]->id);
		$this->assertSame('row_2', $result[1]->id);
	}

	public function test_can_update_import_row() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class)->makePartial();

		// Set expectations for update request
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows/test_id')
			->andReturn((object) [
				'id' => 'test_id',
				'object' => 'import_row',
				'status' => 'completed',
				'data' => 'updated_data',
			]);

		// Alias mock to container
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Create an import row instance
		$import_row = new ImportRow();
		$import_row->id = 'test_id';

		// Execute model operation
		$result = $import_row->update([
			'status' => 'completed',
			'data' => 'updated_data',
		]);

		// Assert results
		$this->assertNotWPError($result);
		$this->assertSame('test_id', $result->id);
		$this->assertSame('completed', $result->status);
		$this->assertSame('updated_data', $result->data);
	}

	public function test_handles_api_errors() {
		// Mock RequestService to return WP_Error
		$requests = \Mockery::mock(RequestService::class)->makePartial();

		$error = new \WP_Error('api_error', 'API request failed');
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn($error);

		// Alias mock to container
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Execute model operation
		$result = ImportRow::create(['data' => 'test']);

		// Assert error handling
		$this->assertWPError($result);
		$this->assertSame('api_error', $result->get_error_code());
		$this->assertSame('API request failed', $result->get_error_message());
	}

	public function test_can_query_with_where() {
		// Mock RequestService
		$requests = \Mockery::mock(RequestService::class)->makePartial();

		// Set expectations for query request
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('import_rows')
			->andReturn([
				(object) [
					'id' => 'filtered_row',
					'object' => 'import_row',
					'status' => 'pending',
				],
			]);

		// Alias mock to container
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Execute model operation with where clause
		$result = ImportRow::where(['status' => 'pending'])->get();

		// Assert results
		$this->assertNotWPError($result);
		$this->assertIsArray($result);
		$this->assertCount(1, $result);
		$this->assertSame('filtered_row', $result[0]->id);
		$this->assertSame('pending', $result[0]->status);
	}
}