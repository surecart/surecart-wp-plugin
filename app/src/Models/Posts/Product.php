<?php
namespace SureCart\Models\Posts;

use SureCart\Support\Currency;

/**
 * Handles the product post type.
 */
class Product extends PostModel {
	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_product';

	/**
	 * The model type
	 *
	 * @var string
	 */
	protected $model_type = 'product';

	/**
	 * Product Model
	 *
	 * @var string
	 */
	protected $model = \SureCart\Models\Product::class;

	/**
	 * Additional schema.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function additionalSchema( $model ) {
		return [
			'post_excerpt' => $model->description,
		];
	}

	/**
	 * Get the display price attribute.
	 *
	 * @return string
	 */
	protected function getDisplayPriceAttribute() {
		return Currency::format( $this->prices[0]->amount, $this->prices[0]->currency ?? 'usd' );
	}
}
