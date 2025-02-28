<div
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class'                             => 'sc-input-group sc-input-group-sm sc-quantity-selector',
				'data-wp-class--quantity--disabled' => 'state.isQuantityDisabled',
				'data-wp-bind--hidden'              => '!state.isEditable',
				'hidden'                            => true,
			)
		)
	); ?>
>
	<div
		class="sc-input-group-text sc-quantity-selector__decrease"
		role="button"
		tabindex="0"
		data-wp-on--click="surecart/checkout::actions.onQuantityDecrease"
		data-wp-on--keydown="surecart/checkout::actions.onQuantityDecrease"
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
		data-wp-bind--value="context.line_item.quantity"
		data-wp-on--change="surecart/checkout::actions.onQuantityChange"
		data-wp-bind--min="context.line_item.min"
		data-wp-bind--aria-valuemin="context.line_item.min"
		data-wp-bind--max="context.line_item.max"
		data-wp-bind--aria-valuemax="context.line_item.max"
		data-wp-bind--disabled="surecart/checkout::state.loading"
		step="1"
		autocomplete="off"
		role="spinbutton"
	/>
	<div
		class="sc-input-group-text sc-quantity-selector__increase"
		role="button"
		tabindex="0"
		data-wp-on--click="surecart/checkout::actions.onQuantityIncrease"
		data-wp-on--keydown="surecart/checkout::actions.onQuantityIncrease"
		data-wp-bind--disabled="state.isQuantityIncreaseDisabled"
		data-wp-bind--aria-disabled="state.isQuantityIncreaseDisabled"
		data-wp-class--button--disabled="state.isQuantityIncreaseDisabled"
		aria-label="<?php echo esc_html__( 'Increase quantity by one.', 'surecart' ); ?>"
	>
		<?php echo wp_kses( SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
	</div>
</div>
