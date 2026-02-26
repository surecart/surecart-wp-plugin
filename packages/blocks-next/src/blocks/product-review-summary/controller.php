<?php

$product = sc_get_product();

if ( empty( $product ) ) {
	return;
}

$sr_summary = '';

if ( $product ) {
	$average = number_format( $product->average_stars ?? 0, 1 );
	$total   = (int) ( $product->total_reviews ?? 0 );

	// translators: 1: average rating, 2: total number of reviews.
	$sr_summary = sprintf(
		_n(
			'Average rating %1$s out of 5 stars. Based on %2$s review.',
			'Average rating %1$s out of 5 stars. Based on %2$s reviews.',
			$total,
			'surecart'
		),
		$average,
		number_format_i18n( $total )
	);
}

return 'file:./view.php';
