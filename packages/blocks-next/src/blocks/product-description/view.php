<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'sc-prose' ] ) ); ?>>
	<?php echo wp_kses_post( $excerpt ); ?>
</div>

