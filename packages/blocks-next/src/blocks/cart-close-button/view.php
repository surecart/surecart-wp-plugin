<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-on--click="surecart/cart::actions.toggle"
	data-wp-on--keypress="surecart/cart::actions.toggle"
	role="button"
	tabindex="0"
	aria-label="<?php esc_attr_e( 'Close cart', 'surecart' ); ?>"
>
	<?php echo wp_kses( SureCart::svg()->get( $icon_name ), sc_allowed_svg_html() ); ?>
</div>
