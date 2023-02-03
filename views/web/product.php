<?php
global $sc_product, $content_width;
$template = wp_is_block_theme() ? get_query_template( 'sc-product' ) : false;
if ( $template ) :
	include $template;
else :
	get_header();
	echo '<style>.is-layout-constrained .alignwide { max-width: ' . (int) ( $content_width ?? 1080 ) . 'px; margin-left: auto; margin-right: auto; }</style>';
	echo get_the_block_template_html(); // phpcs:ignore WordPress.Security.EscapeOutput
	get_footer();
endif;
