<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label title-label" for="product-review-title">
			<?php echo wp_kses_data( $label ); ?>
			<span class="required-indicator"> *</span>
		</label>
	<?php endif; ?>

	<input
		type="text"
		id="product-review-title"
		name="title"
		class="sc-form-control title-input"
		placeholder="<?php echo esc_attr( $placeholder ); ?>"
		data-wp-on--input="actions.setTitle"
		data-wp-bind--value="context.title"
		required
	/>
</div>