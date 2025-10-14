<?php

use SureCart\Models\Blocks\ProductReviewListBlock;

$reviews = new ProductReviewListBlock( $block, $product->id );

if ( ! empty( $reviews ) ) {
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
