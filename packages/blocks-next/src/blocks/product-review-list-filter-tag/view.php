<a
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'class' => 'sc-tag sc-tag--default sc-tag--medium',
				'style' => 'cursor: pointer; text-decoration: none;',
			]
		)
	); ?>
	id="sc-product-review-filter-tag-<?php echo (int) $filter_tag->id; ?>"
	href="<?php echo esc_url( $filter_tag->href ); ?>"
	data-wp-on--click="surecart/product-review::actions.navigate"
	data-wp-on--mouseenter="surecart/product-review::actions.prefetch"
	role="listitem"
	aria-description="<?php esc_html_e( 'Press enter to remove this filter.', 'surecart' ); ?>"
>
	<span class="tag__content"><?php echo esc_html( $filter_tag->name ); ?></span>
	<?php
	echo wp_kses(
		SureCart::svg()->get(
			'x',
			[
				'class'       => 'sc-tag__clear',
				'aria-hidden' => 'true',
			],
		),
		sc_allowed_svg_html()
	);
	?>
</a>
