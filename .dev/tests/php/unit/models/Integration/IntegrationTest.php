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
			'surecart_model_id' => 'testmodel',
			'integration_id' => 1
		]);
		$this->assertSame($created->integration_id,1);
		$this->assertSame($created->surecart_model_id,'testmodel');
		$this->assertNotEmpty($created->created_at);
		$this->assertNotEmpty($created->id);

		$found = Integration::find($created->id);
		$this->assertSame($found->integration_id,$created->integration_id);
		$this->assertSame($found->surecart_model_id,$created->surecart_model_id);
		$this->assertSame($found->created_at, $created->created_at);
		$this->assertSame($found->id, $created->id);

		$integration_2 = Integration::create([
			'surecart_model_id' => 'testmodel2',
			'integration_id' => 2
		]);

		// get and paginate.
		$get = Integration::order_by('created_at')->get();
		$paginate = Integration::order_by('created_at')->paginate(['per_page' => 1, 'page' => 1]);
		$this->assertCount(2,$get);
		$this->assertCount(1,$paginate);
		$this->assertInstanceOf(Collection::class,$paginate);
		$this->assertInstanceOf(Collection::class,$get);

		// find where.
		$find = Integration::where('integration_id',2)->first();
		$this->assertSame($find->integration_id,2);
		$find_model = Integration::where('surecart_model_id','testmodel')->first();
		$this->assertSame($find_model->surecart_model_id,'testmodel');

		$updated = Integration::where('integration_id',2)->update([
			'integration_id' => 3
		]);
		$this->assertNotWPError($updated);
		$this->assertSame($integration_2->id, $updated->id);
		$this->assertEmpty($integration_2->updated_at);
		$this->assertNotEmpty($updated->updated_at);
		$this->assertSame(3, $updated->integration_id);
	}
}
