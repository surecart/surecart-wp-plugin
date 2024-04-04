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
				\SureCart\Database\MigrationsServiceProvider::class,
			]
		], false);
	}

	/**
	 * @group failing
	 */
	public function test_crud() {
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
		]);

		$this->assertEquals( $created->value,'Red' );
		$this->assertEquals( $created->name, 'Color');
		$this->assertEquals( $created->post_id, $post_id);
		$this->assertNotEmpty($created->id);
		$this->assertNotEmpty($created->created_at);

		$created = VariantOptionValue::create([
			'value'   => 'Green',
			'name'    => 'Color',
			'post_id' => $post_id,
		]);

		$found = VariantOptionValue::find($created->id);
		$this->assertEquals( $created->value,'Green' );
		$this->assertEquals( $created->name, 'Color');
		$this->assertEquals( $created->post_id, $post_id);
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

		// bulk delete
		$deleted = VariantOptionValue::where('post_id',$post_id)->delete();
		$get = VariantOptionValue::where('post_id',$post_id)->get();
		$this->assertCount(0,$get);
	}
}
