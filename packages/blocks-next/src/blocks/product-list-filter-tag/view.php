<a
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'class' => 'sc-tag sc-tag--default sc-tag--medium',
				'style' => 'cursor: pointer; text-decoration: none;',
			]
		)
	); ?>
	data-wp-bind--key="context.collection.id"
	data-wp-bind--id="context.collection.id"
	data-wp-bind--href="context.collection.href"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	aria-describedby="sc-filter-tag-message"
>
	<span class="tag__content" data-wp-text="context.collection.name"></span>
	<?php
	echo wp_kses(
		SureCart::svg()->get(
			'x',
			[
				'class'      => 'sc-tag__clear',
				'aria-label' => __(
					'Remove tag',
					'surecart'
				),
			],
		),
		sc_allowed_svg_html()
	);
	?>
</a>
