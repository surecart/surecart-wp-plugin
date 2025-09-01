<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'label' => $attributes['label'] ?? '',
			]
		)
	);
	?>
	>
	<?php if ( ! empty( $attributes['label'] ) ) : ?>
		<label class="sc-form-label" for="sc_product_note">
			<?php echo wp_kses_post( $attributes['label'] ); ?>
		</label>
	<?php endif; ?>

	<textarea
		class="sc-form-control"
		name="sc_product_note"
		id="sc_product_note"
		placeholder="<?php echo esc_attr( $attributes['placeholder'] ?? __( 'Add a note (optional)', 'surecart' ) ); ?>"
		rows="<?php echo esc_attr( $attributes['no_of_rows'] ?? 2 ); ?>"
		data-wp-bind--value="context.lineItemNote"
		data-wp-on--input="callbacks.setLineItemNote"
		maxlength="500"
	></textarea> 

	<?php if ( ! empty( $attributes['help_text'] ) ) : ?>
		<div class="sc-help-text">
			<?php echo wp_kses_post( $attributes['help_text'] ); ?>
		</div>
	<?php endif; ?>
</div>