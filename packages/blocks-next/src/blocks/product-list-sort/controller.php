<?php
$block_id = $block->context["surecart/product-list/blockId"];
$sort_key = \SureCart::block()->productUrlParams()->getKey( 'sort', $block_id );
$sort = empty( $_GET[ $sort_key ] ) ? 'created_at:desc' : sanitize_text_field( $_GET[ $sort_key ] );

$options = [
 	[
		'value' => 'created_at:desc',
		'href' => add_query_arg( $sort_key, 'created_at:desc' ),
		'label' => esc_html__( 'Latest', 'surecart' ),
		'checked' => $sort === 'created_at:desc',
	],
    [
		'value' => 'created_at:asc',
		'href' => add_query_arg( $sort_key, 'created_at:asc' ),
		'label' => esc_html__( 'Oldest', 'surecart' ),
		'checked' => $sort === 'created_at:asc',
	],
	[
		'value' => 'price:asc',
		'href' => add_query_arg( $sort_key, 'price:asc' ),
		'label' => esc_html__( 'Price, low to high', 'surecart' ),
		'checked' => $sort === 'price:asc',
	],
	[ 	'value' => 'price:desc',
		'href' => add_query_arg( $sort_key, 'price:desc' ),
		'label' => esc_html__( 'Price, high to low', 'surecart' ),
		'checked' => $sort === 'price:desc',
	],
];

$selected_options = array_filter(
	$options,
	function( $option ) use ( $sort ) {
		return $option['value'] === $sort;
	}
);
$selected_option = array_shift( $selected_options );

// return the view.
return 'file:./view.php';
