<a
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'has-arrow-type-' . esc_attr( $pagination_arrow ) ] ) ); ?>
	data-wp-bind--href="context.nextPageLink"
	data-wp-class--disabled="!context.nextPageLink"
	data-wp-bind--aria-disabled="!context.nextPageLink"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	>
	<span class="<?php echo empty( $show_label ) ? 'sc-screen-reader-text' : 'sc-page-link-label'; ?>">
		<?php echo wp_kses_post( $attributes['label'] ?? __( 'Next', 'surecart' ) ); ?>
	</span>

	<?php if ( ! empty( $arrow_name ) ) : ?>
		<?php
		echo wp_kses(
			\SureCart::svg()->get(
				$arrow_name,
				[
					'class'       => 'wp-block-surecart-product-pagination-next__icon',
					'aria-hidden' => true,
				]
			),
			sc_allowed_svg_html()
		)
		?>
	<?php endif; ?>
</a>
