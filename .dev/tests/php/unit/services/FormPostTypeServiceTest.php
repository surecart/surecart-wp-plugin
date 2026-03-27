<?php

namespace SureCart\Tests\Unit\Services;

use SureCart\Tests\SureCartUnitTestCase;

class FormPostTypeServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Posts\PostServiceProvider::class,
				\SureCart\WordPress\PostTypes\PostTypeServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
			]
		], false);
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown() : void {
		delete_option('surecart_checkout_page_id');
		delete_option('surecart_checkout_sc_form_id');
		parent::tearDown();
	}

	public function test_finds_form_post_from_block() {
		$form_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form /-->',
		]);

		$checkout_page_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/checkout-form {"id":' . (int) $form_id . '} --><!-- /wp:surecart/checkout-form -->',
		]);

		update_option('surecart_checkout_page_id', $checkout_page_id);

		$post = \SureCart::forms()->getDefault();
		$this->assertNotNull($post);
		$this->assertEquals($post->ID, $form_id);
	}

	public function test_finds_form_post_from_shortcode() {
		$form_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form /-->',
		]);

		$checkout_page_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '[sc_form id="' . (int) $form_id . '"]',
		]);

		update_option('surecart_checkout_page_id', $checkout_page_id);

		$post = \SureCart::forms()->getDefault();
		$this->assertNotNull($post);
		$this->assertEquals($post->ID, $form_id);
	}

	public function test_finds_form_post_from_inner_shortcode() {
		$form_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form /-->',
		]);

		$checkout_page_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- divi:shortcode -->[test id=123][sc_form id="' . (int) $form_id . '"]<!-- /divi:shortcode -->',
		]);

		update_option('surecart_checkout_page_id', $checkout_page_id);

		$post = \SureCart::forms()->getDefault();
		$this->assertNotNull($post);
		$this->assertEquals($post->ID, $form_id);
	}

	public function test_finds_form_post_by_option_as_fallback() {
		$form_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form /-->',
		]);

		update_option('surecart_checkout_sc_form_id', $form_id);

		$checkout_page_id = $this->factory()->post->create([
			'post_type' => 'sc_form',
			'post_content' => '<div>test</div>',
		]);

		update_option('surecart_checkout_page_id', $checkout_page_id);

		$post = \SureCart::forms()->getDefault();
		$this->assertNotNull($post);
		$this->assertEquals($post->ID, $form_id);
	}
}
