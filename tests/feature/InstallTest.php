<?php
namespace CheckoutEngine\Tests\WordPress\Admin;

use CheckoutEngine\Permissions\RolesServiceProvider;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use CheckoutEngine\WordPress\PluginServiceProvider;
use CheckoutEngine\WordPress\PostTypes\FormPostTypeServiceProvider;
use \Mockery;

class InstallTest extends CheckoutEngineUnitTestCase {
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				PluginServiceProvider::class,
				RolesServiceProvider::class,
				FormPostTypeServiceProvider::class
			]
		], false);
	}

	public function test_creates_posts_and_forms()
	{
		$service = new PluginServiceProvider();
		$service->activate();
		$form = \CheckoutEngine::pages()->get('checkout', 'ce_form');
		$this->assertSame($form->post_type, 'ce_form');
		$this->assertStringContainsString('wp:checkout-engine/form', $form->post_content);

		$default_form = \CheckoutEngine::forms()->getDefault();
		$this->assertEquals($form->ID, $default_form->ID);

		$page = \CheckoutEngine::pages()->get('checkout');
		$this->assertSame($page->post_type, 'page');
		$this->assertStringContainsString('wp:checkout-engine/checkout-form', $page->post_content);

		$page = \CheckoutEngine::pages()->get('dashboard');
		$this->assertSame($page->post_type, 'page');
		$this->assertStringContainsString('wp:checkout-engine/dashboard', $page->post_content);
	}
}
