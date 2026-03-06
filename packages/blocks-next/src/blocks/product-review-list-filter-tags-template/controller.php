<?php
global $sc_query_id;
$params      = \SureCart::block()->urlParams( 'reviews' );
$all_ratings = $params->getAllStarArgs();

$rating_tags = [];

// Process ratings filters.
if ( ! empty( $all_ratings['ratings'] ) && is_array( $all_ratings['ratings'] ) ) {
	foreach ( $all_ratings['ratings'] as $rating_value ) {
		$star = (int) $rating_value;
		if ( $star >= 1 && $star <= 5 ) {
			// Create label for the rating.
			$star_text = sprintf(
				// translators: %d is the number of stars.
				esc_html( _n( '%d Star', '%d Stars', $star, 'surecart' ) ),
				$star
			);

			$rating_tags[] = [
				'href' => $params->removeFilterArg( 'ratings', (string) $star ),
				'name' => $star_text,
				'id'   => 'rating-' . $star,
			];
		}
	}
}

return 'file:/view.php';
