<?php
$product = sc_get_product();
if ( ! $product || empty( $product->total_reviews ) ) {
	return;
}
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo $content; ?>
</div>