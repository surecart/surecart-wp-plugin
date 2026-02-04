<span
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'aria-label'      => esc_html( $checkbox->label ),
				'aria-checked'    => 'false',
				'aria-disabled'   => 'true',
				'aria-labelledby' => $checkbox->label,
				'class'           => 'sc-form-check is-disabled',
			]
		)
	); ?>
	role="checkbox"
>
	<input tabindex="-1" class="sc-check-input" type="checkbox" id="<?php echo (int) $checkbox->value; ?>" disabled />
	<label for="<?php echo (int) $checkbox->value; ?>" class="sc-form-label"><?php echo esc_html( $checkbox->label ); ?></label>
</span>
