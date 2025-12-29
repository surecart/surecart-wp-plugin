<?php

// Set the initial state used in SSR.
wp_interactivity_state(
	'surecart/sidebar',
	[
		'open' => $attributes['open'] ?? true,
	]
);


// return the view.
return 'file:./view.php';
