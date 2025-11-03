<?php
$product = sc_get_product();
if ( ! $product ) {
	return;
}

$show_for_zero_reviews = $attributes['show_for_zero_reviews'] ?? true;

// If show_for_zero_reviews is false and there are no reviews, skip rendering the block.
if ( ! $show_for_zero_reviews && 0 === (int) $product->total_reviews ) {
	return;
}

// Show number alone or number + label depending on the show_label attribute.
$count          = (int) $product->total_reviews;
$number         = number_format_i18n( $count );
$display_number = $number;

// If plus-sign style is selected and there are multiple reviews, append a plus.
$style_variant = $attributes['style_variant'] ?? 'default';
if ( 'plus-sign' === $style_variant && $count > 1 ) {
	$display_number = $number . '+';
}

return 'file:./view.php';
