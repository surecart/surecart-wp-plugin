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
		// Check if Elementor is installed.
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return;
		}

		// Templates service. This is used even if Elementor is not installed.
		$container['elementor.templates.service'] = fn() => new ElementorTemplatesService();

		// Widgets.
		$container['surecart.elementor.widgets'] = fn() => new ElementorWidgetsService();

		// Widgets.
		$container['surecart.elementor.editor'] = fn() => new ElementorEditorService();

		// Documents.
		$container['surecart.elementor.documents'] = fn() => new ElementorDocumentsService();

		// Dynamic tags.
		$container['surecart.elementor.dynamic_tags'] = fn() => new ElementorDynamicTagsService();

		// Core block styles.
		$container['elementor.core.block.styles.service'] = fn() => new ElementorCoreBlockStylesService();

		// Shortcode service.
		$container['elementor.shortcode.service'] = fn() => new ElementorShortcodeService();

		// Block adapter service.
		$container['elementor.block.adapter.service'] = fn() => new ElementorBlockAdapterService();

		// FSE script loader service for Elementor.
		$container['elementor.fse.script.loader'] = fn() => new ElementorFseScriptLoaderService();
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
