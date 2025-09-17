<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<label class="sc-form-label <?php echo esc_attr( ! empty( $attributes['hidden_label'] ) ? 'sc-screen-reader-text' : '' ); ?>">
		<?php echo wp_kses_post( $attributes['label'] ); ?>
	</label>

	<div
		data-wp-class--quantity--disabled="state.isQuantityDisabled"
		style="<?php echo esc_attr( $styles['border']['css'] ?? '' ); ?>"
	>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>
