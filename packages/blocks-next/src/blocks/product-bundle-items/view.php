<?php
$product      = sc_get_product();
$bundle_items = $product->initial_price->bundle_items->data ?? [];

if ( empty( $bundle_items ) ) {
	return;
}
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-items' ) ) ); ?>>
	<?php if ( ! empty( $attributes['title'] ) ) : ?>
		<div class="sc-bundle-items__title">
			<?php echo esc_html( $attributes['title'] ); ?>
		</div>
	<?php endif; ?>

	<ul class="sc-bundle-items__list">
		<?php
		foreach ( $bundle_items as $item ) :
			// Get an instance of the current block template.
			$block_instance = $block->parsed_block;

			// Set the block name to one that does not correspond to an existing registered block.
			// This ensures that for the inner instances of the block, we do not render any block supports.
			$block_instance['blockName'] = 'core/null';

			$filter_block_context = static function ( $context ) use ( $item ) {
				$context['surecart/bundleItem'] = $item;
				return $context;
			};

			// Use an early priority so that other 'render_block_context' filters have access to the values.
			add_filter( 'render_block_context', $filter_block_context, 1 );
			// Render the inner blocks with `dynamic` set to `false` to prevent calling
			// `render_callback` and ensure that no wrapper markup is included.
			$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
			remove_filter( 'render_block_context', $filter_block_context, 1 );
			?>

			<li class="sc-bundle-items__item" data-wp-key="bundle-item-<?php echo esc_attr( $item->id ?? '' ); ?>">
				<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
