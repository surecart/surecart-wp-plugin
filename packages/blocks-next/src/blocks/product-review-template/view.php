<ul <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	foreach ( $reviews ?? [] as $review ) :
		if ( empty( $review->id ) ) {
			continue;
		}

		// Get an instance of the current Post Template block.
		$block_instance = $block->parsed_block;

		// Set the block name to one that does not correspond to an existing registered block.
		// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
		$block_instance['blockName'] = 'core/null';
		$filter_block_context        = static function ( $context ) use ( $review ) {
			$context['review']   = $review;
			$context['reviewId'] = $review->id;
			return $context;
		};

		// Use an early priority to so that other 'render_block_context' filters have access to the values.
		add_filter( 'render_block_context', $filter_block_context, 1 );

		// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
		// `render_callback` and ensure that no wrapper markup is included.
		$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
		$has_button    = ( new \WP_HTML_Tag_Processor( $block_content ?? '' ) )->next_tag( 'button' );
		$has_link      = ( new \WP_HTML_Tag_Processor( $block_content ?? '' ) )->next_tag( 'a' );
		$html_tag      = $has_link || $has_button ? 'form' : 'a';

		remove_filter( 'render_block_context', $filter_block_context, 1 );

		// Wrap the render inner blocks in a `li` element with the appropriate post classes.
		$post_classes = implode( ' ', get_post_class( 'wp-block-post' ) );

		$controller = new \SureCart\Models\Blocks\ProductReviewBlock();
		$state      = $controller->state();
		$context    = $controller->context();

		wp_interactivity_state( 'surecart/product-review', $state );
		?>

		<li class="sc-has-animation-fade-up" data-wp-key="review-template-item-<?php echo (int) $review->id; ?>">
			<form 
				data-wp-interactive='{ "namespace": "surecart/product-review" }'
				data-wp-on--submit="callbacks.handleSubmit"
				data-wp-init="callbacks.init"
				<?php echo wp_kses_data( wp_interactivity_data_wp_context( $context ) ); ?>
			>
				<div class="sc-product-review-link">
					<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			</form>
		</li>
	<?php endforeach; ?>
</ul>
