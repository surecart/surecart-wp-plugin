<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	role="region"
	aria-label="<?php esc_attr_e( 'Customer Reviews Summary', 'surecart' ); ?>"
>
	<?php if ( ! empty( $sr_summary ) ) : ?>
		<span class="sc-screen-reader-text"><?php echo esc_html( $sr_summary ); ?></span>
	<?php endif; ?>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
