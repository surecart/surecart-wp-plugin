<?php

use SureCart\Models\User;

$icon       = $attributes['icon'] ?? 'edit-2';
$icon_size  = $attributes['icon_size'] ?? 15;
$product_id = $block->context['postId'] ?? get_the_ID();
$product    = sc_get_product();
if ( empty( $product ) ) {
	return '';
}

$show_icon              = in_array( $attributes['button_type'], [ 'icon', 'both' ], true );
$show_text              = in_array( $attributes['button_type'], [ 'text', 'both' ], true );
$icon_position          = $attributes['icon_position'] ?? 'before';
$label                  = $attributes['label'] ?? __( 'Write a Review', 'surecart' );
$gap                    = ! empty( $attributes['style']['spacing']['blockGap'] ) ? \SureCart::block()->styles()->getBlockGapPresetCssVar( $attributes['style']['spacing']['blockGap'] ) : '';
$alignment              = ! empty( $attributes['style']['typography']['textAlign'] ) ? $attributes['style']['typography']['textAlign'] : '';
$width_class            = ! empty( $attributes['width'] ) ? 'has-custom-width wp-block-button__width-' . $attributes['width'] : '';
$show_loading_indicator = $attributes['show_loading_indicator'] ?? false;

$style = ! empty( $gap )
	? esc_attr( safecss_filter_attr( 'gap:' . $gap ) ) . ';'
	: '';

if ( ! empty( $alignment ) ) {
	$style .= 'justify-content:' . esc_attr( $alignment ) . ';';
}

// Hanlde Colors from third party block editors like Bricks.
if ( ! empty( $attributes['style']['color']['text'] ) ) {
	$style .= esc_attr( safecss_filter_attr( 'color:' . $attributes['style']['color']['text'] ) ) . ';';
}
if ( ! empty( $attributes['style']['color']['background'] ) ) {
	$style .= esc_attr( safecss_filter_attr( 'background-color:' . $attributes['style']['color']['background'] ) ) . ';';
}

$styles = sc_get_block_styles();

$wrapper_style = '';

if ( ! empty( $styles['declarations'] ) ) {
	$wrapper_style .= ! empty( $styles['declarations']['margin-top'] ) ? esc_attr( safecss_filter_attr( 'margin-top:' . $styles['declarations']['margin-top'] ) ) . ';' : '';
	$wrapper_style .= ! empty( $styles['declarations']['margin-bottom'] ) ? esc_attr( safecss_filter_attr( 'margin-bottom:' . $styles['declarations']['margin-bottom'] ) ) . ';' : '';
	$wrapper_style .= ! empty( $styles['declarations']['margin-left'] ) ? esc_attr( safecss_filter_attr( 'margin-left:' . $styles['declarations']['margin-left'] ) ) . ';' : '';
	$wrapper_style .= ! empty( $styles['declarations']['margin-right'] ) ? esc_attr( safecss_filter_attr( 'margin-right:' . $styles['declarations']['margin-right'] ) ) . ';' : '';
}

// if no authenticated user found, redirect to Customer dashboard login with the redirect URL set to product page.
$user         = User::current();
$redirect_url = '';
if ( empty( $user->ID ) ) {
	$redirect_url = esc_url_raw(
		add_query_arg(
			[
				'product_id'  => $product->id,
				'context'     => 'customer.order.solicit_reviews',
				'sc_redirect' => '1',
			],
			\SureCart::pages()->url( 'dashboard' )
		)
	);
}

return 'file:./view.php';
