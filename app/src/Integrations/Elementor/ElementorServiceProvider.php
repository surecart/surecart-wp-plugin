<?php
namespace SureCart\Integrations\Elementor;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Elementor service provider.
 */
class ElementorServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return;
		}

		// Widgets.
		$container['surecart.elementor.widgets'] = function () {
			return new ElementorWidgetsService();
		};

		// Documents.
		$container['surecart.elementor.documents'] = function () {
			return new ElementorDocumentsService();
		};

		// Dynamic tags.
		$container['surecart.elementor.dynamic_tags'] = function () {
			return new ElementorDynamicTagsService();
		};

		// Core block styles.
		$container['elementor.core.block.styles.service'] = function () {
			return new ElementorCoreBlockStylesService();
		};

		// Shortcode service.
		$container['elementor.shortcode.service'] = function () {
			return new ElementorShortcodeService();
		};

		// Block adapter service.
		$container['elementor.block.adapter.service'] = function () {
			return new ElementorBlockAdapterService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return;
		}

		// bootstrap the core block styles service.
		$container['elementor.core.block.styles.service']->bootstrap();
		$container['elementor.shortcode.service']->bootstrap();
		$container['surecart.elementor.widgets']->bootstrap();
		$container['surecart.elementor.dynamic_tags']->bootstrap();

		// The rest are only needed if Elementor Pro is installed.
		if ( ! defined( 'ELEMENTOR_PRO_VERSION' ) ) {
			return;
		}

		$container['elementor.block.adapter.service']->bootstrap();
		$container['surecart.elementor.documents']->bootstrap();
	}
}
