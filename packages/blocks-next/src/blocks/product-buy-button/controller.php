<?php
$styles = sc_get_block_styles();
$style  = $styles['css'] ?? '';
$class  = $styles['classnames'] ?? '';

$product = sc_get_product();

// handle the width attribute.
if ( ! empty( $attributes['width'] ) ) {
	$class .= ' ' . 'has-custom-width sc-button__width-' . $attributes['width'];
}

wp_interactivity_state(
	'surecart/product-page',
	array(
		'buttonText' => $attributes['text'] ?? ( $attributes['add_to_cart'] ? esc_html__( 'Add to Cart', 'surecart' ) : esc_html__( 'Buy Now', 'surecart' ) ),
	)
);


// return the view.
return 'file:./view.php';
