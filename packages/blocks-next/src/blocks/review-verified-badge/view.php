<?php
$show_label = $attributes['show_label'] ?? true;
$label      = $attributes['label'] ?? '';
$icon_size  = isset( $attributes['icon_size'] ) ? (int) $attributes['icon_size'] : 20;
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( ! empty( $show_label ) ) : ?>
		<span class="wc-block-review-verified-badge"><?php echo esc_html( $label ?: __( 'Verified Buyer', 'woocommerce' ) ); ?></span>
	<?php endif; ?>

	<?php
	echo wp_kses(
		SureCart::svg()->get(
			'verified',
			[
				'width'  => esc_attr( $icon_size ),
				'height' => esc_attr( $icon_size ),
			]
		),
		sc_allowed_svg_html()
	);
	?>
</div>
