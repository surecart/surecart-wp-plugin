<?php
// Set the intitial state used in SSR.
wp_interactivity_state(
	'surecart/product-list',
	[
		'loading'   => false,
		'searching' => false,
	]
);

// TODO: change to snake_case.
$block_id = (int) $block->context['surecart/product-list/block_id'] ?? '';

// return the view.
return 'file:./view.php';
