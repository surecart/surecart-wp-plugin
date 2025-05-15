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

		// Widgets.
		$container['surecart.elementor.editor'] = function () {
			return new ElementorEditorService();
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

		// FSE script loader service for Elementor.
		$container['elementor.fse.script.loader'] = function () {
			return new ElementorFseScriptLoaderService();
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
		$container['surecart.elementor.editor']->bootstrap();
		$container['surecart.elementor.dynamic_tags']->bootstrap();
		$container['elementor.fse.script.loader']->bootstrap();

		// The rest are only needed if Elementor Pro is installed.
		if ( ! defined( 'ELEMENTOR_PRO_VERSION' ) ) {
			return;
		}

		$container['elementor.block.adapter.service']->bootstrap();
		$container['surecart.elementor.documents']->bootstrap();
	}
}
