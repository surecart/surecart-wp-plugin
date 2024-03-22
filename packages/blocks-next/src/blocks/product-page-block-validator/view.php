<?php
// If there is no variant choices block, we need to add it.
if ( empty( $block->context['surecart/has-variant-choices'] ) ){
	echo (new \WP_Block(
		[
			'blockName'    => 'surecart/product-variant-choices-v2',
			'attrs'        => [],
		]
	))->render();
}

// If there is no ad-hoc block, we need to add it.
if ( empty( $block->context['surecart/has-ad-hoc-block'] ) ){
	echo (new \WP_Block(
		[
			'blockName'    => 'surecart/product-selected-price-ad-hoc-amount',
			'attrs'        => [],
		]
	))->render();
}

