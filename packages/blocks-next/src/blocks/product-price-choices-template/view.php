<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-choices' ) ) ); ?> >
	<?php
	foreach ( $prices as $price ) :
		// Get an instance of the current Post Template Block.
		$block_instance = $block->parsed_block;

		// set the block name to null.
		$block_instance['blockName'] = 'core/null';

		$filter_block_context = static function ( $context ) use ( $price ) {
			$context['sc_product_price'] = $price;
			return $context;
		};

		// use an early priority to ensure that the block context is set before the block is rendered.
		add_filter( 'render_block_context', $filter_block_context, 1 );

		// render the block.
		$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
		remove_filter( 'render_block_context', $filter_block_context, 1 );
		?>
		<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
	<?php endforeach; ?>
</div>
