<?php
$current_option = $block->context['surecart/bundleItemOption'] ?? null;
$option_name    = $current_option->name ?? '';

$display_name = ! empty( $option_name )
	? sprintf(
		/* translators: 1: product name, 2: variant option name. */
		_x( '%1$s - %2$s', 'Bundle item name with variant option', 'surecart' ),
		$component_name,
		$option_name
	)
	: $component_name;
?>
<span <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-item__name' ) ) ); ?>>
	<?php echo esc_html( $display_name ); ?>
</span>
