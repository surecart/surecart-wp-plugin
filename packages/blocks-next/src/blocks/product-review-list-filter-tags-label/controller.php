<?php
global $sc_query_id;
$params        = \SureCart::block()->urlParams( 'reviews' );
$clear_all_url = $params->removeAllStarArgs();
$all_stars     = $params->getAllStarArgs();

// no filters, don't render this block.
if ( empty( $all_stars ) ) {
	return;
}

// return the view.
return 'file:./view.php';
