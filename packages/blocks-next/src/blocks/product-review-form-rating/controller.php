<?php
$size       = $attributes['size'] ?? 20;
$fill_color = $attributes['fill_color'] ?? 'var(--sc-color-primary-500)';
$label      = $attributes['label'] ?? __( 'Your rating', 'surecart' );
$text_align = $attributes['text_align'] ?? 'left';

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'style' => "text-align: {$text_align};",
	]
);
?>
<style>
	:root {
		--sc-product-review-form-rating-star-fill-color: <?php echo esc_attr( $fill_color ); ?>;
	}
</style>
<?php

return 'file:./view.php';
