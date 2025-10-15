<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Admin\Menus\AdminToolbarService;

class AdminToolbarServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * @var \Mockery\MockInterface
	 */
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		// Set up an app instance with whatever stubs and mocks we need before every test.
		$app =\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Pages\PageServiceProvider::class,
                \SureCart\WordPress\PluginServiceProvider::class,
                \SureCart\Account\AccountServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
                \SureCart\WordPress\Admin\Menus\AdminMenuPageServiceProvider::class,
				\SureCart\Integrations\Bricks\BricksServiceProvider::class,
				\SureCart\Integrations\Elementor\ElementorServiceProvider::class,
			]
		], false);

		$this->service = \Mockery::mock(AdminToolbarService::class, [$app])->makePartial();

		parent::setUp();
	}

    /**
	 * @group admin-toolbar
	 */
	public function test_admin_toolbar_is_enabled_by_default() {
		// When option is not set, toolbar should be enabled by default.
		delete_option('surecart_admin_toolbar_disabled');
		$this->assertTrue($this->service->isEnabled());
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_admin_toolbar_can_be_disabled() {
		// When option is set to true, toolbar should be disabled.
		update_option('surecart_admin_toolbar_disabled', true);
		$this->assertFalse($this->service->isEnabled());

		// Clean up.
		delete_option('surecart_admin_toolbar_disabled');
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_is_blog_member_with_regular_user() {
		$user_id = $this->factory()->user->create(['role' => 'subscriber']);
		wp_set_current_user($user_id);

		// Regular site member should return true
		$this->assertTrue($this->service->isBlogMember());
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_is_rendered_with_blocks_by_default() {
		// By default, should render with blocks (not Bricks or Elementor)
		$this->assertTrue($this->service->isRenderedWithBlocks());
	}

	public function test_show_admin_menu() {
		$this->assertFalse($this->service->showAdminMenu());
		$this->service->shouldReceive('isAdmin')->andReturn(false);
		$this->assertFalse($this->service->showAdminMenu());
		$this->service->shouldReceive('isAdminBarShowing')->andReturn(true);
		$this->assertFalse($this->service->showAdminMenu());
		$this->service->shouldReceive('isBlogMember')->andReturn(true);
		$this->assertFalse($this->service->showAdminMenu());
		$this->service->shouldReceive('isShopPageOnFront')->andReturn(false);
		$this->assertTrue($this->service->showAdminMenu());
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_admin_bar_new_content_with_connected_account() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');

		// Create an admin user with proper capabilities.
		$user_id = $this->factory()->user->create(['role' => 'administrator']);
		wp_set_current_user($user_id);

		// Mock account service as connected.
		$account_mock = \Mockery::mock();
		$account_mock->shouldReceive('isConnected')->andReturn(true);
		\SureCart::alias('account', function () use ($account_mock) {
			return $account_mock;
		});

		// Mock URL service to handle the invoice URL creation.
		$url_mock = \Mockery::mock();
		$url_mock->shouldReceive('create')->with('invoices')->andReturn('http://example.com/invoices/create');
		\SureCart::alias('getUrl', function () use ($url_mock) {
			return $url_mock;
		});

		// Should add nodes when user has capabilities and account is connected.
		$wp_admin_bar->shouldReceive('add_node')->atLeast()->once();

		$this->service->adminBarNewContent($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_does_not_render_without_blocks() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		// When rendered with blocks, should add content edit node.
		$wp_admin_bar->shouldReceive('add_node')->never()->with(\Mockery::type('array'));
		$this->service->shouldReceive('isRenderedWithBlocks')->andReturn(false);
		$this->service->renderProductContent($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_renders_with_blocks() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		// When rendered with blocks, should add content edit node.
		$wp_admin_bar->shouldReceive('add_node')->once()->with(\Mockery::type('array'));
		$this->service->shouldReceive('isRenderedWithBlocks')->andReturn(true);
		$this->service->renderProductContent($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_content_not_added_when_rendered_with_bricks() {
		// Create a mock that returns true for Bricks rendering.
		$this->service->shouldReceive('isRenderedWithBricks')->andReturn(true);
		$this->service->shouldReceive('isRenderedWithElementor')->andReturn(false);

		// Since isRenderedWithBlocks() will return false, no nodes should be added.
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		$wp_admin_bar->shouldNotReceive('add_node');

		$this->service->renderProductContent($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_template_not_added_when_rendered_with_bricks() {
		// Create a mock that returns true for Bricks rendering.
		$this->service->shouldReceive('isRenderedWithBricks')->andReturn(true);
		$this->service->shouldReceive('isRenderedWithElementor')->andReturn(false);

		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		$wp_admin_bar->shouldNotReceive('add_node');

		$this->service->renderProductTemplate($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_content_not_added_when_rendered_with_elementor() {
		// Create a mock that returns true for Elementor rendering.
		$this->service->shouldReceive('isRenderedWithBricks')->andReturn(false);
		$this->service->shouldReceive('isRenderedWithElementor')->andReturn(true);

		// Since isRenderedWithBlocks() will return false, no nodes should be added.
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		$wp_admin_bar->shouldNotReceive('add_node');

		$this->service->renderProductContent($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_template_not_added_when_rendered_with_elementor() {

		// Create a mock that returns true for Elementor rendering.
		$this->service->shouldReceive('isRenderedWithBricks')->andReturn(false);
		$this->service->shouldReceive('isRenderedWithElementor')->andReturn(true);

		// Since isRenderedWithBlocks() will return false, no nodes should be added.
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		$wp_admin_bar->shouldNotReceive('add_node');

		$this->service->renderProductTemplate($wp_admin_bar);
	}
}
