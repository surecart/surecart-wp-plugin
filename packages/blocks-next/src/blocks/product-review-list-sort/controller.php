<?php
$product = sc_get_product();
if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

$params        = \SureCart::block()->urlParams( 'reviews' );
$rating_filter = $params->getArg( 'rating' ) ?? '';

$options = [];

// Generate options for each star rating (5 to 1).
for ( $star = 5; $star >= 1; $star-- ) {
	$count = $product->reviews_breakdown->$star ?? 0;

	// Create label with count.
	$star_text = 1 === $star
		? esc_html__( '1 Star', 'surecart' )
		: sprintf( esc_html__( '%d Stars', 'surecart' ), $star );

	$label = sprintf( '%s (%d)', $star_text, $count );

	$options[] = [
		'value'   => (string) $star,
		'href'    => $params->addArg( 'rating', (string) $star )->url(),
		'label'   => $label,
		'count'   => $count,
		'checked' => (string) $star === $rating_filter,
	];
}

// get the currently selected option.
$selected_options = array_filter( $options, fn( $option ) => $option['checked'] );
$selected_option  = array_shift( $selected_options ) ?? $options[0];

// return the view.
return 'file:./view.php';
