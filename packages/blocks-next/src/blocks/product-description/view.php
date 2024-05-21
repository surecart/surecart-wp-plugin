<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo wp_kses_post( $block->context['surecart/product']->description ?? '' ); ?>
</div>
