<?php $html_tag = $attributes['isLink'] ? 'a' : 'div'; ?>
<<?php echo esc_html( $html_tag ); ?>
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'class' => 'sc-tag sc-tag--default sc-tag--medium',
				'style' => 'cursor: pointer; text-decoration: none;',
			]
		)
	);
	?>
	<?php echo $attributes['isLink'] ? 'href="' . esc_url( $url ) . '"' : ''; ?>
	<?php // translators: You are currently on a %s collection link. ?>
	aria-label="<?php echo esc_attr( sprintf( __( '%s collection' ), $collection->name ) ); ?>"
>
	<?php echo wp_kses_post( $collection->name ); ?>
</<?php echo esc_html( $html_tag ); ?>>
