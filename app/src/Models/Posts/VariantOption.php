<?php
namespace SureCart\Models\Posts;

/**
 * Handles the price post type.
 */
class VariantOption extends PostModel {
	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_variant_option';

	/**
	 * The model
	 *
	 * @var \SureCart\Models\Model
	 */
	protected $model = \SureCart\Models\VariantOption::class;

	/**
	 * The parent.
	 *
	 * @var \SureCart\Models\Posts\PostModel
	 */
	protected $parent = Product::class;

	/**
	 * Additional meta input.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function getMetaInput( $model ) {
		$input = parent::getMetaInput( $model );
		if ( $model->values ) {
			$input['values'] = $model->values;
		}
		return $input;
	}
}
