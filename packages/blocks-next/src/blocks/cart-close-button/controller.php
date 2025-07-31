<?php
$icon_name = [
	'none'    => '',
	'arrow'   => is_rtl() ? 'arrow-left' : 'arrow-right',
	'chevron' => is_rtl() ? 'chevron-left' : 'chevron-right',
][ $attributes['icon'] ] ?? $attributes['icon'];

// Return the view.
return 'file:./view.php';
