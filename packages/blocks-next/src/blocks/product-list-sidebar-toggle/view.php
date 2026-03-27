<?php
$buttons = array(
	array(
		'class'     => 'sc-sidebar-toggle-desktop',
		'event'     => 'actions.toggleDesktop',
		'ariaLabel' => 'state.ariaLabelDesktop',
	),
	array(
		'class'     => 'sc-sidebar-toggle-mobile',
		'event'     => 'actions.toggleMobile',
		'ariaLabel' => 'state.ariaLabelMobile',
	),
);
?>

<?php foreach ( $buttons as $button ) : ?>
<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => $button['class'],
			)
		)
	);
	?>
	data-wp-interactive='{ "namespace": "surecart/sidebar" }'
	data-wp-on--click="<?php echo esc_attr( $button['event'] ); ?>"
	data-wp-on--keydown="<?php echo esc_attr( $button['event'] ); ?>"
	aria-haspopup="dialog"
	data-wp-bind--aria-label="<?php echo esc_attr( $button['ariaLabel'] ); ?>"
	role="button"
	tabindex="0"
>
	<?php
		echo ! empty( $attributes['icon'] ) && 'none' !== $attributes['icon'] ? wp_kses(
			SureCart::svg()->get(
				$attributes['icon'],
				[
					'aria-label' => __(
						'Open sidebar',
						'surecart'
					),
					'class'      => 'sc-sidebar-toggle__icon',
				],
			),
			sc_allowed_svg_html()
		) : '';

		echo wp_kses_post( $attributes['label'] ?? __( 'Filter', 'surecart' ) );
	?>
</div>
<?php endforeach; ?>
