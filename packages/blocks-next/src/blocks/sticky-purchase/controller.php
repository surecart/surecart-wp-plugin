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

// We need to enqueue these assets as we do not know if the sticky purchase item will need lightbox or slider functionality.
wp_enqueue_style( 'surecart-lightbox' );
wp_enqueue_style( 'surecart-image-slider' );

return 'file:./view.php';
