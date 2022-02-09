<?php
/**
 * Configuration. Based on WPEmerge config:
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
		\CheckoutEngineAppCore\AppCore\AppCoreServiceProvider::class,
		\CheckoutEngine\WordPress\Pages\PageServiceProvider::class,
		\CheckoutEngine\WordPress\Users\UsersServiceProvider::class,
		\CheckoutEngine\WordPress\Admin\Profile\UserProfileServiceProvider::class,
		\CheckoutEngine\WordPress\PluginServiceProvider::class,
		\CheckoutEngineAppCore\Assets\AssetsServiceProvider::class,
		\CheckoutEngineAppCore\Config\ConfigServiceProvider::class,
		\CheckoutEngine\Routing\RouteConditionsServiceProvider::class,
		\CheckoutEngine\WordPress\PostTypes\FormPostTypeServiceProvider::class,
		\CheckoutEngine\WordPress\Assets\AssetsServiceProvider::class,
		\CheckoutEngine\WordPress\ShortcodesServiceProvider::class,
		\CheckoutEngine\Routing\AdminRouteServiceProvider::class,
		\CheckoutEngine\Permissions\RolesServiceProvider::class,
		\CheckoutEngine\Settings\SettingsServiceProvider::class,
		\CheckoutEngine\Request\RequestServiceProvider::class,
		\CheckoutEngine\View\ViewServiceProvider::class,
		\CheckoutEngine\Webhooks\WebhooksServiceProvider::class,
		\CheckoutEngine\BlockLibrary\BlockServiceProvider::class,
		\CheckoutEngine\Support\Errors\ErrorsServiceProvider::class,
		\CheckoutEngine\Activation\ActivationServiceProvider::class,
		\CheckoutEngine\WordPress\Admin\Menus\AdminMenuPageServiceProvider::class,

		// REST providers.
		\CheckoutEngine\Rest\AccountRestServiceProvider::class,
		\CheckoutEngine\Rest\LoginRestServiceProvider::class,
		\CheckoutEngine\Rest\PurchasesRestServiceProvider::class,
		\CheckoutEngine\Rest\CustomerRestServiceProvider::class,
		\CheckoutEngine\Rest\CustomerLinksRestServiceProvider::class,
		\CheckoutEngine\Rest\SettingsRestServiceProvider::class,
		\CheckoutEngine\Rest\PaymentMethodsRestServiceProvider::class,
		\CheckoutEngine\Rest\ProductsRestServiceProvider::class,
		\CheckoutEngine\Rest\PriceRestServiceProvider::class,
		\CheckoutEngine\Rest\CouponRestServiceProvider::class,
		\CheckoutEngine\Rest\PromotionRestServiceProvider::class,
		\CheckoutEngine\Rest\UploadsRestServiceProvider::class,
		\CheckoutEngine\Rest\ChargesRestServiceProvider::class,
		\CheckoutEngine\Rest\RefundsRestServiceProvider::class,
		\CheckoutEngine\Rest\SubscriptionRestServiceProvider::class,
		\CheckoutEngine\Rest\OrderRestServiceProvider::class,
		\CheckoutEngine\Rest\WebhooksRestServiceProvider::class,
	],

	/**
	* SSR Blocks
	*/
	'blocks'              => [
		\CheckoutEngineBlocks\BuyButton\Block::class,
		\CheckoutEngineBlocks\CheckoutForm\Block::class,
		\CheckoutEngineBlocks\Form\Block::class,
		\CheckoutEngineBlocks\LogoutButton\Block::class,
		\CheckoutEngineBlocks\Dashboard\CustomerCharges\Block::class,
		\CheckoutEngineBlocks\Dashboard\CustomerDashboard\Block::class,
		\CheckoutEngineBlocks\Dashboard\CustomerOrders\Block::class,
		\CheckoutEngineBlocks\Dashboard\CustomerSubscriptions\Block::class,
		\CheckoutEngineBlocks\Dashboard\CustomerPaymentMethods\Block::class,
		\CheckoutEngineBlocks\Dashboard\DashboardPage\Block::class,
		\CheckoutEngineBlocks\Dashboard\DashboardTab\Block::class,
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
		'edit_model'    => \CheckoutEngine\Middleware\EditModelMiddleware::class,
		'nonce'         => \CheckoutEngine\Middleware\NonceMiddleware::class,
		'webhooks'      => \CheckoutEngine\Middleware\WebhooksMiddleware::class,
	],

	/**
	 * Map model names to their corresponding classes.
	 * This lets you reference a model based on a simple string.
	 */
	'models'              => [
		'abandoned_order' => \CheckoutEngine\Models\AbandonedOrder::class,
		'account'         => \CheckoutEngine\Models\Account::class,
		'charge'          => \CheckoutEngine\Models\Charge::class,
		'coupon'          => \CheckoutEngine\Models\Coupon::class,
		'customer'        => \CheckoutEngine\Models\Customer::class,
		'customer_link'   => \CheckoutEngine\Models\CustomerLink::class,
		'form'            => \CheckoutEngine\Models\Form::class,
		'line_item'       => \CheckoutEngine\Models\LineItem::class,
		'order'           => \CheckoutEngine\Models\Order::class,
		'price'           => \CheckoutEngine\Models\Price::class,
		'processor'       => \CheckoutEngine\Models\Processor::class,
		'product'         => \CheckoutEngine\Models\Product::class,
		'promotion'       => \CheckoutEngine\Models\Promotion::class,
		'subscription'    => \CheckoutEngine\Models\Subscription::class,
		'upload'          => \CheckoutEngine\Models\Upload::class,
		'user'            => \CheckoutEngine\Models\User::class,
		'webhook'         => \CheckoutEngine\Models\Webhook::class,
	],

	/**
	 * Register middleware groups.
	 * Use fully qualified middleware class names or registered aliases.
	 * There are a couple built-in groups that you may override:
	 * - 'web'      - Automatically applied to web routes.
	 * - 'admin'    - Automatically applied to admin routes.
	 * - 'ajax'     - Automatically applied to ajax routes.
	 * - 'global'   - Automatically applied to all of the above.
	 * - 'checkout_engine' - Internal group applied the same way 'global' is.
	 *
	 * Warning: The 'checkout_engine' group contains some internal Checkout Engine core
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
	 * App Core configuration.
	 */
	'app_core'            => [
		'path' => dirname( __DIR__ ),
		'url'  => plugin_dir_url( CHECKOUT_ENGINE_PLUGIN_FILE ),
	],
];
