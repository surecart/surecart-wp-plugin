<?php

$product = sc_get_product();
if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

$params         = \SureCart::block()->urlParams( 'reviews' );
$ratings_filter = $params->getArg( 'ratings' ) ?? [];
$ratings_filter = is_array( $ratings_filter ) ? $ratings_filter : [];
$options        = [];

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

	$star_value = (string) $star;
	$is_checked = in_array( $star_value, $ratings_filter, true );

	// If checked, remove from URL; if not checked, add to URL.
	$href = $is_checked
		? $params->removeFilterArg( 'ratings', $star_value )
		: $params->addFilterArg( 'ratings', $star_value );

	$options[] = [
		'value'   => $star_value,
		'href'    => $href,
		'label'   => $label,
		'count'   => $count,
		'checked' => $is_checked,
	];
}

return 'file:./view.php';
