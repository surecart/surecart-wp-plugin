<?php
// we already have an ad-hoc block, so we don't need to add another one.
// if ( $block->context["surecart/has-ad-hoc-block"] ) {
// return '';
// }

// // we only want to insert the block once.
global $sc_block_rendered;
if ( ! empty( $sc_block_rendered[ $block->parsed_block['blockName'] ] ) && $sc_block_rendered[ $block->parsed_block['blockName'] ][ $block->context['surecart/product']->id ] ) {
	return '';
}
$sc_block_rendered[ $block->parsed_block['blockName'] ][ $block->context['surecart/product']->id ] = true;


$styles = sc_get_block_styles();
$style  = $styles['css'] ?? '';
$class  = $styles['classnames'] ?? '';


// return the view.
return 'file:./view.php';
