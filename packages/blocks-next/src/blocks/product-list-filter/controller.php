<?php

use SureCart\Models\ProductCollection;

$product_collections  = ProductCollection::get( array( 'per_page' => -1 ) );

// return the view.
return 'file:./view.php';