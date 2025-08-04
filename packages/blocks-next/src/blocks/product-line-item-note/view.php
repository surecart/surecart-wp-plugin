<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<sc-product-note-input
		product-id="<?php echo esc_attr( $sc_product->id ?? '' ); ?>"
		label="<?php echo esc_attr( $attributes['label'] ?? __( 'Note', 'surecart' ) ); ?>"
		placeholder="<?php echo esc_attr( $attributes['placeholder'] ?? __( 'Add a note (optional)', 'surecart' ) ); ?>"
		help="<?php echo esc_attr( $attributes['help'] ?? '' ); ?>"
		show-label="<?php echo esc_attr( $attributes['showLabel'] ?? true ); ?>"
		size="medium"
		maxlength="500"
	></sc-product-note-input>
</div>