<?php
// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );
// TODO: In the future, we can just get the context passed from the wrapper block.
// get product page id.
$product_id = get_query_var( 'sc_product_page_id' ) ?? $attributes['productId'] ?? null;
// if no product id, return.
if ( empty( $product_id ) ) {
	return;
}
// get initial state.
$products = wp_interactivity_state( 'surecart/product' );
// get product from initial state.
$product = $products[ $product_id ]['product'] ?? null;
$styles  = wp_style_engine_get_styles( $attributes['style'] );

// Text colors.
$preset_text_color          = array_key_exists( 'textColor', $attributes ) ? "var:preset|color|{$attributes['textColor']}" : null;
$custom_text_color          = isset( $attributes['style']['color']['text'] ) ? $attributes['style']['color']['text'] : null;
$color_block_styles['text'] = $preset_text_color ? $preset_text_color : $custom_text_color;
$color_styles               = wp_style_engine_get_styles( array( 'color' => $color_block_styles ) );
$styles['css']             .= $color_styles['css'];

$preset_background_color               = array_key_exists( 'backgroundColor', $attributes ) ? "var:preset|color|{$attributes['backgroundColor']}" : null;
$custom_background_color               = isset( $attributes['style']['color']['background'] ) ? $attributes['style']['color']['background'] : null;
$background_block_styles['background'] = $preset_background_color ? $preset_background_color : $custom_background_color;
$background_styles                     = wp_style_engine_get_styles( array( 'color' => $background_block_styles ) );

var_dump( $background_styles['declarations']['background-color'] );

// var_dump( $styles );

// We can return another block template.
// return get_block_template( 'surecart/surecart//cart', 'wp_template_part' )->content;
// Or we can return a view file.
return 'file:./view.php';
