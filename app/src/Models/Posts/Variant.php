<?php
namespace SureCart\Models\Posts;

/**
 * Handles the price post type.
 */
class Variant extends PostModel {
	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_variant';

	/**
	 * The model
	 *
	 * @var \SureCart\Models\Model
	 */
	protected $model = \SureCart\Models\Variant::class;

	/**
	 * The parent.
	 *
	 * @var \SureCart\Models\Posts\PostModel
	 */
	protected $parent = Product::class;

	/**
	 * Additional schema.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function additionalSchema( $model ) {
		return [
			'post_title' => implode( ' / ', array_filter( [ $model->option_1, $model->option_2, $model->option_3 ] ) ),
		];
	}
}
