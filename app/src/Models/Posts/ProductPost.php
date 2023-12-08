<?php
namespace SureCart\Models\Posts;

/**
 * Handles the product post type.
 */
class ProductPost extends PostModel {
	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_product';

	/**
	 * Prepare the product for the database.
	 *
	 * @param \SureCart\Models\Model $product Product model.
	 *
	 * @return array
	 */
	protected function getSchemaMap( \SureCart\Models\Model $product ) {
		$map = parent::getSchemaMap( $product );
		return array_merge(
			[
				'post_excerpt' => $product->description,
			],
			$map
		);
	}
}
