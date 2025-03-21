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
					'label'       => 'SureCart Product Permalinks',
					/* translators: %s: Home URL */
					'description' => sprintf( 'If you like, you may enter custom structures for your product page URLs here. For example, using <code>products</code> would make your product buy links like <code>%sproducts/sample-product/</code>.', esc_url( home_url( '/' ) ) ),
					'options'     => [
						[
							'value' => 'products',
							'label' => 'Default',
						],
						[
							'value' => 'shop',
							'label' => 'Shop',
						],
						[
							'value'   => 'shop/%sc_collection%',
							'display' => 'shop/product-collection/',
							'label'   => 'Shop base with collection',
						],
					],
				]
			);
		};

		$container['surecart.settings.permalinks.buy'] = function () {
			return new PermalinkSettingService(
				[
					'slug'        => 'buy',
					'label'       => 'SureCart Instant Checkout Permalinks',
					/* translators: %s: Home URL */
					'description' => sprintf( 'If you like, you may enter custom structures for your instant checkout URLs here. For example, using <code>buy</code> would make your product buy links like <code>%sbuy/sample-product/</code>.', esc_url( home_url( '/' ) ) ),
					'options'     => [
						[
							'value' => 'buy',
							'label' => 'Default',
						],
						[
							'value' => 'purchase',
							'label' => 'Purchase',
						],
					],
				]
			);
		};

		$container['surecart.settings.permalinks.collection'] = function () {
			return new PermalinkSettingService(
				[
					'slug'                => 'collection',
					'label'               => 'SureCart Product Collection Permalinks',
					/* translators: %s: Home URL */
					'description'         => sprintf( 'If you like, you may enter custom structures for your product page URLs here. For example, using <code>collections</code> would make your product collection links like <code>%scollections/sample-collection/</code>.', esc_url( home_url( '/' ) ) ),
					'options'             => [
						[
							'value' => 'collections',
							'label' => 'Default',
						],
						[
							'value' => 'product-collections',
							'label' => 'Product Collections',
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
					'label'       => 'SureCart Upsell Permalinks',
					/* translators: %s: Home URL */
					'description' => sprintf( 'If you like, you may enter custom structures for your upsell URLs here. For example, using <code>offers</code> would make your upsell\'s links like <code>%soffers/upsell-id/</code>.', esc_url( home_url( '/' ) ) ),
					'options'     => [
						[
							'value' => 'offer',
							'label' => 'Default',
						],
						[
							'value' => 'special-offer',
							'label' => 'Special Offer',
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
		if ( preg_match( '`/(.+)(/%sc_collection%)`', $product_base, $matches ) ) {
			$permalink->removeRules(
				'`^' . preg_quote( $matches[1], '`' ) . '/([^/]+)$`',
				'/^(index\.php\?sc_collection)(?!(.*product))/'
			);
		}

		// Get clean product base without collection.
		$clean_product_base = preg_replace( '/%sc_collection%\/?/', '', $product_base );

		// Rule for default product base.
		$permalink->addRule(
			'^' . preg_quote( trim( $clean_product_base, '/' ), '^' ) . '/([^/]+)/?$',
			'index.php?sc_product=$matches[1]',
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
