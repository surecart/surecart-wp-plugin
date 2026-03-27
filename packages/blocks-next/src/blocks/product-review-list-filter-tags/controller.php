<?php
if ( empty( $block->parsed_block['innerBlocks'] ) || empty( $block->parsed_block['innerBlocks'][0] ) ) {
	return;
}

$all_stars = \SureCart::block()->urlParams( 'reviews' )->getAllStarArgs();

return 'file:/view.php';
