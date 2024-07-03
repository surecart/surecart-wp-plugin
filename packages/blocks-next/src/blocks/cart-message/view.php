<div
	class="sc-cart-message__wrapper sc-text"
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'style' => $style,
			)
		)
	); ?>
>
	<?php echo esc_html( $attributes['text'] ); ?>
</div>
