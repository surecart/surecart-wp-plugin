<?php
// we only want to insert the block once.
global $sc_block_rendered;
if ( ! empty( $sc_block_rendered[ $block->parsed_block['blockName'] ] ) && $sc_block_rendered[ $block->parsed_block['blockName'] ][ sc_get_product()->id ] ) {
	return '';
}
$sc_block_rendered[ $block->parsed_block['blockName'] ][ sc_get_product()->id ] = true;

// return the view.
return 'file:./view.php';
