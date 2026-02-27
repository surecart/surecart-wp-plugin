<a
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'aria-label'   => esc_html( $aria_label ),
				'aria-checked' => $checkbox->checked ? 'true' : 'false',
				'class'        => 'sc-form-check',
			]
		)
	); ?>
	href="<?php echo esc_url( $checkbox->href ); ?>"
	data-wp-on--click="surecart/product-review::actions.navigate"
	data-wp-on--mouseenter="surecart/product-review::actions.prefetch"
	role="checkbox"
>
	<input tabindex="-1" class="sc-check-input" type="checkbox" id="<?php echo (int) $checkbox->value; ?>" <?php checked( $checkbox->checked ); ?> aria-hidden="true" />
	<span class="sc-form-label" aria-hidden="true"><?php echo esc_html( $checkbox->label ); ?></span>
</a>
