<?php

use SureCart\Models\User;

$icon                   = $attributes['icon'] ?? 'edit-2';
$product_id             = $block->context['postId'] ?? null;
$product                = sc_get_product();
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
	$redirect_url = esc_url_raw( SureCart::pages()->url( 'dashboard' ) . '?product_id=' . $product_id . '&type=review&sc_redirect=1' );
}

return 'file:./view.php';
