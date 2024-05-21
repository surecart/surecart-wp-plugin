<figure <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo wp_kses_post( $featured_image->getImageMarkup( 'large', [ 'loading' => 'eager' ] ) ); ?>
</figure>
