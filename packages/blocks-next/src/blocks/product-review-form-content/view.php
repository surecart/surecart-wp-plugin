<div 
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive="surecart/product-review-form"
	data-wp-context='{ "content": "" }'
>
	<div class="content-textarea-container">
		<?php if ( ! empty( $label ) ) : ?>
			<label class="sc-form-label" for="review-content">
				<?php echo esc_html( $label ); ?>
				<?php if ( $required ) : ?>
					<span class="required-indicator"> *</span>
				<?php endif; ?>
			</label>
		<?php endif; ?>
		<textarea
			id="review-content"
			name="content"
			class="sc-form-control content-textarea"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
			rows="<?php echo esc_attr( $rows ); ?>"
			data-wp-on--input="actions.setContent"
			data-wp-bind--value="context.content"
			<?php echo $required ? 'required' : ''; ?>
		></textarea>
	</div>
</div>