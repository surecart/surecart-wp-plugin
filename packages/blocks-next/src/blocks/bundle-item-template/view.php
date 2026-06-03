<?php
$bundle_item = $block->context['surecart/bundleItem'] ?? null;
if ( empty( $bundle_item ) ) {
	return '';
}

$component       = $bundle_item->component_product ?? null;
$variant_options = $component->variant_options->data ?? array();
$variants        = $component->variants->data ?? array();

// Skip components with no selectable variants — there's nothing for the
// customer to interact with, so the row (name, qty, anything else) would
// just be dead weight on the bundle page.
if ( empty( $variant_options ) ) {
	return '';
}

$variants_payload = array_map(
	function ( $variant ) {
		return array(
			'id'              => $variant->id,
			'option_1'        => $variant->option_1 ?? null,
			'option_2'        => $variant->option_2 ?? null,
			'option_3'        => $variant->option_3 ?? null,
			'available_stock' => $variant->available_stock ?? 0,
		);
	},
	$variants
);

$initial_variant = ( new \SureCart\Models\Blocks\ProductPageBlock() )
	->findInitialBundleComponentVariant( $component );

$initial_option_values = $initial_variant
	? (object) array_filter(
		array(
			'option_1' => $initial_variant->option_1 ?? null,
			'option_2' => $initial_variant->option_2 ?? null,
			'option_3' => $initial_variant->option_3 ?? null,
		),
		fn( $value ) => null !== $value && '' !== $value
	)
	: (object) array();

$render_inner_blocks = static function ( $current_option = null ) use ( $block ) {
	$block_instance              = $block->parsed_block;
	$block_instance['blockName'] = 'core/null';

	$filter = static function ( $context ) use ( $current_option ) {
		if ( null !== $current_option ) {
			$context['surecart/bundleItemOption'] = $current_option;
		}
		return $context;
	};

	add_filter( 'render_block_context', $filter, 1 );
	$content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
	remove_filter( 'render_block_context', $filter, 1 );

	return $content;
};

$component_context = wp_interactivity_data_wp_context(
	array(
		'componentProductId'         => $component->id ?? null,
		'componentProductSlug'       => ! empty( $component->slug ) ? $component->slug : ( $component->id ?? null ),
		'componentVariants'          => $variants_payload,
		'componentHasUnlimitedStock' => ! empty( $component->has_unlimited_stock ),
		'componentOptionValues'      => $initial_option_values,
	)
);
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-item' ) ) ); ?> <?php echo wp_kses_data( $component_context ); ?>>
	<?php foreach ( $variant_options as $key => $option ) : ?>
		<div
			class="sc-bundle-item__row"
			<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'optionNumber' => (int) $key + 1 ) ) ); ?>
		>
			<?php echo $render_inner_blocks( $option ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	<?php endforeach; ?>
</div>
