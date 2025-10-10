<?php

namespace SureCart\Tests\Services;

use SureCart\Models\ApiToken;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Admin\Menus\AdminToolbarService;
use SureCart\WordPress\Pages\PageService;

class AdminToolbarServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

    /**
    * @var AdminToolbarService
    */
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
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

		$this->service = \SureCart::adminToolbar();

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
	public function test_is_blog_member_with_super_admin() {
		$user_id = $this->factory()->user->create(['role' => 'administrator']);
		wp_set_current_user($user_id);
		
		// Super admin should return true.
		$this->assertTrue($this->service->isBlogMember());
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_show_admin_menu_requires_admin_context() {
		// Create admin user
		$user_id = $this->factory()->user->create(['role' => 'administrator']);
		wp_set_current_user($user_id);
		
		// Set up admin context in WordPress test environment.
		// In WordPress unit tests, we need to simulate the admin environment.
		if (!defined('WP_ADMIN')) {
			define('WP_ADMIN', true);
		}
		
		// Set global variables that WordPress uses to determine admin context.
		global $pagenow;
		$pagenow = 'index.php';
		
		// Mock the pages service to avoid issues with shop page check.
		$pages_mock = \Mockery::mock(PageService::class)->makePartial();
		$pages_mock->shouldReceive('getId')->with('shop')->andReturn(999);
		$pages_mock->shouldReceive('pages')->andReturn($pages_mock);
		
		// Ensure page_on_front is different from shop page ID.
		update_option('page_on_front', 123);

		// Test the actual method.
		$result = $this->service->showAdminMenu();
		$this->assertTrue($result, 'showAdminMenu should return true when in admin context with proper user permissions');
		
		// Clean up.
		delete_option('page_on_front');
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_is_rendered_with_blocks_by_default() {
		// By default, should render with blocks (not Bricks or Elementor)
		$this->assertTrue($this->service->isRenderedWithBlocks());
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_admin_bar_site_menu_with_proper_context() {
		// Create admin user.
		$user_id = $this->factory()->user->create(['role' => 'administrator']);
		wp_set_current_user($user_id);
		
		// Set up admin context.
		if (!defined('WP_ADMIN')) {
			define('WP_ADMIN', true);
		}
		
		global $pagenow;
		$pagenow = 'index.php';
		
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		
		// Mock the pages service.
		$pages_mock = \Mockery::mock(PageService::class)->makePartial();
		$pages_mock->shouldReceive('url')->with('shop')->andReturn('http://example.com/shop');
		$pages_mock->shouldReceive('getId')->with('shop')->andReturn(999);

		// Ensure page_on_front is different from shop page ID.
		update_option('page_on_front', 123);
		
		// Should add a node when conditions are met.
		$wp_admin_bar->shouldReceive('add_node')->once()->with(\Mockery::type('array'));
		
		$this->service->adminBarSiteMenu($wp_admin_bar);
		
		// Clean up.
		delete_option('page_on_front');
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_admin_bar_site_menu_without_proper_context() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		$wp_admin_bar->shouldReceive('add_node')->never();

		$this->service->adminBarSiteMenu($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_admin_bar_new_content_requires_blog_membership() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		
		// Create a user who is not a blog member (subscriber role typically doesn't have edit capabilities)
		$user_id = $this->factory()->user->create(['role' => 'subscriber']);
		wp_set_current_user($user_id);
		
		// Mock account service to return disconnected state.
		$account_mock = \Mockery::mock();
		$account_mock->shouldReceive('isConnected')->andReturn(false);
		\SureCart::alias('account', function () use ($account_mock) {
			return $account_mock;
		});
		
		// Should not add any nodes when user is not connected.
		$wp_admin_bar->shouldReceive('add_node')->never();
		
		$this->service->adminBarNewContent($wp_admin_bar);
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
	public function test_render_product_content_requires_blocks() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');
		
		// When rendered with blocks, should add content edit node.
		$wp_admin_bar->shouldReceive('add_node')->once()->with(\Mockery::type('array'));
		
		$this->service->renderProductContent($wp_admin_bar);
	}

    /**
	 * @group admin-toolbar
	 */
	public function test_is_not_rendered_with_bricks_when_class_doesnt_exists() {
		$this->assertFalse($this->service->isRenderedWithBricks());
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_content_not_added_when_rendered_with_bricks() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');

		// Create a mock that returns true for Bricks rendering.
		$adminToolbarServiceMock = \Mockery::mock(AdminToolbarService::class, [\SureCart::make()])->makePartial();
		$adminToolbarServiceMock->shouldReceive('isRenderedWithBricks')->andReturn(true);
		$adminToolbarServiceMock->shouldReceive('isRenderedWithElementor')->andReturn(false);

		// Since isRenderedWithBlocks() will return false, no nodes should be added.
		$wp_admin_bar->shouldNotReceive('add_node');

		$adminToolbarServiceMock->renderProductContent($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_template_not_added_when_rendered_with_bricks() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');

		// Create a mock that returns true for Bricks rendering.
		$adminToolbarServiceMock = \Mockery::mock(AdminToolbarService::class, [\SureCart::make()])->makePartial();
		$adminToolbarServiceMock->shouldReceive('isRenderedWithBricks')->andReturn(true);
		$adminToolbarServiceMock->shouldReceive('isRenderedWithElementor')->andReturn(false);

		// Since isRenderedWithBlocks() will return false, no nodes should be added.
		$wp_admin_bar->shouldNotReceive('add_node');

		$adminToolbarServiceMock->renderProductTemplate($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_is_not_rendered_with_elementor_when_class_doesnt_exists() {
		$this->assertFalse($this->service->isRenderedWithElementor());
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_content_not_added_when_rendered_with_elementor() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');

		// Create a mock that returns true for Elementor rendering.
		$adminToolbarServiceMock = \Mockery::mock(AdminToolbarService::class, [\SureCart::make()])->makePartial();
		$adminToolbarServiceMock->shouldReceive('isRenderedWithBricks')->andReturn(false);
		$adminToolbarServiceMock->shouldReceive('isRenderedWithElementor')->andReturn(true);

		// Since isRenderedWithBlocks() will return false, no nodes should be added.
		$wp_admin_bar->shouldNotReceive('add_node');

		$adminToolbarServiceMock->renderProductContent($wp_admin_bar);
	}

	/**
	 * @group admin-toolbar
	 */
	public function test_render_product_template_not_added_when_rendered_with_elementor() {
		$wp_admin_bar = \Mockery::mock('WP_Admin_Bar');

		// Create a mock that returns true for Elementor rendering.
		$adminToolbarServiceMock = \Mockery::mock(AdminToolbarService::class, [\SureCart::make()])->makePartial();
		$adminToolbarServiceMock->shouldReceive('isRenderedWithBricks')->andReturn(false);
		$adminToolbarServiceMock->shouldReceive('isRenderedWithElementor')->andReturn(true);

		// Since isRenderedWithBlocks() will return false, no nodes should be added.
		$wp_admin_bar->shouldNotReceive('add_node');

		$adminToolbarServiceMock->renderProductTemplate($wp_admin_bar);
	}
}
