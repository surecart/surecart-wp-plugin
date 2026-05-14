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

$styles = sc_get_block_styles();

// Gap and alignment are layout concerns, not block support styles.
$button_style = ! empty( $gap )
	? esc_attr( safecss_filter_attr( 'gap:' . $gap ) ) . ';'
	: '';

if ( ! empty( $alignment ) ) {
	$button_style .= esc_attr( safecss_filter_attr( 'justify-content:' . $alignment ) ) . ';';
}

// Append block support styles (border, padding, colors).
// sc_get_block_styles() already handles colors from $attributes['style']['color'] and presets.
if ( ! empty( $styles['css'] ) ) {
	$button_style .= $styles['css'];
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
