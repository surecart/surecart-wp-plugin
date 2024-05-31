<?php $product = sc_get_product(); ?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	if ( $attributes['show_range'] ) :
		echo wp_kses_post( $product->range_display_amount );
	else :
		echo wp_kses_post( $product->display_amount );
	endif;
	?>
</div>
