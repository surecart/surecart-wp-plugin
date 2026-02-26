<?php
$buttons = array(
	array(
		'class'        => 'sc-sidebar-toggle-desktop',
		'event'        => 'actions.toggleDesktop',
		'ariaLabel'    => 'state.ariaLabelDesktop',
		'ariaExpanded' => 'state.open',
	),
	array(
		'class'        => 'sc-sidebar-toggle-mobile',
		'event'        => 'actions.toggleMobile',
		'ariaLabel'    => 'state.ariaLabelMobile',
		'ariaExpanded' => 'state.mobileOpen',
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
	aria-controls="review-filters"
	data-wp-bind--aria-expanded="<?php echo esc_attr( $button['ariaExpanded'] ); ?>"
	data-wp-bind--aria-label="<?php echo esc_attr( $button['ariaLabel'] ); ?>"
	role="button"
	tabindex="0"
>
	<?php
		echo ! empty( $attributes['icon'] ) && 'none' !== $attributes['icon'] ? wp_kses(
			SureCart::svg()->get(
				$attributes['icon'],
				[
					'aria-hidden' => 'true',
					'class'       => 'sc-sidebar-toggle__icon',
				],
			),
			sc_allowed_svg_html()
		) : '';
	?>
	<span aria-hidden="true"><?php echo wp_kses_post( $attributes['label'] ?? __( 'Filter', 'surecart' ) ); ?></span>
</div>
<?php endforeach; ?>
