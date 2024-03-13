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
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
		<div <?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'optionNumber' => (int) $key + 1 ] ) ); ?>>
			<label class="sc-form-label">
				<?php echo wp_kses_post( $option->name ); ?>
			</label>

			<div class="sc-pill-option__wrapper">
				<?php foreach ( $option->values as $name ) : ?>
					<button
						class="sc-pill-option__button <?php echo esc_attr( $styles['classnames'] ?? '' ); ?>"
						value="<?php echo esc_attr( $name ); ?>"
						<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'optionValue' => esc_attr( $name ) ] ) ); ?>
						data-wp-on--click="callbacks.setOption"
						data-wp-class--sc-pill-option__button--selected="state.isOptionSelected"
						data-wp-class--sc-pill-option__button--disabled="state.isOptionUnavailable"
						data-wp-bind--aria-checked="state.isOptionSelected"
						data-wp-bind--aria-disabled="state.isOptionUnavailable"
						tabindex="0"
						role="radio"
						style="<?php echo esc_attr( $styles['color']['css'] ?? '' ); ?>"
					>
						<?php echo wp_kses_post( $name ); ?>
					</button>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endforeach; ?>
</div>
