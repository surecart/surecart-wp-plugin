<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label" for="sc-product-review-title">
			<?php echo wp_kses_data( $label ); ?>
			<span class="required-indicator"> *</span>
		</label>
	<?php endif; ?>

	<input
		type="text"
		name="title"
		id="sc-product-review-title"
		class="sc-form-control"
		placeholder="<?php echo esc_attr( $placeholder ); ?>"
		data-wp-on--input="actions.setTitle"
		data-wp-bind--value="context.title"
		required
	/>
</div>