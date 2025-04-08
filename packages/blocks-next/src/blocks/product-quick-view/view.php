<?php
use SureCart\Models\Blocks\ProductPageBlock;
?>

<div 
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='{ "namespace": "surecart/product-quick-view" }'
	data-wp-router-region="<?php echo esc_attr( 'product-quick-view-id-' . $sc_product_quick_view_id ); ?>"
	<?php echo $query->have_posts() ? 'data-wp-init="callbacks.init"' : ''; ?>
>
	<div
		class="sc-product-quick-view-dialog"
		data-wp-on-window--resize="actions.close"
		data-wp-class--active="state.open"
		data-wp-class--show-closing-animation="state.showClosingAnimation"
		data-wp-on--keydown="actions.handleKeyDown"
	>
		<a 
			class="sc-product-quick-view-dialog__close-button"
			data-wp-on--click="actions.navigate"
			data-wp-on--keydown="actions.navigate"
			data-wp-on--mouseenter="actions.prefetch"
			role="button"
			tabindex="0"
			aria-label="<?php esc_attr_e( 'Close quick view', 'surecart' ); ?>"
			href="<?php echo esc_url( $close_url ); ?>"
			<?php
				echo wp_kses_data(
					wp_interactivity_data_wp_context(
						[
							'url' => sanitize_url( $close_url ),
						]
					)
				);
				?>
		>
			<?php echo wp_kses( SureCart::svg()->get( 'x' ), sc_allowed_svg_html() ); ?>
		</a>
		<?php
		while ( $query->have_posts() ) :
			$query->the_post();

			// Get an instance of the current Product Quick view block.
			$block_instance = $block->parsed_block;

			// Set the block name to one that does not correspond to an existing registered block.
			// This ensures that for the inner instances of the Product Quick view block, we do not render any block supports.
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

				// Render the inner blocks of the Product Quick view block with `dynamic` set to `false` to prevent calling
				// `render_callback` and ensure that no wrapper markup is included.
				$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
				remove_filter( 'render_block_context', $filter_block_context, 1 );

				// Wrap the render inner blocks in a `li` element with the appropriate post classes.
				$post_classes = implode( ' ', get_post_class( 'wp-block-post' ) );

				$controller = new ProductPageBlock();
				$state      = $controller->state();
				$context    = $controller->context();

				wp_interactivity_state( 'surecart/product-page', $state );
			?>
				<form 
					<?php
					echo wp_kses_data( wp_interactivity_data_wp_context( $context ) );
					?>
					data-wp-interactive='{ "namespace": "surecart/product-page" }'
					data-wp-on--submit="callbacks.handleSubmit"
					data-wp-init="callbacks.init"
				>
					<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</form>
		<?php endwhile; ?>
		<div class="sc-block-ui" data-wp-bind--hidden="!state.loading" hidden>
			<span class="sc-spinner" data-wp-bind--hidden="!state.loading"></span>
		</div>
	</div>
	<div 
		class="sc-product-quick-view-overlay" 
		data-wp-bind--hidden="!state.open"
		data-wp-class--active="state.open"
		data-wp-on--click="actions.closeOverlay"
		data-wp-class--show-closing-animation="state.showClosingAnimation"
	></div>
</div>
