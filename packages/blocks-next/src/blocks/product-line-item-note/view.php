<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( ! empty( $attributes['label'] ) && $attributes['label'] ) : ?>
		<label class="sc-form-label" for="sc_product_note">
			<?php echo wp_kses_post( $attributes['label'] ); ?>
		</label>
	<?php endif; ?>

	<textarea
		class="sc-form-control"
		name="sc_product_note"
		id="sc_product_note"
		placeholder="<?php echo esc_attr( $attributes['placeholder'] ?? __( 'Add a note (optional)', 'surecart' ) ); ?>"
		rows="<?php echo esc_attr( $attributes['noOfRows'] ?? 2 ); ?>"
		data-wp-bind--value="context.lineItemNote"
		data-wp-on--input="callbacks.setLineItemNote"
	></textarea>
</div>