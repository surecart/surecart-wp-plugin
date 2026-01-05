<?php
$label       = $attributes['label'] ?? __( 'Title', 'surecart' );
$placeholder = $attributes['placeholder'] ?? __( 'Enter a title for your review', 'surecart' );
$text_align  = $attributes['text_align'] ?? 'left';

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'style' => "text-align: {$text_align};",
	]
);

return 'file:./view.php';
