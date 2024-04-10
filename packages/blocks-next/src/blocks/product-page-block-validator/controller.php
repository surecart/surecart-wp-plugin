<?php
// we only want to insert the block once.
global $sc_product_page_validator_block_inserted;
if ( ! empty( $sc_product_page_validator_block_inserted ) ) {
	return '';
}
$sc_product_page_validator_block_inserted++;

// return the view.
return 'file:./view.php';
