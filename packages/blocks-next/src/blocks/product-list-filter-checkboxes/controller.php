<?php

use SureCart\Models\Blocks\ProductListBlock;

$options = ( new ProductListBlock( $block ) )->getTermOptions( $attributes['taxonomy'] ?? 'sc_collection' );

// no filter options.
if ( empty( $options ) ) {
	return false;
}

return 'file:./view.php';
