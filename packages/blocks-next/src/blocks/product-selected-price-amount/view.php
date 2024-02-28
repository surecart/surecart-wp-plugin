<?php
$state = wp_interactivity_state( 'surecart/product' );
wp_interactivity_state(
	'surecart/product',
	array_merge(
		$state,
		array(
			// set the computed display amount for this specific context.
			'selectedPriceDisplayAmount' => $block->context['surecart/product']->display_amount,
		)
	)
);
?>
<div <?php echo get_block_wrapper_attributes(); ?> data-wp-text="state.selectedPriceDisplayAmount"></div>
