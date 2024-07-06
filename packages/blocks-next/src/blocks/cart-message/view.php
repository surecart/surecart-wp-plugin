<div
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'style' => $style,
				'class' => 'sc-text',
			)
		)
	); ?>
	<?php echo esc_attr( empty( $attributes['text'] ) ? 'hidden' : '' ); ?>
>
	<div class="sc-text">
		<?php echo wp_kses( $attributes['text'],
			array(
				'strong' => array(),
				'b'      => array(),
				'i'      => array(),
				'em'     => array(),
				'strike' => array(),
				'del'    => array(),
				's'      => array(),
			)
		); ?>
	</div>
</div>
