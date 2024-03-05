<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;

class PostServiceTest extends SureCartUnitTestCase {
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
	public function test_gets_form_block_from_form_post() {
		$post_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form /-->',
		]);

		$service = \SureCart::post();
		$block = $service->getFormBlock($post_id);
		$this->assertNotNull($block);
		$this->assertEquals('surecart/form', $block['blockName']);

		$service = \SureCart::post();
		$block = $service->getFormBlock(get_post($post_id));
		$this->assertNotNull($block);
		$this->assertEquals('surecart/form', $block['blockName']);
	}

	/**
	 * @group failing
	 */
	public function test_gets_form_block_from_form_checkout_block() {
		$form_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form /-->',
		]);

		$checkout_page_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/checkout-form {"id":' . (int) $form_id . '} --><!-- /wp:surecart/checkout-form -->',
		]);

		$service = \SureCart::post();
		$block = $service->getFormBlock($checkout_page_id);
		$this->assertNotNull($block);
		$this->assertEquals('surecart/form', $block['blockName']);

		$service = \SureCart::post();
		$block = $service->getFormBlock(get_post($checkout_page_id));
		$this->assertNotNull($block);
		$this->assertEquals('surecart/form', $block['blockName']);
	}
}
