<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> data-wp-class--quantity--disabled="state.isQuantityDisabled">
	<label class="sc-form-label <?php echo esc_attr( ! empty( $attributes['hidden_label'] ) ? 'sc-screen-reader-text' : '' ); ?>">
		<?php echo wp_kses_post( $attributes['label'] ); ?>
	</label>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
