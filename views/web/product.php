<?php
get_header();
echo '<style>.is-layout-constrained .alignwide { max-width: ' . (int) ( $content_width ?? 1080 ) . 'px; margin-left: auto; margin-right: auto; }</style>';
echo surecart_get_the_block_template_html( $content ); // phpcs:ignore WordPress.Security.EscapeOutput
get_footer();
