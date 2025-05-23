<?php

$query              = sc_product_list_query( $block );
$wrapper_attributes = ( ! empty( $attributes['layout'] ) && ! empty( $attributes['layout']['columnCount'] ) ) ? array( 'class' => 'sc-product-template-columns-' . $attributes['layout']['columnCount'] ) : array();

return 'file:./view.php';
