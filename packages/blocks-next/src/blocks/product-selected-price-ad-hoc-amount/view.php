<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $class (string): The block class name.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<div
	<?php echo get_block_wrapper_attributes( array( 'style' => 'width:' . esc_attr( $attributes['width'] ) . ';' ) ); ?>
	data-wp-bind--hidden="!state.selectedPrice.ad_hoc"
	hidden
>
	<label for="amount" class="sc-form-label <?php echo esc_attr( $class ); ?>">
		<?php echo wp_kses_post( $attributes['label'] ?? esc_html_e( 'Amount', 'surecart' ) ); ?>
	</label>
	<div class="sc-input-group">
		<span class="sc-input-group-text" id="basic-addon1" data-wp-text="state.selectedPrice.currency_symbol"></span>
		<input
			class="sc-form-control"
			data-wp-bind--value="state.adHocAmount"
			data-wp-on--input="callbacks.setAdHocAmount"
			data-wp-on--change="callbacks.formatAdHocAmount"
			type="number"
			step="0.01"
			data-wp-bind--min="state.formattedSelectedPrice.ad_hoc_min_amount"
			data-wp-bind--max="state.formattedSelectedPrice.ad_hoc_max_amount"
			required
			onwheel="this.blur()"
		/>
	</div>
</div>
