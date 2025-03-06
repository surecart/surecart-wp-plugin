<?php
global $sc_query_id;
$params         = \SureCart::block()->urlParams( 'products' );
$clear_all_url  = $params->removeAllFilterArgs();
$all_taxonomies = $params->getAllTaxonomyArgs();

// no filters, don't render this block.
if ( empty( $all_taxonomies ) ) {
	return;
}

// return the view.
return 'file:./view.php';
