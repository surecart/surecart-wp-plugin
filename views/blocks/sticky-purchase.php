<?php

// If the sticky purchase button is empty or set to never, don't render it.
if ( empty( $settings['show_sticky_purchase_button'] ) || 'never' === $settings['show_sticky_purchase_button'] ) {
	return;
}

// Get the sticky purchase template.
$template = get_block_template( 'surecart/surecart//sticky-purchase', 'wp_template_part' );

// If the template is empty, don't render it.
if ( empty( $template ) || empty( $template->content ) ) {
	return;
}

// Add the show sticky purchase button context to the template.
$filter_block_context = static function ( $context ) use ( $settings ) {
	$context['showStickyPurchaseButton'] = $settings['show_sticky_purchase_button'];
	return $context;
};

// Add the filter to the template.
add_filter( 'render_block_context', $filter_block_context, 1 );

// Render the template.
echo do_blocks( $template->content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

// Remove the filter from the template.
remove_filter( 'render_block_context', $filter_block_context, 1 );
