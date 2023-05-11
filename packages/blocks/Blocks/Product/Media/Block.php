<?php

namespace SureCartBlocks\Blocks\Product\Media;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Title Block
 */
class Block extends BaseBlock {
	/**
	 * Keep track of the instance number of this block.
	 *
	 * @var integer
	 */
	public static $instance;

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) ) {
			return '';
		}
		// TODO: Show placeholder if product is empty.
		if ( empty( $product->product_medias->data ) ) {
			return '';
		}

		$images     = array_map(
			function( $product_media ) use ( $product ) {
				return [
					'src'   => $product_media->getUrl( 450 ),
					'alt'   => $product_media->media->filename ?? $product->name ?? '',
					'width' => 450,
				];
			},
			$product->product_medias->data
		);
		$thumbnails = array_map(
			function( $product_media ) use ( $product ) {
				return [
					'src'    => $product_media->getUrl( 90 ),
					'srcset' => $product_media->getSrcset( [ 90, 120, 240 ] ),
					'sizes'  => '(min-width: 780px) 90px, 13vw', // 13vw = 13% of the viewport width because of 5 thumbnails per page, plus spacing for arrows.
					'alt'    => $product_media->media->filename ?? $product->name ?? '',
					'width'  => 90,
				];
			},
			$product->product_medias->data
		);

		ob_start(); ?>

		<?php if ( count( $product->product_medias->data ) > 1 ) : ?>
			<sc-image-slider
				id="sc-product-media-<?php echo esc_attr( esc_attr( $product->id ) ); ?>"
				images='<?php echo wp_json_encode( $images ); ?>'
				thumbnails='<?php echo wp_json_encode( $thumbnails ); ?>'
				has-thumbnails
				thumbnails-per-page="<?php echo esc_attr( $attributes['thumbnails_per_page'] ?? 5 ); ?>"
				auto-height="<?php echo esc_attr( ! empty( $attributes['auto_height'] ) ? 'true' : 'false' ); ?>"
				style="--sc-product-slider-height: <?php echo ! empty( $attributes['auto_height'] ) ? 'auto' : ( esc_attr( $attributes['height'] ?? 'auto' ) ); ?>
				"></sc-image-slider>
		<?php else : ?>
			<figure class="wp-block-image size-full is-resized has-custom-border">
				<img src="<?php echo esc_url( $product->product_medias->data[0]->getUrl( 800 ) ); ?>" alt="<?php echo esc_attr( $product->name ); ?>" style="border-radius:5px" />
			</figure>
		<?php endif; ?>

		<?php
		return ob_get_clean();
	}
}
