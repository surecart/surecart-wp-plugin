<?php
$label              = $attributes['label'] ?? __( 'Review title', 'surecart' );
$placeholder        = $attributes['placeholder'] ?? __( 'Enter a title for your review', 'surecart' );
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'style' => "text-align: {$attributes['text_align']};",
	]
);

return 'file:./view.php';
