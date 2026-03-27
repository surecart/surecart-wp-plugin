<a
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'aria-label'      => esc_html( $checkbox->label ),
				'aria-checked'    => $checkbox->checked ? 'true' : 'false',
				'aria-labelledby' => $checkbox->label,
				'class'           => 'sc-form-check',
			]
		)
	); ?>
	href="<?php echo esc_url( $checkbox->href ); ?>"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	role="checkbox"
>
	<input tabindex="-1" class="sc-check-input" type="checkbox" id="<?php echo (int) $checkbox->value; ?>" <?php checked( $checkbox->checked ); ?> />
	<label for="<?php echo (int) $checkbox->value; ?>"><?php echo esc_html( $checkbox->label ); ?></label>
</a>

