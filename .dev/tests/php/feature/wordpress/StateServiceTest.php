<?php

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\StateService;

/**
 * @group webhooks
 */
class StateServiceTest extends SureCartUnitTestCase {

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
			]
		], false);
	}

	/**
	 * @group failing
	 *
	 * @return void
	 */
	public function test_merges_line_items() {
		\SureCart::state()->mergeData( [
			'checkout' => [
				'initialLineItems' => sc_initial_line_items( [
					[
						'variant_id'  => 'variant_id',
						'price_id' => 'price_id',
					]
				] ),
			],
		]);


		$this->assertCount(1, \SureCart::state()->getData()['checkout']['initialLineItems']);
		$this->assertTrue(\SureCart::state()->lineItems()->lineItemExists([
			'variant'  => 'variant_id',
			'price' => 'price_id',
		], \SureCart::state()->getData()['checkout']['initialLineItems']));
		$this->assertTrue(\SureCart::state()->lineItems()->lineItemExists([
			'variant_id'  => 'variant_id',
			'price_id' => 'price_id',
		], \SureCart::state()->getData()['checkout']['initialLineItems']));
		$this->assertFalse(\SureCart::state()->lineItems()->lineItemExists([
			'variant'  => 'variant_id_1',
			'price' => 'price_id_1',
		], \SureCart::state()->getData()['checkout']['initialLineItems']));
		$this->assertFalse(\SureCart::state()->lineItems()->lineItemExists([
			'variant_id'  => 'variant_id_1',
			'price_id' => 'price_id_1',
		], \SureCart::state()->getData()['checkout']['initialLineItems']));


		// this should not add another.
		\SureCart::state()->mergeData( [
			'checkout' => [
				'initialLineItems' => sc_initial_line_items( [
					[
						'variant_id'  => 'variant_id',
						'price_id' => 'price_id',
					]
				] ),
			],
		]);
		$this->assertCount(1, \SureCart::state()->getData()['checkout']['initialLineItems']);

		// this should  add another.
		\SureCart::state()->mergeData( [
			'checkout' => [
				'initialLineItems' => sc_initial_line_items( [
					[
						'price_id' => 'price_id_2',
					]
				] ),
			],
		]);
		$this->assertCount(2, \SureCart::state()->getData()['checkout']['initialLineItems']);


		// this should  add another.
		\SureCart::state()->mergeData( [
			'checkout' => [
				'initialLineItems' => sc_initial_line_items( [
					[
						'price' => 'price_id_3',
						'variant' => 'variant_id_3',
					]
				] ),
			],
		]);
		$this->assertCount(3, \SureCart::state()->getData()['checkout']['initialLineItems']);

		// this should  add another.
		\SureCart::state()->mergeData( [
			'checkout' => [
				'initialLineItems' => sc_initial_line_items( [
					[
						'price_id' => 'price_id_3',
						'variant_id' => 'variant_id_3',
					]
				] ),
			],
		]);
		$this->assertCount(3, \SureCart::state()->getData()['checkout']['initialLineItems']);

	}
}
