<?php
$arrow = $block->context['paginationArrow'] ?? 'chevron';

if ( 'none' === $arrow ) {
	return;
}

$icon = 'arrow' === $arrow ? 'arrow-right' : 'chevron-right';
?>
<button
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-cart-order-bump-pagination-next',
				'type'  => 'button',
			)
		)
	);
	?>
	data-wp-on--click="surecart/order-bumps::actions.nextPage"
	data-wp-bind--disabled="!state.hasNextPage"
	data-wp-bind--aria-disabled="!state.hasNextPage"
	aria-label="<?php esc_attr_e( 'Next page', 'surecart' ); ?>"
>
	<?php echo wp_kses( \SureCart::svg()->get( $icon ), sc_allowed_svg_html() ); ?>
</button>
