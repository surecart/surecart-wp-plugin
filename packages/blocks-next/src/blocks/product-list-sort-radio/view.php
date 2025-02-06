<a
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'aria-label'      => esc_html( $radio->label ),
				'aria-checked'    => $radio->checked ? 'true' : 'false',
				'aria-labelledby' => $radio->label,
				'class'           => 'sc-form-check',
			]
		)
	); ?>
	href="<?php echo esc_url( $radio->href ); ?>"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	role="radio"
>
	<input tabindex="-1" class="sc-check-input" type="radio" id="<?php echo (int) $radio->value; ?>" <?php checked( $radio->checked ); ?> />
	<label for="<?php echo (int) $radio->value; ?>"><?php echo esc_html( $radio->label ); ?></label>
</a>

