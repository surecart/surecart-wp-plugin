<?php $html_tag = 'h' . (int) ( $attributes['level'] ?? 1 ); ?>
<<?php echo esc_html( $html_tag ); ?> <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => $text_align ]) ); ?>>
	<?php the_title(); ?>
</<?php echo esc_html( $html_tag ); ?>>
