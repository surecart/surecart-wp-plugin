<?php

if ( ! function_exists( 'surecart_no_content_get_header' ) ) :
	/**
	 * A function to display a header without content.
	 *
	 * @return void
	 */
	function surecart_no_content_get_header() {
		?>
		<!DOCTYPE html>
		<html <?php language_attributes(); ?> class="no-js">
		<head>
			<meta charset="<?php bloginfo( 'charset' ); ?>">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<link rel="profile" href="http://gmpg.org/xfn/11">
				<?php wp_head(); ?>
		</head>

		<body <?php body_class(); ?>>
		<?php
		do_action( 'surecart_content_body_before' );
	}
endif;

if ( ! function_exists( 'surecart_no_content_get_footer' ) ) :
	/**
	 * A function to display a footer without content.
	 *
	 * @return void
	 */
	function surecart_no_content_get_footer() {
		do_action( 'surecart_content_body_after' );
		wp_footer();
		?>
		</body>
		</html>
		<?php
	}
endif;

add_action(
	'surecart_page_elements',
	function() {
		the_content();
	}
);
