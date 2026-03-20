<?php

namespace SureCart\Integrations\Elementor;

use SureCart\Integrations\Elementor\Conditions\Conditions;
use SureCart\Integrations\Elementor\Documents\ProductDocument;
use SureCart\Models\Product;
/**
 * Elementor documents service.
 */
class ElementorDocumentsService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'elementor/documents/register', [ $this, 'registerDocument' ] );
		add_action( 'elementor/theme/register_conditions', [ $this, 'productThemeConditions' ] );
		add_filter( 'elementor/query/get_autocomplete/surecart-product', [ $this, 'getAutoComplete' ], 10, 2 );
		add_filter( 'elementor/query/get_value_titles/surecart-product', [ $this, 'getTitles' ], 10, 2 );
	}

	/**
	 * Add product theme condition.
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Documents_Manager $documents_manager The documents manager.
	 *
	 * @return void
	 */
	public function registerDocument( $documents_manager ) {
		$documents_manager->register_document_type( 'surecart-product', ProductDocument::get_class_full_name() );
	}

	/**
	 * Add product theme condition.
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Conditions_Manager $conditions_manager The conditions manager.
	 *
	 * @return void
	 */
	public function productThemeConditions( $conditions_manager ) {
		$conditions_manager->register_condition_instance( new Conditions() );
	}

	/**
	 * Get autocomplete
	 *
	 * @param array $results The results.
	 * @param array $data Request data.
	 *
	 * @return array
	 */
	public function getAutoComplete( $results, $data ) {
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
	 * Get the titles for the query control
	 * This is important as it shows the previously selected items when the conditions load in.
	 *
	 * @param array $results The results.
	 * @param array $request The request.
	 *
	 * @return array
	 */
	public function getTitles( $results, $request ) {
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
}
