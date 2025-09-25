<?php

namespace SureCart\Models;

use SureCart\Models\Concerns\ImportModel;
use SureCart\Models\Product;

/**
 * Product import model
 */
class ProductImport extends ImportModel {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'imports/products';

	/**
	 * Set the referrals attribute
	 *
	 * @param object $value Array of referral objects.
	 *
	 * @return void
	 */
	public function setDataAttribute( $value ) {
		$models = [];
		if ( ! empty( $value ) && is_array( $value ) ) {
			foreach ( $value as $attributes ) {
				$models[] = is_a( $attributes, Product::class ) ? $attributes : new Product( $attributes );
			}
			$value = $models;
		}
		$this->attributes['data'] = $value;
	}

	/**
	 * Create a new model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|false
	 */
	protected function create( $attributes = array() ) {
		// Ensure data is set as Product models first.
		$this->fill( $attributes );

		// for each item in the data, add a pattern to the database.
		foreach ( $this->attributes['data'] ?? [] as $product ) {
			if ( empty( $product->content ) ) {
				continue;
			}

			$pattern_id = $this->addPattern( $product );
			if ( ! is_wp_error( $pattern_id ) && ! empty( $pattern_id ) ) {
				$product->metadata->sc_initial_sync_pattern = $pattern_id;
			}

			// Remove content from the data object.
			unset( $product->content );
		}

		// Pass the modified attributes with processed data to parent.
		return parent::create();
	}

	/**
	 * Add a pattern to the database.
	 *
	 * @param \SureCart\Models\Product $product The product.
	 *
	 * @return int|\WP_Error
	 */
	protected function addPattern( $product ) {
		$pattern_id = wp_insert_post(
			array(
				// translators: %s is the product name.
				'post_title'     => sprintf( __( '%s Content', 'surecart' ), $product->name ),
				'post_content'   => $product->content,
				'post_status'    => 'publish',
				'comment_status' => 'closed',
				'ping_status'    => 'closed',
				'post_type'      => 'wp_block',
				'meta_input'     => [
					'wp_pattern_sync_status' => 'unsynced',
				],
			)
		);

		if ( is_wp_error( $pattern_id ) ) {
			error_log( 'Error adding pattern for sync ' . $product->name . ': ' . $pattern_id->get_error_message() );
		}

		return $pattern_id;
	}
}
