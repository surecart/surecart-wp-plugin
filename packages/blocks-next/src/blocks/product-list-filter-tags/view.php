<?php
if ( empty( $block->parsed_block['innerBlocks'] ) || empty( $block->parsed_block['innerBlocks'][0] ) ) {
	return;
}

if ( 'surecart/product-list-filter-tag' === $block->parsed_block['innerBlocks'][0]['blockName'] ) {
	echo \SureCart::block()->productListFilterTagsMigration()->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	return;
}

$all_taxonomies = \SureCart::block()->urlParams( 'products' )->getAllTaxonomyArgs();
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => empty( $all_taxonomies ) ? 'is-empty' : '' ] ) ); ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
