<?php

// Get block attributes.
$width = isset( $attributes['width'] ) ? esc_attr( $attributes['width'] ) : '600px';

// Create inline style for CSS variables.
$style = sprintf(
	'--sc-sticky-purchase-width: %s;',
	$width
);
?>

<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-wp-interactive'       => '{ "namespace": "surecart/sticky-purchase" }',
				'data-wp-init'              => 'callbacks.init',
				'data-wp-context'           => '{}',
				'data-wp-on-window--scroll' => 'actions.handleScroll',
				'data-wp-on-window--resize' => 'actions.handleResize',
				'data-wp-on--keydown'       => 'callbacks.handleKeyDown',
				'style'                     => $style,
				'class'                     => 'sc-sticky-purchase',
			]
		)
	);
	?>
>
	<div data-wp-interactive='{ "namespace": "surecart/product-page" }'>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>