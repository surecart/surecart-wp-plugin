<?php

namespace SureCart\WordPress\Taxonomies;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register our form post type
 */
class TaxonomyServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['surecart.taxonommies.collection'] = function ( $container ) {
			return new CollectionTaxonomyService();
		};

		$container['surecart.taxonommies.store'] = function ( $container ) {
			return new StoreTaxonomyService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.taxonommies.collection']->bootstrap();
		$container['surecart.taxonommies.store']->bootstrap();
	}
}
