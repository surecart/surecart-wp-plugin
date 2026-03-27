<?php
namespace SureCart\Tests\WordPress\Admin;


use SureCart\Activation\ActivationServiceProvider;
use SureCart\Permissions\PermissionsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Pages\PageService;
use SureCart\WordPress\Pages\PageServiceProvider;
use SureCart\WordPress\PluginServiceProvider;
use SureCart\WordPress\Posts\PostServiceProvider;
use SureCart\WordPress\PostTypes\PostTypeServiceProvider;

class InstallTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				PageServiceProvider::class,
				PermissionsServiceProvider::class,
				PostTypeServiceProvider::class,
				ActivationServiceProvider::class,
				PluginServiceProvider::class,
				PostServiceProvider::class
			]
		], false);
	}

	public function test_creates_posts_and_forms()
	{
		\SureCart::plugin()->activation()->activate();

		$page_service = new PageService();
		$form = $page_service->get('checkout', 'sc_form');
		$this->assertSame($form->post_type, 'sc_form');
		$this->assertStringContainsString('wp:surecart/form', $form->post_content);
		$this->assertStringContainsString('wp:surecart/submit', $form->post_content);

		$default_form = \SureCart::forms()->getDefault();
		$this->assertEquals($form->ID, $default_form->ID);

		$page = $page_service->get('checkout');
		$this->assertSame($page->post_type, 'page');
		$this->assertStringContainsString('wp:surecart/checkout-form', $page->post_content);
		$this->assertStringContainsString('wp:surecart/checkout-form {"id":' . (int) $default_form->ID . '}', htmlspecialchars_decode($page->post_content));

		$page = $page_service->get('dashboard');
		$this->assertSame($page->post_type, 'page');
		$this->assertStringContainsString('wp:surecart/dashboard', $page->post_content);
	}
}
