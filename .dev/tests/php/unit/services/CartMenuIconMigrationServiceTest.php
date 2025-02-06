<?php

namespace SureCart\Tests\Services;

use SureCart\BlockLibrary\CartMenuIconMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

class CartMenuIconMigrationServiceTest extends SureCartUnitTestCase {
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\BlockLibrary\BlockServiceProvider::class,
				\SureCart\Cart\CartServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\WordPress\Posts\PostServiceProvider::class,
				\SureCart\WordPress\PostTypes\PostTypeServiceProvider::class,
			],
		], false);

		$attributes = [
			'cart_icon'              => 'shopping-bag',
			'cart_menu_always_shown' => true,
		];

		$this->service = new CartMenuIconMigrationService(
			$attributes,
			new \stdClass()
		);

		parent::setUp();
	}

	/**
	 * @group block
	 */
	public function test_constructor_sets_attributes()
    {
        $attributes = [
			'cart_icon'              => 'shopping-bag',
			'cart_menu_always_shown' => true,
		];

        $this->assertSame($attributes, $this->service->attributes);
    }

	/**
	 * @group block
	 */
	public function test_render()
	{
		// Set some more attributes.
		$this->service->attributes = [
			'cart_icon'              => 'shopping-bag',
			'cart_menu_always_shown' => true,
			'textColor'              => '#000000',
		];
		$this->service->render();
		$this->assertStringContainsString('<!-- wp:surecart/cart-menu-icon-button {"cart_icon":"shopping-bag","cart_menu_always_shown":true,"textColor":"#000000"} /-->', $this->service->block_html);
	}
}
