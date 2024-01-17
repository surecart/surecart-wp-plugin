<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );
// get product page id.
$product_id = get_query_var( 'sc_product_page_id' ) ?? $attributes['productId'] ?? null;
// get initial state.
$products = wp_initial_state( 'surecart/product' );
// get product from initial state.
$product = $products[ $product_id ]['product'] ?? null;
?>

<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='{ "namespace": "surecart/product" }'
	data-wp-context='{ "productId": "<?php echo esc_attr( $product_id ); ?>" }'
	data-wp-watch--variant-values="callbacks.updateVariantAndValues"
>
	<?php if ( ! empty( $product->variant_options->data ) ) : ?>
		<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
			<div data-wp-context='{ "optionNumber": "<?php echo (int) $key + 1; ?>" }'>
				<label class="sc-form-label">
					<?php echo wp_kses_post( $option->name ); ?>
				</label>

				<div class="sc-pill-option__wrapper">
					<?php foreach ( $option->values as $name ) : ?>
						<button
							class="sc-pill-option__button"
							value="<?php echo esc_attr( $name ); ?>"
							data-wp-context='{ "optionValue": "<?php echo esc_attr( $name ); ?>" }'
							data-wp-on--click="callbacks.setOption"
							data-wp-class--sc-pill-option__button--selected="state.isOptionSelected"
							data-wp-class--sc-pill-option__button--disabled="state.isOptionUnavailable"
							data-wp-bind--aria-checked="state.isOptionSelected"
							data-wp-bind--aria-disabled="state.isOptionUnavailable"
							tabindex="0"
							role="radio"
						>
							<?php echo wp_kses_post( $name ); ?>
						</button>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endforeach; ?>
	<?php endif; ?>

	<div data-wp-text="surecart/product::state.selectedVariantId"></div>
</div>
