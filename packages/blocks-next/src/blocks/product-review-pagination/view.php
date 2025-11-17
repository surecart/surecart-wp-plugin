<?php
$product = sc_get_product();
if ( empty( $product ) || empty( $product->total_reviews ) ) {
	return;
}

$query = sc_product_review_list_query( $block, $product->id );

// there are less than 2 pages.
if ( ( $query->max_num_pages ?? 1 ) < 2 ) {
	return;
}

if ( ! $query->has_pagination ) {
	return;
}

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
