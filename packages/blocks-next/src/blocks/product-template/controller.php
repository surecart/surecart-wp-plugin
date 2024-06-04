<?php

use SureCart\Models\Blocks\ProductListBlock;

$controller = new ProductListBlock( $block );
$query      = $controller->query();

return 'file:./view.php';
