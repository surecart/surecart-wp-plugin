<?php
/**
 * WP Emerge configuration.
 *
 * @link https://docs.wpemerge.com/#/framework/configuration
 *
 * @package CheckoutEngine
 */

return [
	/**
	 * Array of service providers you wish to enable.
	 */
	'providers'           => [
		\WPEmergeAppCore\AppCore\AppCoreServiceProvider::class,
		\CheckoutEngine\WordPress\PluginServiceProvider::class,
		\WPEmergeAppCore\Assets\AssetsServiceProvider::class,
		\WPEmergeAppCore\Config\ConfigServiceProvider::class,
		\CheckoutEngine\Routing\RouteConditionsServiceProvider::class,
		\CheckoutEngine\WordPress\AdminServiceProvider::class,
		\CheckoutEngine\WordPress\PostTypes\FormPostTypeServiceProvider::class,
		\CheckoutEngine\WordPress\Assets\AssetsServiceProvider::class,
		\CheckoutEngine\WordPress\ShortcodesServiceProvider::class,
		\CheckoutEngine\Routing\AdminRouteServiceProvider::class,
		\CheckoutEngine\Permissions\RolesServiceProvider::class,
		\CheckoutEngine\Settings\SettingsServiceProvider::class,
		\CheckoutEngine\Request\RequestServiceProvider::class,
		\WPEmergeBlade\View\ServiceProvider::class,
		\CheckoutEngine\View\ViewServiceProvider::class,
		\CheckoutEngine\Blocks\BlockServiceProvider::class,
		\CheckoutEngine\Support\Errors\ErrorsServiceProvider::class,

		// REST providers.
		\CheckoutEngine\Rest\AccountRestServiceProvider::class,
		\CheckoutEngine\Rest\SettingsRestServiceProvider::class,
		\CheckoutEngine\Rest\ProductsRestServiceProvider::class,
		\CheckoutEngine\Rest\PriceRestServiceProvider::class,
		\CheckoutEngine\Rest\CouponRestServiceProvider::class,
		\CheckoutEngine\Rest\PromotionRestServiceProvider::class,
		\CheckoutEngine\Rest\UploadsRestServiceProvider::class,
		\CheckoutEngine\Rest\ChargesRestServiceProvider::class,
		\CheckoutEngine\Rest\SubscriptionRestServiceProvider::class,
		\CheckoutEngine\Rest\CheckoutSessionRestServiceProvider::class,
	],

	/**
	* Blocks
	*/
	'blocks'              => [
		\CheckoutEngine\Blocks\CheckoutForm::class,
		\CheckoutEngine\Blocks\Form::class,
		\CheckoutEngine\Blocks\BuyButton::class,
		\CheckoutEngine\Blocks\CustomerDashboardPage::class,
		\CheckoutEngine\Blocks\CustomerDashboardTab::class,
		\CheckoutEngine\Blocks\CustomerDashboardButton::class,
		\CheckoutEngine\Blocks\Dashboard\CustomerOverview::class,
		\CheckoutEngine\Blocks\Dashboard\CustomerOrders::class,
		\CheckoutEngine\Blocks\Dashboard\CustomerCharges::class,
	],

	/**
	 * And array of plugin settings to register
	 */
	'settings'            => [
		\CheckoutEngine\Settings\Setting\AccountSetting::class,
	],

	/**
	 * Array of route group definitions and default attributes.
	 * All of these are optional so if we are not using
	 * a certain group of routes we can skip it.
	 * If we are not using routing at all we can skip
	 * the entire 'routes' option.
	 */
	'routes'              => [
		'web'   => [
			'definitions' => __DIR__ . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'web.php',
			'attributes'  => [
				'namespace' => 'CheckoutEngine\\Controllers\\Web\\',
			],
		],
		'admin' => [
			'definitions' => __DIR__ . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'admin.php',
			'attributes'  => [
				'namespace' => 'CheckoutEngine\\Controllers\\Admin\\',
			],
		],
		'ajax'  => [
			'definitions' => __DIR__ . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'ajax.php',
			'attributes'  => [
				'namespace' => 'CheckoutEngine\\Controllers\\Ajax\\',
			],
		],
	],

	/**
	 * View Composers settings.
	 */
	'view_composers'      => [
		'namespace' => 'CheckoutEngine\\ViewComposers\\',
	],

	/**
	 * Register middleware class aliases.
	 * Use fully qualified middleware class names.
	 *
	 * Internal aliases that you should avoid overriding:
	 * - 'flash'
	 * - 'old_input'
	 * - 'csrf'
	 * - 'user.logged_in'
	 * - 'user.logged_out'
	 * - 'user.can'
	 */
	'middleware'          => [
		'archive_model' => \CheckoutEngine\Middleware\ArchiveModelMiddleware::class,
	],

	/**
	 * Register middleware groups.
	 * Use fully qualified middleware class names or registered aliases.
	 * There are a couple built-in groups that you may override:
	 * - 'web'      - Automatically applied to web routes.
	 * - 'admin'    - Automatically applied to admin routes.
	 * - 'ajax'     - Automatically applied to ajax routes.
	 * - 'global'   - Automatically applied to all of the above.
	 * - 'wpemerge' - Internal group applied the same way 'global' is.
	 *
	 * Warning: The 'wpemerge' group contains some internal WP Emerge
	 * middleware which you should avoid overriding.
	 */
	'middleware_groups'   => [
		'global' => [],
		'web'    => [],
		'ajax'   => [],
		'admin'  => [],
	],

	/**
	 * Optionally specify middleware execution order.
	 * Use fully qualified middleware class names.
	 */
	'middleware_priority' => [
		// phpcs:ignore
		// \CheckoutEngine\Middleware\MyMiddlewareThatShouldRunFirst::class,
		// \CheckoutEngine\Middleware\MyMiddlewareThatShouldRunSecond::class,
	],

	/**
	 * Custom directories to search for views.
	 * Use absolute paths or leave blank to disable.
	 * Applies only to the default PhpViewEngine.
	 */
	'views'               => [ dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'views' ],

	/**
	 * Blade options
	 */
	'blade'               => [
		'options' => [
			// 'cache' defaults to the main ['cache']['path'] key of the configuration.
			'cache' => 'wp-content/uploads/checkout-engine/cache/blade',
		],
	],

	/**
	 * App Core configuration.
	 */
	'app_core'            => [
		'path' => dirname( __DIR__ ),
		'url'  => plugin_dir_url( CHECKOUT_ENGINE_PLUGIN_FILE ),
	],
];
