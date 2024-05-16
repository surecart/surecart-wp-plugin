<?php
$block_id 	= $block->context["surecart/product-list/blockId"];
$url 		= \SureCart::block()->urlParams('products')->setInstanceId( $block_id );
$sort 		= $url->getArg( 'sort' ) ?? 'created_at:desc';

$options = [
 	[
		'value' => 'created_at:desc',
		'href' => $url->addArg('sort', 'created_at:desc'),
		'label' => esc_html__( 'Latest', 'surecart' ),
		'checked' => $sort === 'created_at:desc',
	],
    [
		'value' => 'created_at:asc',
		'href' => $url->addArg('sort', 'created_at:asc'),
		'label' => esc_html__( 'Oldest', 'surecart' ),
		'checked' => $sort === 'created_at:asc',
	],
	[
		'value' => 'price:asc',
		'href' => $url->addArg('sort', 'price:asc'),
		'label' => esc_html__( 'Price, low to high', 'surecart' ),
		'checked' => $sort === 'price:asc',
	],
	[ 	'value' => 'price:desc',
		'href' => $url->addArg('sort', 'price:desc'),
		'label' => esc_html__( 'Price, high to low', 'surecart' ),
		'checked' => $sort === 'price:desc',
	],
];

// get the currently selected option.
$selected_options 	= array_filter($options, fn($option) => $option['value'] === $sort);
$selected_option 	= array_shift($selected_options);

// return the view.
return 'file:./view.php';
