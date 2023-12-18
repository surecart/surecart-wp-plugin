<?php
namespace SureCart\Models\Posts;

/**
 * Handles the price post type.
 */
class Price extends PostModel {
	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_price';

	/**
	 * The model
	 *
	 * @var \SureCart\Models\Model
	 */
	protected $model = \SureCart\Models\Price::class;

	/**
	 * The parent.
	 *
	 * @var \SureCart\Models\Posts\PostModel
	 */
	protected $parent = Product::class;
}
