<?php
$style = ! empty( $attributes['width'] ) ? 'min-width: ' . $attributes['width'] . ';' : '';
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'style' => $style ] ) ); ?>
	data-wp-class--quantity--disabled="state.isQuantityDisabled">
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
