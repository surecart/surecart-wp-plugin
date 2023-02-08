<?php
namespace SureCart\Tests\WordPress;

use SureCart\Tests\SureCartUnitTestCase;

class CartPostTypeServiceTest extends SureCartUnitTestCase {

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\WordPress\PostTypes\FormPostTypeServiceProvider::class,
			]
		], false);
	}

	public function test_preventMultipleCartPosts()
	{
		// To create our 1st default cart.
		\SureCart::cartPost()->get();

		// Try to add another cart page.
		wp_insert_post(
			[
				'post_name'		=> _x( 'cart', 'Cart slug', 'surecart' ),
				'post_title'	=> _x( 'Cart', 'Cart title', 'surecart' ),
				'post_type'		=> 'sc_cart',
				'post_status'	=> 'publish',
				'post_content'	=> '<!-- wp:surecart/cart --><sc-order-summary><sc-line-items></sc-line-items></sc-order-summary><!-- /wp:surecart/cart -->',
			]
		);

		// Get cart posts.
		$posts = get_posts(
			[
				'post_type' => 'sc_cart',
				'per_page'  => 5,
				'status'    => 'publish',
				'order' 	=> 'ASC',
			]
		);

		// Count should be 1 always.
		$this->assertCount( 1, $posts );
	}
}
