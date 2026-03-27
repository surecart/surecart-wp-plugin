<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Models\Account;
use SureCart\Models\Brand;
use SureCart\WordPress\ThemeService;

class ThemeServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * The service instance.
	 *
	 * @var ThemeService
	 */
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
			],
		], false);

		$this->service = new ThemeService();

		// Clean up options and transients.
		delete_option( 'surecart_theme' );
		delete_transient( 'surecart_account' );
	}

	/**
	 * Helper to set the account transient with a brand.
	 *
	 * @param array $brand_data Brand attributes.
	 * @param array $account_data Additional account attributes.
	 */
	private function setAccountWithBrand( array $brand_data = [], array $account_data = [] ) {
		$brand = new Brand( array_merge( [
			'id'     => 'test-brand-id',
			'object' => 'brand',
		], $brand_data ) );

		$account = new Account( array_merge( [
			'id'       => 'test-account-id',
			'object'   => 'account',
			'currency' => 'usd',
			'brand'    => $brand,
		], $account_data ) );

		set_transient( 'surecart_account', $account->toArray() );

		// Populate the account service cache.
		\SureCart::account()->fetchCachedAccount();
	}

	// -------------------------------------------------------------------------
	// mode() tests
	// -------------------------------------------------------------------------

	/**
	 * @group theme
	 */
	public function test_mode_returns_light_by_default() {
		$this->setAccountWithBrand();
		$this->assertSame( 'light', $this->service->mode() );
	}

	/**
	 * @group theme
	 */
	public function test_mode_returns_dark_when_brand_theme_is_dark() {
		$this->setAccountWithBrand( [ 'theme' => 'dark' ] );
		$this->assertSame( 'dark', $this->service->mode() );
	}

	/**
	 * @group theme
	 */
	public function test_mode_falls_back_to_wp_option() {
		update_option( 'surecart_theme', 'dark' );
		// No account transient — brand will be empty.
		$this->assertSame( 'dark', $this->service->mode() );
	}

	/**
	 * @group theme
	 */
	public function test_mode_falls_back_to_light_when_no_option() {
		// No account transient and no WP option.
		$this->assertSame( 'light', $this->service->mode() );
	}

	// -------------------------------------------------------------------------
	// logoUrl() tests
	// -------------------------------------------------------------------------

	/**
	 * @group theme
	 */
	public function test_logo_url_returns_dark_logo_when_dark_theme() {
		$this->setAccountWithBrand( [
			'theme'    => 'dark',
			'logo_url' => 'https://example.com/logo.png',
			'dark_logo' => (object) [
				'id'  => 'dark-logo-id',
				'url' => 'https://example.com/dark-logo.png',
			],
		] );
		$this->assertSame( 'https://example.com/dark-logo.png', $this->service->logoUrl() );
	}

	/**
	 * @group theme
	 */
	public function test_logo_url_returns_standard_logo_when_light_theme() {
		$this->setAccountWithBrand( [
			'theme'    => 'light',
			'logo_url' => 'https://example.com/logo.png',
		] );
		$this->assertSame( 'https://example.com/logo.png', $this->service->logoUrl() );
	}

	/**
	 * @group theme
	 */
	public function test_logo_url_falls_back_to_standard_logo_when_dark_theme_has_no_dark_logo() {
		$this->setAccountWithBrand( [
			'theme'    => 'dark',
			'logo_url' => 'https://example.com/logo.png',
		] );
		$this->assertSame( 'https://example.com/logo.png', $this->service->logoUrl() );
	}

	/**
	 * @group theme
	 */
	public function test_logo_url_returns_empty_string_when_brand_is_unavailable() {
		// No account transient — brand will be empty.
		$this->assertSame( '', $this->service->logoUrl() );
	}

	// -------------------------------------------------------------------------
	// brandColor() tests
	// -------------------------------------------------------------------------

	/**
	 * @group theme
	 */
	public function test_brand_color_returns_dark_color_when_dark_theme() {
		$this->setAccountWithBrand( [
			'theme'      => 'dark',
			'color'      => '17E19C',
			'dark_color' => 'FF5733',
		] );
		$this->assertSame( 'FF5733', $this->service->brandColor() );
	}

	/**
	 * @group theme
	 */
	public function test_brand_color_returns_regular_color_when_light_theme() {
		$this->setAccountWithBrand( [
			'theme' => 'light',
			'color' => '17E19C',
		] );
		$this->assertSame( '17E19C', $this->service->brandColor() );
	}

	/**
	 * @group theme
	 */
	public function test_brand_color_falls_back_to_standard_color_when_dark_theme_has_no_dark_color() {
		$this->setAccountWithBrand( [
			'theme' => 'dark',
			'color' => '17E19C',
		] );
		$this->assertSame( '17E19C', $this->service->brandColor() );
	}

	/**
	 * @group theme
	 */
	public function test_brand_color_returns_fallback_when_brand_unavailable() {
		// No account transient — brand will be empty.
		$this->assertSame( '000000', $this->service->brandColor() );
	}
}
