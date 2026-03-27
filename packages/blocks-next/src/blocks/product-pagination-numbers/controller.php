<?php

$query            = sc_product_list_query( $block );
$pagination_links = $query->pagination_links;

// Render the block.
return 'file:./view.php';
