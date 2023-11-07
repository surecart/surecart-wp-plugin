<?php
/**
 * @package   SureCartCore
 * @author    SureCart <support@surecart.com>
 * @copyright 2017-2019 SureCart
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com/
 */

namespace SureCartCore\View;

trait HasProductMediaTrait {

	/**
	 * Returns the product media image attributes.
	 *
	 * @param Product $product The product.
	 *
	 * @return object
	 */
	public function getFeaturedProductMediaAttributes( $product ) {
		$featured_product_media = $product->featured_product_media;

		return (object) array(
			'alt'   => $featured_product_media->media->alt ?? $product->title ?? $product->name ?? '',
			'title' => $featured_product_media->media->title ?? '',
			'url'   => $featured_product_media->media->url ?? $product->image_url,
		);
	}
}
