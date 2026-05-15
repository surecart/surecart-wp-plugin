<span <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-item__variant-name' ) ) ); ?>><?php
	if ( '' !== $separator ) : ?><span class="sc-bundle-item__variant-separator" aria-hidden="true"><?php echo esc_html( $separator ); ?></span><?php endif;
	echo esc_html( $option_name );
?></span>
