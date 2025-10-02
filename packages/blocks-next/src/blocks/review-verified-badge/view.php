<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<span class="wc-block-review-verified-badge"><?php esc_html_e( 'Verified Buyer', 'woocommerce' ); ?></span>
	<?php
	echo wp_kses(
		SureCart::svg()->get(
			'verified',
			[
				'fill'   => 'white',
				'color'  => 'white',
				'width'  => 20,
				'height' => 20,
			]
		),
		sc_allowed_svg_html()
	);
	?>
</div>
