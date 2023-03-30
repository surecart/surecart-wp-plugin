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
		// Should be zero.
		$this->assertCount( 0, get_posts(
			[
				'post_type' => 'sc_cart',
				'per_page'  => 5,
				'status'    => 'publish',
				'order' 	=> 'ASC',
			]
		) );

		// To create our 1st default cart.
		\SureCart::cartPost()->get();

		// Should be one.
		$this->assertCount( 1, get_posts(
			[
				'post_type' => 'sc_cart',
				'per_page'  => 5,
				'status'    => 'publish',
				'order' 	=> 'ASC',
			]
		) );

		// Try to add another cart page.
		wp_insert_post(
			[
				'post_name'		=> _x( 'cart', 'Cart slug', 'surecart' ),
				'post_title'	=> _x( 'Cart', 'Cart title', 'surecart' ),
				'post_type'		=> 'sc_cart',
				'post_status'	=> 'publish',
				'post_content'	=> 'asdf',
			]
		);

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
		$this->assertSame( $posts[0]->ID, \SureCart::cartPost()->get()->ID );
	}
}
