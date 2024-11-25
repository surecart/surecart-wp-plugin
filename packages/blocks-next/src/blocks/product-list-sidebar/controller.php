<?php
// Set the intitial state used in SSR.
wp_interactivity_state(
	'surecart/product-list',
	[
		'sidebarOpen' => $attributes['sidebarOpen'] ?? false,
	]
);

// return the view.
return 'file:./view.php';
