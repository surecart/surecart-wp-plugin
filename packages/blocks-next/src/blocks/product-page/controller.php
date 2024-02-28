<?php
// get product.
$product = ! empty( $attributes['product_id'] )
	? \SureCart\Models\Product::with( array( 'image', 'prices', 'product_medias', 'product_media.media', 'variants', 'variant_options' ) )->find( $attributes['productId'] )
	: get_query_var( 'surecart_current_product' );

// if no product id, return.
if ( empty( $product ) ) {
	return;
}

$active_prices  = $product->activePrices();
$selected_price = $active_prices[0] ?? '';

$product_state[ $product->id ] = array(
	'formId'          => \SureCart::forms()->getDefaultId(),
	'mode'            => \SureCart\Models\Form::getMode( \SureCart::forms()->getDefaultId() ),
	'product'         => $product,
	'prices'          => $active_prices,
	'selectedPrice'   => $selected_price,
	'isOnSale'        => $selected_price ? $selected_price->is_on_sale : false,
	'checkoutUrl'     => \SureCart::pages()->url( 'checkout' ),
	'variant_options' => $product->variant_options->data ?? array(),
	'variants'        => $product->variants->data ?? array(),
	'selectedVariant' => $product->first_variant_with_stock ?? null,
	'isProductPage'   => ! empty( get_query_var( 'surecart_current_product' ) ),
);

$state = wp_interactivity_state( 'surecart/product' );
wp_interactivity_state( 'surecart/product', array_merge( $state, $product_state ) );

return 'file:./view.php';
