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
		global $content_width;
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) ) {
			return '';
		}

		if ( empty( $product->product_medias->data ) ) {
			return '<figure class="wp-block-image sc-block-image">
			<img src="' . esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ) . '" alt="' . esc_attr( $product->name ) . '" />
		</figure>';
		}

		$width = $attributes['width'] ?? $content_width ?? 1170;

		$images     = array_map(
			function( $product_media ) use ( $product, $width ) {
				return [
					'src'    => esc_url( $product_media->getUrl( $width ) ),
					'alt'    => esc_attr( $product_media->media->alt ?? $product_media->media->filename ?? $product->name ?? '' ),
					'title'  => $product_media->media->title ?? '',
					'width'  => $product_media->width,
					'height' => $product_media->height,
				];
			},
			$product->product_medias->data
		);
		$thumbnails = array_map(
			function( $product_media ) use ( $product ) {
				return [
					'src'    => esc_url( $product_media->getUrl( 240 ) ),
					'srcset' => $product_media->getSrcset( [ 90, 120, 240 ] ),
					'sizes'  => '(min-width: 780px) 120px, 13vw', // 13vw = 13% of the viewport width because of 5 thumbnails per page, plus spacing for arrows.
					'alt'    => esc_attr( $product_media->media->alt ?? $product_media->media->filename ?? $product->name ?? '' ),
					'title'  => $product_media->media->title ?? '',
					'width'  => $product_media->width,
					'height' => $product_media->height,
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
			<figure class="wp-block-image sc-block-image">
				<img src="<?php echo esc_url( $product->product_medias->data[0]->getUrl( 800 ) ); ?>" alt="<?php echo esc_attr( $product->featured_media->alt ); ?>" title="<?php echo esc_attr( $product->featured_media->title ); ?>" />
			</figure>
		<?php endif; ?>

		<?php
		return ob_get_clean();
	}
}
