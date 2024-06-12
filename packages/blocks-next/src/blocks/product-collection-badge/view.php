<a <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> href="<?php echo esc_url( $url ); ?>">
	<?php echo wp_kses_post( $collection->name ); ?>
</a>
