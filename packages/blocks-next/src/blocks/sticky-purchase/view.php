<?php

use SureCart\Models\Blocks\ProductPageBlock;

// Get block attributes.
$width           = isset( $attributes['width'] ) ? esc_attr( $attributes['width'] ) : '600px';
$bottom_position = isset( $attributes['bottomPosition'] ) ? esc_attr( $attributes['bottomPosition'] ) : '0';

// Create inline style for CSS variables.
$style = sprintf(
	'--sc-sticky-purchase-bottom: %s; --sc-sticky-purchase-width: %s;',
	$bottom_position,
	$width
);
?>

<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-wp-interactive'       => '{ "namespace": "surecart/sticky-purchase" }',
				'data-wp-init'              => 'callbacks.init',
				'data-wp-context'           => '{}',
				'data-wp-on-window--scroll' => 'actions.handleScroll',
				'data-wp-on-window--resize' => 'actions.handleResize',
				'data-wp-on--keydown'       => 'callbacks.handleKeyDown',
				'style'                     => $style,
			]
		)
	);
	?>
	>
	<?php
	while ( $query->have_posts() ) :
		$query->the_post();
		?>
		<div class="sc-sticky-purchase-container" tabindex="-1">
			<div class="sc-sticky-purchase">
				<?php

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
			</div>
		</div>
	<?php endwhile; ?>
</div>