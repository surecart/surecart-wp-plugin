<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	aria-label="<?php esc_attr_e( 'Remove item', 'surecart' ); ?>"
	data-wp-on--click="surecart/checkout::actions.removeLineItem"
	data-wp-on--keydown="surecart/checkout::actions.removeLineItem"
	role="button"
	tabindex="0"
>
	<?php if ( 'none' !== $attributes['icon'] ) : ?>
		<?php echo wp_kses( SureCart::svg()->get( $attributes['icon'], [ 'class' => 'wp-block-surecart-cart-line-item-remove__icon' ] ), sc_allowed_svg_html() ); ?>
	<?php endif; ?>
	<span class="<?php echo empty( $attributes['show_label'] ) ? 'sc-screen-reader-text' : 'wp-block-surecart-cart-line-item-remove__label'; ?>">
		<?php echo wp_kses_post( $attributes['label'] ); ?>
	</span>
</div>
