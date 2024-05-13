<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> >
	<label>
		<?php echo wp_kses_post( $attributes['label'] ?? esc_html_e( 'Quantity', 'surecart' ) ); ?>
	</label>
	<div class="sc-quantity-selector" style="<?php echo esc_attr( $styles['border']['css'] ?? '' ); ?>">
		<div role="button" class="sc-quantity-selector__decrease" data-wp-on--click="callbacks.onQuantityDecrease">
			<?php echo wp_kses( SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() ); ?>
		</div>
		<input
			class="sc-quantity-selector__control"
			data-wp-bind--value="state.quantity"
			data-wp-on--change="callbacks.onQuantityChange"
			data-wp-bind--min="state.minQuantity"
			data-wp-bind--aria-valuemin="state.minQuantity"
			data-wp-bind--max="state.maxQuantity"
			data-wp-bind--aria-valuemax="state.maxQuantity"
			data-wp-bind--disabled="state.isQuantityDisabled"
			data-wp-bind--aria-disabled="state.isQuantityDisabled"
			type="number"
			step="1"
			autocomplete="off"
			role="spinbutton"
		/>
		<div role="button" class="sc-quantity-selector__increase" data-wp-on--click="callbacks.onQuantityIncrease">
			<?php echo wp_kses( SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
		</div>
	</div>
</div>
