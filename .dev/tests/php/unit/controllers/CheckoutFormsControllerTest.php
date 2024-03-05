<?php

namespace SureCart\Tests\Services;

use SureCart\Controllers\Web\CheckoutFormsController;
use SureCart\Tests\SureCartUnitTestCase;

class CheckoutFormsControllerTest extends SureCartUnitTestCase {
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Posts\PostServiceProvider::class
			]
		], false);
	}

	/**
	 * @group failing
	 */
	public function test_switches_form_mode() {
		$form_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form /-->',
		]);

		$checkout_page_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/checkout-form {"id":' . (int) $form_id . '} --><!-- /wp:surecart/checkout-form -->',
		]);

		set_query_var('sc_checkout_change_mode', $form_id);
		set_query_var('sc_checkout_post', $checkout_page_id);

		$controller = new CheckoutFormsController();
		$controller->changeMode();

		$form = get_post($form_id);
		$blocks = parse_blocks($form->post_content);
		$block = wp_get_first_block($blocks, 'surecart/form');
		$this->assertNotNull($block);
		$this->assertEquals('surecart/form', $block['blockName']);
		$this->assertEquals('test', $block['attrs']['mode']);

		$controller->changeMode();
		$form = get_post($form_id);
		$blocks = parse_blocks($form->post_content);
		$block = wp_get_first_block($blocks, 'surecart/form');
		$this->assertNotNull($block);
		$this->assertEquals('surecart/form', $block['blockName']);
		$this->assertEquals('live', $block['attrs']['mode']);
	}
}
