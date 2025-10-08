<div 
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive="surecart/product-review-form"
	data-wp-context='{ "title": "" }'
>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label title-label" for="review-title">
			<?php echo wp_kses_data( $label ); ?>
			<?php if ( $required ) : ?>
				<span class="required-indicator"> *</span>
			<?php endif; ?>
		</label>
	<?php endif; ?>

	<input
		type="text"
		id="review-title"
		name="title"
		class="sc-form-control title-input"
		placeholder="<?php echo esc_attr( $placeholder ); ?>"
		data-wp-on--input="actions.setTitle"
		data-wp-bind--value="context.title"
		<?php echo $required ? 'required' : ''; ?>
	/>
</div>