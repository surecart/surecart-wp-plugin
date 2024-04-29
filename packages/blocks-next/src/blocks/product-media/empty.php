<figure <?php echo get_block_wrapper_attributes(); ?>>
	<img
		src="<?php echo esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ); ?>"
		alt="<?php echo esc_attr( get_the_title() ); ?>" />
</figure>
