<?php $tag = 'h' . (int) ( $attributes['level'] ?? 1 ); ?>
<<?php echo esc_html( $tag ); ?> <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo wp_kses_post( $block->context['surecart/product']->name ?? '' ); ?>
</<?php echo esc_html( $tag ); ?>>
