<?php
namespace SureCart\Integrations\Elementor;

use SureCart\Integrations\Elementor\Conditions\Conditions;
use SureCart\Integrations\Elementor\Documents\ProductDocument;
use SureCart\Models\Product;
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

		$container['surecart.elementor.widgets'] = function () {
			return new ElementorWidgetsService();
		};

		$container['surecart.elementor.dynamic_tags'] = function () {
			return new ElementorDynamicTagsService();
		};

		$container['elementor.core.block.styles.service'] = function () {
			return new ElementorCoreBlockStylesService();
		};

		$container['elementor.shortcode.service'] = function () {
			return new ElementorShortcodeService();
		};

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

		if ( defined( 'ELEMENTOR_PRO_VERSION' ) ) {
			$container['elementor.block.adapter.service']->bootstrap();
		}

		// Register product theme condition.
		if ( defined( 'ELEMENTOR_PRO_VERSION' ) ) {
			add_action( 'elementor/documents/register', [ $this, 'register_document' ] );
			add_action( 'elementor/theme/register_conditions', [ $this, 'product_theme_conditions' ] );
			add_filter( 'elementor/query/get_autocomplete/surecart-product', [ $this, 'get_autocomplete' ], 10, 2 );
			add_filter( 'elementor/query/get_value_titles/surecart-product', [ $this, 'get_titles' ], 10, 2 );
		}
	}

	/**
	 * Get the titles for the query control
	 * This is important as it shows the previously selected items when the conditions load in.
	 *
	 * @param array $results The results.
	 * @param array $request The request.
	 *
	 * @return array
	 */
	public function get_titles( $results, $request ) {
		if ( 'surecart-product' !== $request['get_titles']['object'] || empty( $request['id'] ) ) {
			return $results;
		}

		$products = Product::where(
			[
				'ids' => [ $request['id'] ],
			]
		)->get();

		foreach ( $products as $product ) {
			$results[ $product->id ] = $product->name;
		}
		return $results;
	}

	/**
	 * Get autocomplete
	 *
	 * @param array $results The results.
	 * @param array $data Request data.
	 *
	 * @return array
	 */
	public function get_autocomplete( $results, $data ) {
		if ( 'surecart-product' !== $data['autocomplete']['object'] ) {
			return $results;
		}

		$products = Product::where(
			[
				'query'    => $data['q'],
				'archived' => false,
			]
		)->get();

		foreach ( $products as $product ) {
			$results[] = [
				'id'   => $product->id,
				'text' => $product->name,
			];
		}
		return $results;
	}

	/**
	 * Add product theme condition.
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Documents_Manager $documents_manager The documents manager.
	 *
	 * @return void
	 */
	public function register_document( $documents_manager ) {
		$documents_manager->register_document_type( 'surecart-product', ProductDocument::get_class_full_name() );
	}

	/**
	 * Add product theme condition.
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Conditions_Manager $conditions_manager The conditions manager.
	 *
	 * @return void
	 */
	public function product_theme_conditions( $conditions_manager ) {
		$conditions_manager->register_condition_instance( new Conditions() );
	}
}
