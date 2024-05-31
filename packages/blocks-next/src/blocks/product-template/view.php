<?php

// we have no posts.
if ( ! $query->have_posts() ) {
	return '';
}

?>
	<ul <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
		<?php
		while ( $query->have_posts() ) :
			$query->the_post();

			// Get an instance of the current Post Template block.
			$block_instance = $block->parsed_block;

			// Set the block name to one that does not correspond to an existing registered block.
			// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
			$block_instance['blockName'] = 'core/null';

			$product_post_id      = get_the_ID();
			$product_post_type    = get_post_type();
			$filter_block_context = static function ( $context ) use ( $product_post_id, $product_post_type ) {
				$context['postType'] = $product_post_type;
				$context['postId']   = $product_post_id;
				return $context;
			};

			// Use an early priority to so that other 'render_block_context' filters have access to the values.
			add_filter( 'render_block_context', $filter_block_context, 1 );
			// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
			// `render_callback` and ensure that no wrapper markup is included.
			$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
			remove_filter( 'render_block_context', $filter_block_context, 1 );

			// Wrap the render inner blocks in a `li` element with the appropriate post classes.
			$post_classes = implode( ' ', get_post_class( 'wp-block-post' ) );
			?>

				<li class="sc-product-item sc-has-animation-fade-up" data-wp-key="post-template-item-<?php echo (int) $product_post_id; ?>">
					<a class="sc-product-item-link"
						href="<?php echo esc_url( get_the_permalink() ); ?>"
						title="<?php echo esc_attr( the_title_attribute( [ 'echo' => false ] ) ); ?>"
					>
						<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</a>
				</li>

		<?php endwhile; ?>
</ul>

<?php wp_reset_postdata(); ?>
