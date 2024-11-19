<a 
	<?php echo wp_kses_data( get_block_wrapper_attributes([
		'aria-label' => esc_html( $checkbox->label ),
	])  ); ?>
	href="<?php echo $checkbox->href; ?>"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
>
	<input type="checkbox" id="<?php echo (int) $checkbox->value; ?>" <?php checked( $checkbox->checked ) ?> />
	<label  for="<?php echo (int) $checkbox->value; ?>"><?php echo esc_html( $checkbox->label ); ?></label>
</a>

