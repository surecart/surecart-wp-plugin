<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'label' => $attributes['label'] ?? '',
				'rows'  => 1,
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
		data-wp-bind--rows="context.rows"
		data-wp-bind--value="context.lineItemNote"
		data-wp-on--input="callbacks.setLineItemNote"
		data-wp-on--click="callbacks.expandLineItemNote"
		data-wp-on--focus="callbacks.expandLineItemNote"
		maxlength="485"
	></textarea> 

	<?php if ( ! empty( $attributes['help_text'] ) ) : ?>
		<div class="sc-help-text">
			<?php echo wp_kses_post( $attributes['help_text'] ); ?>
		</div>
	<?php endif; ?>
</div>