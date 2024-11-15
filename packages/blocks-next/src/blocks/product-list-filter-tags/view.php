<?php
global $sc_query_id;
$params = \SureCart::block()->urlParams( 'products' );
$filter = $params->getArg( 'sc_collection' );

// no filters, don't render this block.
if ( empty( $filter ) ) {
	return;
}

$product_collections = get_terms(
	[
		'taxonomy'   => 'sc_collection',
		'hide_empty' => false,
		'include'    => $filter,
	]
);

// map the collections to the view.
$product_collections = array_map(
	function ( $collection ) use ( $params ) {
		return (object) [
			'href' => $params->removeFilterArg( 'sc_collection', $collection->term_id ),
			'name' => $collection->name,
			'id'   => $collection->term_id,
		];
	},
	$product_collections ?? []
);

// no collections, don't render this block.
if ( empty( $product_collections ) ) {
	return;
}

?>
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'role' => 'list' ] ) ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'collections' => $product_collections ] ) ); ?>
>
<?php
foreach ( $product_collections as $filter_tag ) :
	// Get an instance of the current Post Template block.
		$block_instance = $block->parsed_block;

		// Set the block name to one that does not correspond to an existing registered block.
		// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
		$block_instance['blockName'] = 'core/null';

		$filter_block_context = static function ( $context ) use ( $filter_tag ) {
			$context['surecart/filter_tag'] = $filter_tag;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );

		$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );

		remove_filter( 'render_block_context', $filter_block_context, 1 );
	?>
	<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
<?php endforeach; ?>
</div>
