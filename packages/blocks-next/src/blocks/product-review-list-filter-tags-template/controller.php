<?php
global $sc_query_id;
$params      = \SureCart::block()->urlParams( 'reviews-ratings' );
$all_ratings = $params->getAllStarArgs();

$rating_tags = [];

// Process ratings filters.
if ( ! empty( $all_ratings['reviews-ratings'] ) && is_array( $all_ratings['reviews-ratings'] ) ) {
	foreach ( $all_ratings['reviews-ratings'] as $rating_value ) {
		$star = (int) $rating_value;
		if ( $star >= 1 && $star <= 5 ) {
			// Create label for the rating.
			$star_text = sprintf(
				// translators: %d is the number of stars.
				esc_html( _n( '%d Star', '%d Stars', $star, 'surecart' ) ),
				$star
			);

			$rating_tags[] = [
				'href' => $params->removeFilterArg( 'reviews-ratings', (string) $star ),
				'name' => $star_text,
				'id'   => 'rating-' . $star,
			];
		}
	}
}

return 'file:/view.php';
