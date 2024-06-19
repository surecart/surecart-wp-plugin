<?php
if ( ! empty( $attributes['highlight_border'] ) ) {

	printf(
		'<style>div.sc-choice--checked{border-color:%s!important;box-shadow: 0 0 0 1px %s;}</style>',
		esc_attr( $attributes['highlight_border'] ?? '' ),
		esc_attr( $attributes['highlight_border'] ?? '' )
	);
}
?>

<div
	<?php
		echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-choice' ) ) );
		echo wp_kses_data( wp_interactivity_data_wp_context( array( 'price' => $price ) ) );
	?>
	data-wp-on--click="callbacks.setPrice"
	data-wp-class--sc-choice--checked="state.isPriceSelected"
	data-wp-bind--aria-checked="state.isPriceSelected"
	tabindex="0"
	role="radio"
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
</div>
