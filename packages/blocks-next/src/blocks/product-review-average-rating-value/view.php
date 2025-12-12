<span <?php echo wp_kses_post( get_block_wrapper_attributes() ); ?>>
	<?php if ( $link_to_reviews ) : ?>
		<a href="<?php echo esc_url( sc_get_product_review_link( $product ) ); ?>" class="sc-review-link"><?php echo esc_html( $content ); ?></a>
	<?php else : ?>
		<?php echo esc_html( $content ); ?>
	<?php endif; ?>
</span>
