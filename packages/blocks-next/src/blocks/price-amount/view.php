<span
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	aria-label="<?php esc_attr( $screen_reader_text ); ?>"
>
	<?php echo esc_html( $display_amount ); ?>
</span>
