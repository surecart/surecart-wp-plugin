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
		ob_start(); ?>

		<?php if ( count( $product->product_medias->data ) > 1 ) : ?>
			<sc-image-slider id="sc-product-media-<?php echo esc_attr( esc_attr( $product->id ) ); ?>" style="--sc-product-slider-height: auto;"></sc-image-slider>
			<?php
			\SureCart::assets()->addComponentData(
				'sc-image-slider',
				'#sc-product-media-' . $product->id,
				[
					'thumbnails' => true,
					'images'     => array_map(
						function( $product_media ) use ( $product ) {
							if ( empty( $product_media->media->url ) ) {
								if ( ! empty( $product_media->url ) ) {
									return [
										'src' => $product_media->url ?? '',
										'alt' => '',
									];
								}
								return;
							}
							return [
								'src' => $product_media->media->url ?? '',
								'alt' => $product_media->media->filename ?? $product->name ?? '',
							];
						},
						$product->product_medias->data
					),
				]
			);
			?>
		<?php else : ?>
			<!-- wp:image {"sizeSlug":"full","linkDestination":"none","style":{"border":{"radius":"5px"}}} -->
				<figure class="wp-block-image size-full is-resized has-custom-border">
					<img src="<?php echo esc_url( $product->image->url ); ?>" alt="<?php echo esc_attr( $product->name ); ?>" style="border-radius:5px" />
				</figure>
			<!-- /wp:image -->
		<?php endif; ?>

		<?php
		return ob_get_clean();
	}
}
