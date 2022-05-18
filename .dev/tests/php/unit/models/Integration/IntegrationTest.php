<?php

namespace SureCart\Tests\Models;

use SureCart\Models\Integration;
use SureCart\Tests\SureCartUnitTestCase;
use SureCartVendors\PluginEver\QueryBuilder\Collection;

class IntegrationTest extends SureCartUnitTestCase {
	public function setUp() {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Database\MigrationsServiceProvider::class,
			]
		], false);
	}

	/**
	 * @group failing
	 */
	public function test_crud() {
		$not_found = Integration::find(1);
		$this->assertWPError( $not_found );

		$created = Integration::create([
			'model_id' => 'testmodel',
			'integration_id' => 1
		]);

		$this->assertSame((int) $created->integration_id,1);
		$this->assertSame($created->model_id,'testmodel');
		$this->assertNotEmpty($created->id);
		$this->assertNotEmpty($created->created_at);

		$found = Integration::find($created->id);
		$this->assertSame($found->integration_id,$created->integration_id);
		$this->assertSame($found->model_id,$created->model_id);
		$this->assertSame($found->created_at, $created->created_at);
		$this->assertSame($found->id, $created->id);

		$integration_2 = Integration::create([
			'model_id' => 'testmodel2',
			'integration_id' => 2
		]);

		// get and paginate.
		$get = Integration::order_by('created_at')->get();
		$paginate = Integration::order_by('created_at')->paginate(['per_page' => 1, 'page' => 1]);
		$this->assertCount(2,$get);
		$this->assertCount(1,$paginate);

		// find where.
		$find = Integration::where('integration_id',2)->first();
		$this->assertSame((int)$find->integration_id,2);
		$find_model = Integration::where('model_id','testmodel')->first();
		$this->assertSame($find_model->model_id,'testmodel');

		$updated = Integration::where('integration_id',2)->update([
			'integration_id' => 3
		]);
		$this->assertNotWPError($updated);
		$this->assertSame($integration_2->id, $updated->id);
		$this->assertEmpty($integration_2->updated_at);
		$this->assertNotEmpty($updated->updated_at);
		$this->assertSame(3, (int)$updated->integration_id);
	}
}
