<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	aria-label="<?php esc_attr_e( 'Remove item', 'surecart' ); ?>"
	data-wp-on--click="surecart/checkout::actions.removeLineItem"
	role="button"
	tabindex="0"
>
	<?php echo wp_kses( SureCart::svg()->get( 'x', [ 'class' => 'wp-block-surecart-cart-line-item-remove__icon' ] ), sc_allowed_svg_html() ); ?>
	Remove
	<!-- TODO: add ability to change text. -->
</div>
