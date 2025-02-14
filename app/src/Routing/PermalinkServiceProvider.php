<?php

namespace SureCart\Routing;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide custom route conditions.
 * This is an example class so feel free to modify or remove it.
 */
class PermalinkServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.settings.permalinks.product'] = function () {
			return new PermalinkSettingService(
				[
					'slug'        => 'product',
					'label'       => __( 'SureCart Product Permalinks', 'surecart' ),
					/* translators: %s: Home URL */
					'description' => sprintf( __( 'If you like, you may enter custom structures for your product page URLs here. For example, using <code>products</code> would make your product buy links like <code>%sproducts/sample-product/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
					'options'     => [
						[
							'value' => 'products',
							'label' => __( 'Default', 'surecart' ),
						],
						[
							'value' => 'shop',
							'label' => __( 'Shop', 'surecart' ),
						],
						[
							'value'   => 'shop/%sc_collection%/',
							'display' => 'shop/product-collection/',
							'label'   => __( 'Shop base with collection', 'surecart' ),
						],
					],
				]
			);
		};

		$container['surecart.settings.permalinks.buy'] = function () {
			return new PermalinkSettingService(
				[
					'slug'        => 'buy',
					'label'       => __( 'SureCart Instant Checkout Permalinks', 'surecart' ),
					/* translators: %s: Home URL */
					'description' => sprintf( __( 'If you like, you may enter custom structures for your instant checkout URLs here. For example, using <code>buy</code> would make your product buy links like <code>%sbuy/sample-product/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
					'options'     => [
						[
							'value' => 'buy',
							'label' => __( 'Default', 'surecart' ),
						],
						[
							'value' => 'purchase',
							'label' => __( 'Purchase', 'surecart' ),
						],
					],
				]
			);
		};

		$container['surecart.settings.permalinks.collection'] = function () {
			return new PermalinkSettingService(
				[
					'slug'                => 'collection',
					'label'               => __( 'SureCart Product Collection Permalinks', 'surecart' ),
					/* translators: %s: Home URL */
					'description'         => sprintf( __( 'If you like, you may enter custom structures for your product page URLs here. For example, using <code>collections</code> would make your product collection links like <code>%scollections/sample-collection/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
					'options'             => [
						[
							'value' => 'collections',
							'label' => __( 'Default', 'surecart' ),
						],
						[
							'value' => 'product-collections',
							'label' => __( 'Product Collections', 'surecart' ),
						],
					],
					'sample_preview_text' => 'sample-collection',
				]
			);
		};

		$container['surecart.settings.permalinks.upsell'] = function () {
			return new PermalinkSettingService(
				[
					'slug'        => 'upsell',
					'label'       => __( 'SureCart Upsell Permalinks', 'surecart' ),
					/* translators: %s: Home URL */
					'description' => sprintf( __( 'If you like, you may enter custom structures for your upsell URLs here. For example, using <code>offers</code> would make your upsell\'s links like <code>%soffers/upsell-id/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
					'options'     => [
						[
							'value' => 'offer',
							'label' => __( 'Default', 'surecart' ),
						],
						[
							'value' => 'special-offer',
							'label' => __( 'Special Offer', 'surecart' ),
						],
					],
				]
			);
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.settings.permalinks.product']->bootstrap();

		$product_base = \SureCart::settings()->permalinks()->getBase( 'product_page' );
		// Handle product page with collection support.
		$permalink = new PermalinkService();
		$permalink->url( untrailingslashit( $product_base ) . '/([a-z0-9-]+)[/]?$' )
			->query( 'index.php?sc_product=$matches[1]' );

		// We need to make sure WordPress does not try to go to a collection page.
		if ( preg_match( '`/(.+)(/%sc_collection%/)`', $product_base, $matches ) ) {
			$permalink->removeRules(
				'`^' . preg_quote( $matches[1], '`' ) . '/([^/]+)$`',
				'/^(index\.php\?sc_collection)(?!(.*product))/'
			);
		}

		// Rule for default product base.
		$permalink->addRule(
			'^([^/]+)/([^/]+)/?$',
			'index.php?sc_product=$matches[2]',
			'top'
		);

		// Add default product route.
		$permalink->create();

		$container['surecart.settings.permalinks.buy']->bootstrap();
		( new PermalinkService() )
			->params( [ 'sc_checkout_product_id' ] )
			->url( untrailingslashit( \SureCart::settings()->permalinks()->getBase( 'buy_page' ) ) . '/([a-z0-9-]+)[/]?$' )
			->query( 'index.php?sc_checkout_product_id=$matches[1]' )
			->create();

		// Upsell.
		$container['surecart.settings.permalinks.upsell']->bootstrap();
		( new PermalinkService() )
			->params( [ 'sc_upsell_id' ] )
			->url( untrailingslashit( \SureCart::settings()->permalinks()->getBase( 'upsell_page' ) ) . '/([a-z0-9-]+)[/]?$' )
			->query( 'index.php?sc_upsell_id=$matches[1]' )
			->create();

		// Checkout change mode redirection.
		( new PermalinkService() )
			->params( [ 'sc_checkout_change_mode', 'sc_checkout_post' ] )
			->url( 'surecart/change-checkout-mode' )
			->query( 'index.php?sc_checkout_change_mode=1&sc_checkout_post=1' )
			->create();

		// Redirect.
		( new PermalinkService() )
			->params( [ 'sc_redirect' ] )
			->url( 'surecart/redirect' )
			->query( 'index.php?sc_redirect=1' )
			->create();
	}
}
