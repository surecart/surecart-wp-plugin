<?php
$prefix = ! empty( $attributes['prefix'] ) ? $attributes['prefix'] : '';
$suffix = ! empty( $attributes['suffix'] ) ? $attributes['suffix'] : '';
?>

<div <?php echo wp_kses_post( get_block_wrapper_attributes() ); ?>>
	<?php echo esc_html( $prefix . $product->average_stars . $suffix ); ?>
</div>
