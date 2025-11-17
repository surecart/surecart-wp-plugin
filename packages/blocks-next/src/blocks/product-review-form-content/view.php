<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label" for="sc-product-review-content">
			<?php echo wp_kses_data( $label ); ?>
		</label>
	<?php endif; ?>

	<textarea
		id="sc-product-review-content"
		name="content"
		class="sc-form-control"
		placeholder="<?php echo esc_attr( $placeholder ); ?>"
		rows="<?php echo esc_attr( $rows ); ?>"
		data-wp-on--input="actions.setContent"
		data-wp-bind--value="context.content"
	></textarea>
</div>