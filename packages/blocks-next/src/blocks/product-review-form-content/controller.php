<?php
$label              = $attributes['label'] ?? __( 'Review Content', 'surecart' );
$placeholder        = $attributes['placeholder'] ?? '';
$required           = $attributes['required'] ?? true;
$rows               = $attributes['rows'] ?? 4;
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'style' => "text-align: {$attributes['text_align']};",
	]
);

return 'file:./view.php';
