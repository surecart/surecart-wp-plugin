<?php
$page_block = new \SureCart\Models\Blocks\ProductPageBlock();

ob_start();

// Order components by their `position` (the order set in the bundle).
$bundle_items = $product->bundle_items->data ?? array();
usort( $bundle_items, fn( $a, $b ) => ( $a->position ?? 0 ) <=> ( $b->position ?? 0 ) );

foreach ( $bundle_items as $bundle_item ) :
	// Resolve the component (live associations on the buy page, else the
	// component's own synced cache) so variant stock is always current.
	$component = $page_block->resolveBundleComponent( $bundle_item );
	if ( empty( $component->id ) ) {
		continue;
	}

	$variant_options = $component->variant_options->data ?? array();

	// Skip components with no selectable variants — nothing to interact with.
	if ( empty( $variant_options ) ) {
		continue;
	}

	$variants = $component->variants->data ?? array();

	$variants_payload = array_map(
		fn( $variant ) => array(
			'id'                  => $variant->id,
			'option_1'            => $variant->option_1 ?? null,
			'option_2'            => $variant->option_2 ?? null,
			'option_3'            => $variant->option_3 ?? null,
			'available_stock'     => $variant->available_stock ?? 0,
			'has_unlimited_stock' => $variant->has_unlimited_stock,
		),
		$variants
	);

	$initial_variant = $page_block->findInitialBundleComponentVariant( $component );

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

	$component_context = wp_interactivity_data_wp_context(
		array(
			'componentProductId'         => $component->id ?? null,
			'componentProductSlug'       => ! empty( $component->slug ) ? $component->slug : ( $component->id ?? null ),
			'componentVariants'          => $variants_payload,
			'componentHasUnlimitedStock' => ! empty( $component->has_unlimited_stock ),
			'componentOptionValues'      => $initial_option_values,
		)
	);

	$component_name = $component->name ?? '';
	$quantity       = max( 1, (int) ( $bundle_item->quantity ?? 1 ) );
	?>
	<div class="sc-bundle-item" <?php echo wp_kses_data( $component_context ); ?>>
		<?php
		foreach ( $variant_options as $key => $option ) :
			// Label folds the component name (and quantity, once per component)
			// into the option label — the single visual difference for bundles.
			$pill_group_label = trim( $component_name . ' – ' . $option->name );
			if ( 0 === $key && $quantity > 1 ) {
				$pill_group_label .= ' × ' . $quantity;
			}
			?>
			<div
				class="sc-bundle-item__option"
				<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'optionNumber' => (int) $key + 1 ) ) ); ?>
				data-wp-interactive='{ "namespace": "surecart/product-page" }'
			>
				<?php
				if ( 'dropdown' === $option->display_type ) :
					include 'select.php';
				else :
					include 'radio.php';
				endif;
				?>
			</div>
			<?php
		endforeach;
		?>
	</div>
	<?php
endforeach;

$bundle_pickers = trim( ob_get_clean() );

// No variable components — render nothing.
if ( '' === $bundle_pickers ) {
	return;
}
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-picker' ) ) ); ?>>
	<?php echo $bundle_pickers; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
