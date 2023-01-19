<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Product;
use SureCart\Models\Component;

/**
 * The products controller.
 */
class ProductsController extends BaseController {
	/**
	 * Index.
	 *
	 * @param array $attributes Block attributes.
	 */
	public function index( $attributes = [] ) {

		$products = Product::where(
			[
				'archived' => false,
			]
		)
		->with( [ 'prices' ] )->get();

		ob_start(); ?>

		<?php
			echo wp_kses_post(
				Component::tag( 'sc-products' )
				->id('sc-product-list')
				->with(
					[
						'products' => $products,
					]
				)->render()
			);
		?>

		<?php
		return ob_get_clean();
	}
}
