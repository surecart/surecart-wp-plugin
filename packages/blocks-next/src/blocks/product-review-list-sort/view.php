<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php foreach ( $options as $key => $option ) : ?>
		<a
			aria-label="<?php echo esc_attr( $option['label'] ); ?>"
			aria-labelledby="<?php echo esc_attr( $option['label'] ); ?>"
			aria-checked="<?php echo $option['checked'] ? 'true' : 'false'; ?>"
			class="sc-form-check"
			href="<?php echo esc_url( $option['href'] ); ?>"
			data-wp-on--click="surecart/product-review::actions.navigate"
			data-wp-on--mouseenter="surecart/product-review::actions.prefetch"
			role="checkbox"
		>
			<input tabindex="-1" class="sc-check-input" type="checkbox" id="<?php echo (int) $option['value']; ?>" <?php checked( $option['checked'] ); ?> />
			<label for="<?php echo (int) $option['value']; ?>"><?php echo esc_html( $option['label'] ); ?></label>
		</a>
	<?php endforeach; ?>
</div>
