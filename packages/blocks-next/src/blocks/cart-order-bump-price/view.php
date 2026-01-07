<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-cart-order-bump-price' ) ) ); ?>>
	<?php if ( ! empty( $attributes['showOriginalPrice'] ) ) : ?>
	<span
		class="sc-cart-order-bump-price__original"
		data-wp-bind--hidden="!state.bumpHasDiscount"
		data-wp-text="context.bump.subtotal_display_amount"
		hidden
	></span>
	<?php endif; ?>

	<span
		class="sc-cart-order-bump-price__current"
		data-wp-text="context.bump.total_display_amount"
	></span>

	<?php if ( ! empty( $attributes['showDiscountBadge'] ) ) : ?>
	<span
		class="sc-cart-order-bump-price__badge"
		data-wp-bind--hidden="!state.bumpHasDiscount"
		data-wp-text="state.bumpDiscountText"
		hidden
	></span>
	<?php endif; ?>
</div>
