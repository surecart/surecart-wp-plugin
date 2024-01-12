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

// Enqueue the view file.
if ( function_exists( 'gutenberg_enqueue_module' ) ) {
	gutenberg_enqueue_module( 'surecart-view' );
}

$product = get_query_var( 'surecart_current_product' );

?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive='{ "namespace": "surecart/product" }'
>

<div class="surecart-block"
	data-wp-interactive='{ "namespace": "surecart/product" }'
	data-wp-context='{ "productId": "<?php echo esc_attr( get_query_var( 'sc_product_page_id' ) ); ?>" }'
	data-wp-init="callbacks.init"
	data-wp-watch--is-open="callbacks.logState">

	<?php if ( ! empty( $product->variant_options->data ) ) : ?>
		<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
			<div data-wp-context='{ "optionNumber": "<?php echo (int) $key + 1; ?>" }'>
				<label>
					<?php echo wp_kses_post( $option->name ); ?>
				</label>

				<br />

				<select data-wp-on--change="surecart/product::callbacks.setOption" data-wp-bind--value="state.getSelectedOption">
				<?php foreach ( $option->values as $name ) : ?>
					<option value="<?php echo esc_attr( $name ); ?>" data-wp-context='{ "optionValue": "<?php echo esc_attr( $name ); ?>" }' data-wp-class--unavailable="surecart/product::state.isOptionUnavailable">
						<?php echo wp_kses_post( $name ); ?>
					</option>
				<?php endforeach; ?>
				</select>
			</div>
		<?php endforeach; ?>
	<?php endif; ?>

	<?php if ( ! empty( $product->variant_options->data ) ) : ?>
		<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
			<div data-wp-context='{ "optionNumber": "<?php echo (int) $key + 1; ?>" }'>
				<label>
					<?php echo wp_kses_post( $option->name ); ?>
				</label>

				<br />

				<?php foreach ( $option->values as $name ) : ?>
					<sc-pill-option
					value="<?php echo esc_attr( $name ); ?>"
					data-wp-context='{ "optionValue": "<?php echo esc_attr( $name ); ?>" }'
					data-wp-bind--is-selected="state.isOptionSelected"
					data-wp-bind--is-unavailable="state.isOptionUnavailable"
					data-wp-on--click="surecart/product::callbacks.setOption">
					<?php echo wp_kses_post( $name ); ?>
				</sc-pill-option>
				<?php endforeach; ?>
			</div>
		<?php endforeach; ?>
	<?php endif; ?>

	<div data-wp-text="surecart/product::state.selectedVariantId"></div>
</div>
</div>
