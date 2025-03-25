<a 
<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array_filter(
				[
					'href'                   => esc_url( $quick_view_link ),
					'role'                   => 'link',
					'aria-disabled'          => empty( $quick_view_link ) ? 'true' : null,
					'aria-label'             => __( 'Quick View Product', 'surecart' ),
					'data-wp-on--click'      => 'actions.navigate',
					'data-wp-on--mouseenter' => 'actions.prefetch',
					'data-wp-interactive'    => '{ "namespace": "surecart/product-quick-view" }',
				]
			)
		)
	);
	?>
>
	<?php echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
</a>