<?php if ( has_excerpt() ) : ?>
	<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
		<?php the_excerpt(); ?>
	</div>
<?php endif; ?>
