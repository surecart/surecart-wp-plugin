<figure <?php echo get_block_wrapper_attributes(); ?>>
	<img
		src="<?php echo esc_url( $featured_image['src'] ); ?>"
		alt="<?php echo esc_attr( $featured_image['alt'] ); ?>"
		srcset="<?php echo esc_attr( $featured_image['srcset'] ?? '' ); ?>"
		width="<?php echo esc_attr( $featured_image['width'] ); ?>"
		height="<?php echo esc_attr( $featured_image['height'] ); ?>"
		title="<?php echo esc_attr( ! empty( $featured_image['title'] ) ? $featured_image['title'] : get_the_title() ); ?>" />
</figure>
