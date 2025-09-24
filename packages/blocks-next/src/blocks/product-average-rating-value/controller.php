<?php

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

return 'file:./view.php';
