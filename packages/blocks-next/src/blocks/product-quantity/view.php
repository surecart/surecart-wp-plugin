<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<label for="quantity" class="sc-form-label">
		<?php echo wp_kses_post( $attributes['label'] ?? esc_html_e( 'Quantity', 'surecart' ) ); ?>
	</label>
	<div
		class="sc-input-group sc-quantity-selector"
		data-wp-class--quantity--disabled="state.isQuantityDisabled"
	>
		<div
			class="sc-input-group-text sc-quantity-selector__decrease"
			role="button"
			tabindex="0"
			data-wp-on--click="callbacks.onQuantityDecrease"
			data-wp-bind--disabled="state.isQuantityDecreaseDisabled"
			data-wp-bind--aria-disabled="state.isQuantityDecreaseDisabled"
			data-wp-class--button--disabled="state.isQuantityDecreaseDisabled"
			aria-label="<?php echo esc_html__( 'Decrease quantity by one.', 'surecart' ); ?>"
		>
			<?php echo wp_kses( SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() ); ?>
		</div>
		<input
			type="number"
			class="sc-form-control sc-quantity-selector__control"
			data-wp-bind--value="state.quantity"
			data-wp-on--change="callbacks.onQuantityChange"
			data-wp-bind--min="state.minQuantity"
			data-wp-bind--aria-valuemin="state.minQuantity"
			data-wp-bind--max="state.maxQuantity"
			data-wp-bind--aria-valuemax="state.maxQuantity"
			data-wp-bind--disabled="state.isQuantityDisabled"
			data-wp-bind--aria-disabled="state.isQuantityDisabled"
			step="1"
			autocomplete="off"
			role="spinbutton"
		/>
		<div
			class="sc-input-group-text sc-quantity-selector__increase"
			role="button"
			tabindex="0"
			data-wp-on--click="callbacks.onQuantityIncrease"
			data-wp-bind--disabled="state.isQuantityIncreaseDisabled"
			data-wp-bind--aria-disabled="state.isQuantityIncreaseDisabled"
			data-wp-class--button--disabled="state.isQuantityIncreaseDisabled"
			aria-label="<?php echo esc_html__( 'Increase quantity by one.', 'surecart' ); ?>"
		>
			<?php echo wp_kses( SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
		</div>
	</div>
</div>
