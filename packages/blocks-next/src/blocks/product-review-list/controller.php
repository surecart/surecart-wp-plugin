<?php

// For Analytics.
$query   = sc_product_review_list_query( $block );
$reviews = $query->reviews;

// return the view.
return 'file:./view.php';
