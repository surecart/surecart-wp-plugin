<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class'    => 'sc-cart-order-bump-add-button',
				'role'     => 'button',
				'tabindex' => '0',
			)
		)
	);
	?>
	data-wp-on--click="surecart/order-bumps::actions.addBumpToCart"
	data-wp-on--keydown="surecart/order-bumps::actions.handleAddButtonKeydown"
	data-wp-bind--disabled="state.isBumpInCart"
	data-wp-bind--aria-disabled="state.isBumpInCart"
	data-wp-class--sc-cart-order-bump-add-button--added="state.isBumpInCart"
	data-wp-bind--aria-label="state.addButtonAriaLabel"
	aria-label="<?php esc_attr_e( 'Add to cart', 'surecart' ); ?>"
>
	<span class="sc-cart-order-bump-add-button__icon" aria-hidden="true" data-wp-bind--hidden="state.isBumpInCart">
		<?php echo wp_kses( \SureCart::svg()->get( 'plus', [ 'aria-hidden' => 'true' ] ), sc_allowed_svg_html() ); ?>
	</span>
	<span class="sc-cart-order-bump-add-button__icon" aria-hidden="true" data-wp-bind--hidden="!state.isBumpInCart" hidden>
		<?php echo wp_kses( \SureCart::svg()->get( 'check', [ 'aria-hidden' => 'true' ] ), sc_allowed_svg_html() ); ?>
	</span>
</div>
