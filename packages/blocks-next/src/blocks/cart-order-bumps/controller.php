<?php
/**
 * Initialize order bumps state.
 */
wp_interactivity_state(
	'surecart/order-bumps',
	array(
		'currentPage' => 1,
		'perPage'     => $attributes['perPage'] ?? 3,
	)
);

return 'file:./view.php';
