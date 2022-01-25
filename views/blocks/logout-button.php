<ce-button
href="<?php echo esc_url( $href ); ?>"
type="<?php echo esc_attr( $type ); ?>"
size="<?php echo esc_attr( $size ); ?>"
>
	<?php if ( ! empty( $show_icon ) ) : ?>
		<ce-icon
			slot="prefix"
			name="log-out"
		></ce-icon>
	<?php endif; ?>

	<?php echo esc_html( $label ); ?>
</ce-button>
