<span <?php echo wp_kses_post( get_block_wrapper_attributes() ); ?> aria-label="<?php echo esc_attr( sprintf( __( 'Average rating: %s out of 5', 'surecart' ), $content ) ); ?>">
	<?php if ( $link_to_reviews ) : ?>
		<a href="<?php echo esc_url( sc_get_product_review_link() ); ?>" class="sc-review-link" aria-label="<?php echo esc_attr( sprintf( __( 'Average rating: %s out of 5. View all reviews', 'surecart' ), $content ) ); ?>"><?php echo esc_html( $content ); ?></a>
	<?php else : ?>
		<span aria-hidden="true"><?php echo esc_html( $content ); ?></span>
	<?php endif; ?>
</span>
