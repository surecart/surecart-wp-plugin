<?php

$product = sc_get_product();
if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

$params        = \SureCart::block()->urlParams( 'reviews' );
$rating_filter = $params->getArg( 'rating' ) ?? '';
$options       = [];

// Generate options for each star rating (5 to 1).
for ( $star = 5; $star >= 1; $star-- ) {
	$count = $product->reviews_breakdown->$star ?? 0;

	// Create label with count.
	$star_text = sprintf(
		// translators: %d is the number of stars.
		esc_html( _n( '%d Star', '%d Stars', $star, 'surecart' ) ),
		$star
	);

	$label = sprintf( '%s (%d)', $star_text, $count );

	$options[] = [
		'value'   => (string) $star,
		'href'    => $params->addArg( 'rating', (string) $star )->url(),
		'label'   => $label,
		'count'   => $count,
		'checked' => (string) $star === $rating_filter,
	];
}

return 'file:./view.php';
