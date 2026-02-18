<span
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'aria-label'    => esc_html( $aria_label_disabled ),
				'aria-checked'  => 'false',
				'aria-disabled' => 'true',
				'class'         => 'sc-form-check is-disabled',
			]
		)
	); ?>
	role="checkbox"
>
	<input tabindex="-1" class="sc-check-input" type="checkbox" id="<?php echo (int) $checkbox->value; ?>" disabled aria-hidden="true" />
	<span class="sc-form-label" aria-hidden="true"><?php echo esc_html( $checkbox->label ); ?></span>
</span>
