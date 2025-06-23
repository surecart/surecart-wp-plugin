<?php
$product = sc_get_product();
$query   = new WP_Query(
	[
		'post__in'  => [ get_the_ID() ],
		'post_type' => 'sc_product',
	]
);

// Set the interactivity state for the sticky purchase block.
wp_interactivity_state(
	'surecart/sticky-purchase',
	array()
);

return 'file:./view.php';
