<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( empty( $attributes['hidden_label'] ) ) : ?>
		<label for="sc-quantity" class="sc-form-label">
			<?php echo wp_kses_post( $attributes['label'] ?? esc_html_e( 'Quantity', 'surecart' ) ); ?>
		</label>
	<?php endif; ?>

	<div
		class="sc-input-group sc-quantity-selector"
		data-wp-class--quantity--disabled="state.isQuantityDisabled"
		style="<?php echo esc_attr( $styles['css'] ?? '' ); ?>"
	>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>
