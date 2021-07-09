<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Product;

/**
 * Price model
 */
class Price extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'prices';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'price';

	/**
	 * Set the WP Attachment based on the saved id
	 *
	 * @param object $meta Meta value.
	 *
	 * @return void
	 */
	public function filterMetaData( $meta_data ) {
		// get attachment source if we have an id.
		if ( ! empty( $meta_data->wp_attachment_id ) ) {
			$attachment = wp_get_attachment_image_src( $meta_data->wp_attachment_id );

			if ( ! empty( $attachment[0] ) ) {
				$meta_data->wp_attachment_src = $attachment[0];
			}
		}

		return $meta_data;
	}

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->attributes['product'] = new Product( $value );
	}
}
