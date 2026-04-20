<?php if ( ! empty( $component_image->src ) ) : ?>
	<img
		<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-item__image' ) ) ); ?>
		src="<?php echo esc_url( $component_image->src ); ?>"
		alt="<?php echo esc_attr( $component_name ); ?>"
		loading="lazy"
	/>
<?php else : ?>
	<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-item__image-placeholder' ) ) ); ?>></div>
<?php endif; ?>
