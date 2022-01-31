<?php
namespace CheckoutEngine\Tests\WordPress\Admin;


use CheckoutEngine\Activation\ActivationServiceProvider;
use CheckoutEngine\Permissions\RolesServiceProvider;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use CheckoutEngine\WordPress\Pages\PageService;
use CheckoutEngine\WordPress\Pages\PageServiceProvider;
use CheckoutEngine\WordPress\PluginServiceProvider;
use CheckoutEngine\WordPress\PostTypes\FormPostTypeServiceProvider;

class InstallTest extends CheckoutEngineUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				PageServiceProvider::class,
				RolesServiceProvider::class,
				FormPostTypeServiceProvider::class,
				ActivationServiceProvider::class,
				PluginServiceProvider::class,
			]
		], false);
	}

	public function test_creates_posts_and_forms()
	{
		\CheckoutEngine::plugin()->activation()->activate();

		$page_service = new PageService();
		$form = $page_service->get('checkout', 'ce_form');
		$this->assertSame($form->post_type, 'ce_form');
		$this->assertStringContainsString('wp:checkout-engine/form', $form->post_content);

		$default_form = \CheckoutEngine::forms()->getDefault();
		$this->assertEquals($form->ID, $default_form->ID);

		$page = $page_service->get('checkout');
		$this->assertSame($page->post_type, 'page');
		$this->assertStringContainsString('wp:checkout-engine/checkout-form', $page->post_content);

		$page = $page_service->get('dashboard');
		$this->assertSame($page->post_type, 'page');
		$this->assertStringContainsString('wp:checkout-engine/dashboard', $page->post_content);
	}
}
