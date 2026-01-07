<?php
$arrow = $block->context['paginationArrow'] ?? 'chevron';

if ( 'none' === $arrow ) {
	return;
}

$icon = 'arrow' === $arrow ? 'arrow-left' : 'chevron-left';
?>
<button
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-cart-order-bump-pagination-previous',
				'type'  => 'button',
			)
		)
	);
	?>
	data-wp-on--click="surecart/order-bumps::actions.previousPage"
	data-wp-bind--disabled="!state.hasPreviousPage"
	data-wp-bind--aria-disabled="!state.hasPreviousPage"
	aria-label="<?php esc_attr_e( 'Previous page', 'surecart' ); ?>"
>
	<?php echo wp_kses( \SureCart::svg()->get( $icon ), sc_allowed_svg_html() ); ?>
</button>
