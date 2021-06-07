
<ce-form-section label="<?php echo esc_attr( $attributes['label'] ); ?>">

	<?php if ( ! empty( $attributes['description'] ) ) { ?>
		<span slot="description"><?php echo wp_kses_post( $attributes['description'] ); ?></span>
	<?php } ?>

	<ce-form-row>
		<ce-choices tabindex="1">
			<ce-choice name="test" required checked>
				Gold Plan
				<span slot="description">$9.99, then $49.99 per month</span>
			</ce-choice>
			<ce-choice name="test">Silver Plan
				<span slot="description">$39.99 per month</span>
			</ce-choice>
			<ce-choice name="test">Bronze Plan
				<span slot="description">$9.99 per month</span>
			</ce-choice>
		</ce-choices>
	</ce-form-row>
</ce-form-section>
