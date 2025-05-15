<?php
global $post;

if ( ! has_excerpt() ) {
	return;
}

$excerpt_length   = $attributes['excerpt_length'] ?? 55;
$truncate_excerpt = $attributes['truncate_excerpt'] ?? false;
$excerpt          = $post->post_excerpt; // make sure it is not truncated.

if ( $truncate_excerpt ) {
	$excerpt = wp_trim_words( $excerpt, $excerpt_length );
}

$show_read_more = $attributes['show_read_more'] ?? false;

if ( $show_read_more ) {
	$read_more_text = $attributes['read_more_text'] ?? __( 'Read more', 'surecart' );
	$read_more_link = sprintf(
		' <a href="%s">%s</a>',
		esc_url( get_permalink() ),
		esc_html( $read_more_text )
	);

	$excerpt = $excerpt . $read_more_link;
}

// return the view.
return 'file:./view.php';
