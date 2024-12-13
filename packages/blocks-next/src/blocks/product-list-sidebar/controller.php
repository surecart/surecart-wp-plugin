<?php
// Set the intitial state used in SSR.
wp_interactivity_state(
	'surecart/sidebar',
	[
		'open' => $attributes['sidebarOpen'] ?? true,
	]
);

// return the view.
return 'file:./view.php';
