<?php
/**
 * Configuration. Based on WPEmerge config:
 *
 * @link https://docs.wpemerge.com/#/framework/configuration
 *
 * @package SureCart
 */

return [
	/**
	 * Array of service providers you wish to enable.
	 */
	'providers'              => [
		\SureCartAppCore\AppCore\AppCoreServiceProvider::class,
		\SureCart\WordPress\TranslationsServiceProvider::class,
		\SureCart\Account\AccountServiceProvider::class,
		\SureCart\WordPress\Pages\PageServiceProvider::class,
		\SureCart\WordPress\Users\UsersServiceProvider::class,
		\SureCart\WordPress\Admin\Profile\UserProfileServiceProvider::class,
		\SureCart\Integrations\DiviServiceProvider::class,
		\SureCart\WordPress\PluginServiceProvider::class,
		\SureCartAppCore\Assets\AssetsServiceProvider::class,
		\SureCartAppCore\Config\ConfigServiceProvider::class,
		\SureCart\Routing\RouteConditionsServiceProvider::class,
		\SureCart\WordPress\PostTypes\FormPostTypeServiceProvider::class,
		\SureCart\WordPress\Assets\AssetsServiceProvider::class,
		\SureCart\WordPress\ShortcodesServiceProvider::class,
		\SureCart\Routing\AdminRouteServiceProvider::class,
		\SureCart\Permissions\RolesServiceProvider::class,
		\SureCart\Settings\SettingsServiceProvider::class,
		\SureCart\Request\RequestServiceProvider::class,
		\SureCart\View\ViewServiceProvider::class,
		\SureCart\Webhooks\WebhooksServiceProvider::class,
		\SureCart\BlockLibrary\BlockServiceProvider::class,
		\SureCart\Support\Errors\ErrorsServiceProvider::class,
		\SureCart\Activation\ActivationServiceProvider::class,
		\SureCart\WordPress\Admin\Menus\AdminMenuPageServiceProvider::class,
		\SureCart\WordPress\Admin\Notices\AdminNoticesServiceProvider::class,

		// REST providers.
		\SureCart\Rest\BlockPatternsRestServiceProvider::class,
		\SureCart\Rest\AccountRestServiceProvider::class,
		\SureCart\Rest\LoginRestServiceProvider::class,
		\SureCart\Rest\FilesRestServiceProvider::class,
		\SureCart\Rest\PurchasesRestServiceProvider::class,
		\SureCart\Rest\CustomerRestServiceProvider::class,
		\SureCart\Rest\CustomerLinksRestServiceProvider::class,
		\SureCart\Rest\PaymentMethodsRestServiceProvider::class,
		\SureCart\Rest\ProductsRestServiceProvider::class,
		\SureCart\Rest\ProductGroupsRestServiceProvider::class,
		\SureCart\Rest\PriceRestServiceProvider::class,
		\SureCart\Rest\CouponRestServiceProvider::class,
		\SureCart\Rest\PromotionRestServiceProvider::class,
		\SureCart\Rest\UploadsRestServiceProvider::class,
		\SureCart\Rest\ChargesRestServiceProvider::class,
		\SureCart\Rest\RefundsRestServiceProvider::class,
		\SureCart\Rest\SubscriptionRestServiceProvider::class,
		\SureCart\Rest\SubscriptionProtocolRestServiceProvider::class,
		\SureCart\Rest\OrderRestServiceProvider::class,
		\SureCart\Rest\InvoicesRestServiceProvider::class,
		\SureCart\Rest\WebhooksRestServiceProvider::class,
	],

	/**
	* SSR Blocks
	*/
	'blocks'                 => [
		\SureCartBlocks\Blocks\BuyButton\Block::class,
		\SureCartBlocks\Blocks\CustomerDashboardButton\Block::class,
		\SureCartBlocks\Blocks\CheckoutForm\Block::class,
		\SureCartBlocks\Blocks\Form\Block::class,
		\SureCartBlocks\Blocks\LogoutButton\Block::class,
		\SureCartBlocks\Blocks\Dashboard\WordPressAccount\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerCharges\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerDashboard\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerOrders\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerDownloads\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerBillingDetails\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerPaymentMethods\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerSubscriptions\Block::class,
		\SureCartBlocks\Blocks\Dashboard\CustomerInvoices\Block::class,
		\SureCartBlocks\Blocks\Dashboard\DashboardPage\Block::class,
		\SureCartBlocks\Blocks\Dashboard\DashboardTab\Block::class,
	],

	/**
	* Permission Controllers
	*/
	'permission_controllers' => [
		\SureCart\Permissions\Models\ChargePermissionsController::class,
		\SureCart\Permissions\Models\CustomerPermissionsController::class,
		\SureCart\Permissions\Models\OrderPermissionsController::class,
		\SureCart\Permissions\Models\InvoicePermissionsController::class,
		\SureCart\Permissions\Models\PaymentMethodPermissionsController::class,
		\SureCart\Permissions\Models\PurchasePermissionsController::class,
		\SureCart\Permissions\Models\RefundPermissionsController::class,
		\SureCart\Permissions\Models\SubscriptionPermissionsController::class,
	],

	/**
	 * And array of plugin settings to register
	 */
	'settings'               => [
		\SureCart\Settings\Setting\AccountSetting::class,
	],

	/**
	 * Array of route group definitions and default attributes.
	 * All of these are optional so if we are not using
	 * a certain group of routes we can skip it.
	 * If we are not using routing at all we can skip
	 * the entire 'routes' option.
	 */
	'routes'                 => [
		'web'   => [
			'definitions' => __DIR__ . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'web.php',
			'attributes'  => [
				'namespace' => 'SureCart\\Controllers\\Web\\',
			],
		],
		'admin' => [
			'definitions' => __DIR__ . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'admin.php',
			'attributes'  => [
				'namespace' => 'SureCart\\Controllers\\Admin\\',
			],
		],
		'ajax'  => [
			'definitions' => __DIR__ . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'ajax.php',
			'attributes'  => [
				'namespace' => 'SureCart\\Controllers\\Ajax\\',
			],
		],
	],

	/**
	 * View Composers settings.
	 */
	'view_composers'         => [
		'namespace' => 'SureCart\\ViewComposers\\',
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
	'middleware'             => [
		'archive_model'     => \SureCart\Middleware\ArchiveModelMiddleware::class,
		'edit_model'        => \SureCart\Middleware\EditModelMiddleware::class,
		'nonce'             => \SureCart\Middleware\NonceMiddleware::class,
		'webhooks'          => \SureCart\Middleware\WebhooksMiddleware::class,
		'assets.components' => \SureCart\Middleware\ComponentAssetsMiddleware::class,
	],

	/**
	 * Map model names to their corresponding classes.
	 * This lets you reference a model based on a simple string.
	 */
	'models'                 => [
		'abandoned_order' => \SureCart\Models\AbandonedOrder::class,
		'account'         => \SureCart\Models\Account::class,
		'charge'          => \SureCart\Models\Charge::class,
		'coupon'          => \SureCart\Models\Coupon::class,
		'customer'        => \SureCart\Models\Customer::class,
		'customer_link'   => \SureCart\Models\CustomerLink::class,
		'form'            => \SureCart\Models\Form::class,
		'line_item'       => \SureCart\Models\LineItem::class,
		'order'           => \SureCart\Models\Order::class,
		'price'           => \SureCart\Models\Price::class,
		'processor'       => \SureCart\Models\Processor::class,
		'product'         => \SureCart\Models\Product::class,
		'promotion'       => \SureCart\Models\Promotion::class,
		'subscription'    => \SureCart\Models\Subscription::class,
		'upload'          => \SureCart\Models\Upload::class,
		'user'            => \SureCart\Models\User::class,
		'webhook'         => \SureCart\Models\Webhook::class,
	],

	/**
	 * Register middleware groups.
	 * Use fully qualified middleware class names or registered aliases.
	 * There are a couple built-in groups that you may override:
	 * - 'web'      - Automatically applied to web routes.
	 * - 'admin'    - Automatically applied to admin routes.
	 * - 'ajax'     - Automatically applied to ajax routes.
	 * - 'global'   - Automatically applied to all of the above.
	 * - 'surecart' - Internal group applied the same way 'global' is.
	 *
	 * Warning: The 'surecart' group contains some internal SureCart core
	 * middleware which you should avoid overriding.
	 */
	'middleware_groups'      => [
		'global' => [],
		'web'    => [],
		'ajax'   => [],
		'admin'  => [],
	],

	/**
	 * Optionally specify middleware execution order.
	 * Use fully qualified middleware class names.
	 */
	'middleware_priority'    => [
		// phpcs:ignore
		// \SureCart\Middleware\MyMiddlewareThatShouldRunFirst::class,
		// \SureCart\Middleware\MyMiddlewareThatShouldRunSecond::class,
	],

	/**
	 * Custom directories to search for views.
	 * Use absolute paths or leave blank to disable.
	 * Applies only to the default PhpViewEngine.
	 */
	'views'                  => [ dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'views' ],

	/**
	 * App Core configuration.
	 */
	'app_core'               => [
		'path' => dirname( __DIR__ ),
		'url'  => plugin_dir_url( SURECART_PLUGIN_FILE ),
	],
];
