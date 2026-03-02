<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> aria-label="<?php echo esc_attr( sprintf( __( 'Reviewed by %s', 'surecart' ), $formatted_name ) ); ?>">
	<span aria-hidden="true"><?php echo esc_html( $formatted_name ); ?></span>
</div>
