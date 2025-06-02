<?php
// get product.

use SureCart\Models\Blocks\ProductPageBlock;

$product = sc_get_product();

$controller = new ProductPageBlock();
$state      = $controller->state();
$context    = $controller->context();

// Load the sticky purchase button template.
$sticky_purchase_button_content = '';
if ( ! empty( $attributes['show_sticky_purchase_button'] ) && $attributes['show_sticky_purchase_button'] ) {
	// Try to load the template part directly from the file.
	$template_path = SURECART_PLUGIN_DIR . '/templates/parts/sticky-purchase-button.html';
	if ( file_exists( $template_path ) ) {
		// Get the template content.
		$template_content = file_get_contents( $template_path );

		// Process the template content with the current product context.
		$sticky_purchase_button_content = do_blocks( $template_content );
	}
}

wp_interactivity_state( 'surecart/product-page', $state );

return 'file:./view.php';
