<?php

namespace SureCart\Tests\Models;

use SureCart\Models\VariantOptionValue;
use SureCart\Tests\SureCartUnitTestCase;

class VariantOptionValuesTest extends SureCartUnitTestCase {
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Database\MigrationsServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
			]
		], false);

		VariantOptionValue::deleteAll();
	}

	/**
	 * @group sync
	 */
	public function test_crud() {
		\SureCart::alias('account', function () {
			return (object) [
				'id' => 'test',
			];
		});

		$not_found = VariantOptionValue::find(1);
		$this->assertWPError( $not_found );

		$post_id = self::factory()->post->create(array(
			'post_type' => 'sc_product',
			'post_content' => 'test'
		));

		$created = VariantOptionValue::create([
			'value'   => 'Red',
			'name'    => 'Color',
			'post_id' => $post_id,
			'product_id' => 'productid',
		]);

		$this->assertEquals( $created->value,'Red' );
		$this->assertEquals( $created->name, 'Color');
		$this->assertEquals( $created->post_id, $post_id);
		$this->assertEquals( $created->product_id, 'productid');
		$this->assertNotEmpty($created->id);
		$this->assertNotEmpty($created->created_at);

		$created = VariantOptionValue::create([
			'value'   => 'Green',
			'name'    => 'Color',
			'post_id' => $post_id,
			'product_id' => 'productid2',
		]);

		$found = VariantOptionValue::find($created->id);
		$this->assertEquals( $created->value,'Green' );
		$this->assertEquals( $created->name, 'Color');
		$this->assertEquals( $created->post_id, $post_id);
		$this->assertEquals( $created->product_id, 'productid2');
		$this->assertNotEmpty($found->id);
		$this->assertNotEmpty($found->created_at);

		 // get and paginate.
		$get = VariantOptionValue::order_by('created_at')->get();
		$paginate = VariantOptionValue::order_by('created_at')->paginate(['per_page' => 1, 'page' => 1]);
		$this->assertCount(2,$get);
		$this->assertCount(1,$paginate);

		// find where.
		$find = VariantOptionValue::where('name','Color')->first();
		$this->assertEquals($find->value,'Red');

		$find = VariantOptionValue::where('value','Green')->first();
		$this->assertEquals($find->name,'Color');

		$find = VariantOptionValue::where('post_id', $post_id)->first();
		$this->assertEquals($find->post_id, $post_id);

		$find = VariantOptionValue::where('product_id', 'productid')->first();
		$this->assertEquals($find->product_id, 'productid');

		// bulk delete
		VariantOptionValue::where('post_id',$post_id)->delete();
		$get = VariantOptionValue::where('post_id',$post_id)->get();
		$this->assertCount(0,$get);
	}
}
