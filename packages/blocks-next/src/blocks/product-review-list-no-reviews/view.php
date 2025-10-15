<?php

use SureCart\Models\Blocks\ProductReviewListBlock;

$product = sc_get_product();
if ( empty( $product ) ) {
	return '';
}

$reviews = new ProductReviewListBlock( $block, $product->id );

if ( ! empty( $reviews->data ) ) {
	return '';
}

if ( empty( trim( $content ) ) ) {
	return '';
}

$classes = ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) ? 'has-link-color' : '';
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => $classes ) ) ); ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
