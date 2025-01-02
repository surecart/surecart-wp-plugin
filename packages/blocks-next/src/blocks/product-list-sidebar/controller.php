<?php
use SureCart\Models\Blocks\ProductListBlock;

$controller = new ProductListBlock( $block );
$query      = $controller->query();

// Set the intitial state used in SSR.
wp_interactivity_state(
	'surecart/sidebar',
	[
		'open' => $attributes['open'] ?? true,
	]
);

// return the view.
return 'file:./view.php';
