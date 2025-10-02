<?php

// For Analytics.
$query   = sc_product_review_list_query( $block );
$reviews = $query;

// die(var_dump($reviews));

// return the view.
return 'file:./view.php';
