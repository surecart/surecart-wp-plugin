<?php
namespace SureCart\Models\Posts;

/**
 * Handles the product post type.
 */
class PricePost extends PostModel {
	/**
	 * The model type
	 *
	 * @var string
	 */
	protected $model_type = 'price';

	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_price';

	/**
	 * The parent.
	 *
	 * @var string
	 */
	protected $parent = ProductPost::class;
}
