<?php
/**
 * Declare any actions and filters here. USE THIS SPARINGLY.
 *
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package SureCart
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Don't let WordPress redirect guess our web routes.
 *
 * This prevents WordPress from finding a close match
 * to one of our web routes in the database and redirecting.
 */
add_filter(
	'do_redirect_guess_404_permalink',
	function( $guess ) {
		if ( ( strpos( $_SERVER['REQUEST_URI'], '/' . untrailingslashit( \SureCart::settings()->permalinks()->getBase( 'buy_page' ) ) . '/' ) !== false ) ) {
			return false;
		}
		if ( ( strpos( $_SERVER['REQUEST_URI'], 'surecart/webhooks' ) !== false ) ) {
			return false;
		}
		if ( ( strpos( $_SERVER['REQUEST_URI'], 'surecart/redirect' ) !== false ) ) {
			return false;
		}
		return $guess;
	},
	9999999999
);

register_uninstall_hook( SURECART_PLUGIN_FILE, 'surecart_uninstall' );

/**
 * Uninstall.
 *
 * @return void
 */
function surecart_uninstall() {
	if ( (bool) get_option( 'sc_uninstall', false ) ) {
		\SureCart::activation()->uninstall();
	}
}

// redirect to an admin page that they can't access instead of homepage.
// Otherwise the homepage if they cannot access admin.
add_filter(
	'surecart.middleware.user.can.redirect_url',
	function( $url ) {
		if ( current_user_can( 'read' ) ) {
			return get_admin_url() . 'admin.php?page=sc-denied';
		}
		return $url;
	}
);


add_filter(
	'block_type_metadata_settings',
	function( $settings, $metadata ) {
		// if there is a controller file, use it.
		$controller_path = wp_normalize_path(
			realpath(
				dirname( $metadata['file'] ) . '/' .
				remove_block_asset_path_prefix( 'file:./controller.php' )
			)
		);

		if ( ! file_exists( $controller_path ) ) {
			return $settings;
		}

		/**
		 * Renders the block on the server.
		 *
		 * @since 6.1.0
		 *
		 * @param array    $attributes Block attributes.
		 * @param string   $content    Block default content.
		 * @param WP_Block $block      Block instance.
		 *
		 * @return string Returns the block content.
		 */
		$settings['render_callback'] = static function ( $attributes, $content, $block ) use ( $controller_path, $metadata ) {
			$view = require $controller_path;

			// if not using 'file:', then it's content output.
			$view_path = remove_block_asset_path_prefix( $view );
			if ( $view_path === $view ) {
				return $view;
			}

			$template_path = wp_normalize_path(
				realpath(
					dirname( $metadata['file'] ) . '/' .
					remove_block_asset_path_prefix( $view )
				)
			);

			ob_start();
			require $template_path;
			return ob_get_clean();
		};

		return $settings;
	},
	10,
	2
);

/**
 * Adds CSS classes and inline styles for colors to the incoming attributes array.
 * This will be applied to the block markup in the front-end.
 *
 * @since 5.6.0
 * @since 6.1.0 Implemented the style engine to generate CSS and classnames.
 * @access private
 *
 * @param  WP_Block_Type $block_type       Block type.
 * @param  array         $block_attributes Block attributes.
 *
 * @return array Colors CSS classes and inline styles.
 */
function sc_get_color_styles( $block_attributes, $types = [ 'text', 'background', 'gradient' ] ) {
	$color_block_styles = array();

	// Text colors.
	if ( in_array( 'text', $types, true ) ) {
		$preset_text_color          = array_key_exists( 'textColor', $block_attributes ) ? "var:preset|color|{$block_attributes['textColor']}" : null;
		$custom_text_color          = isset( $block_attributes['style']['color']['text'] ) ? $block_attributes['style']['color']['text'] : null;
		$color_block_styles['text'] = $preset_text_color ? $preset_text_color : $custom_text_color;
	}

	// Background colors.
	if ( in_array( 'background', $types, true ) ) {
		$preset_background_color          = array_key_exists( 'backgroundColor', $block_attributes ) ? "var:preset|color|{$block_attributes['backgroundColor']}" : null;
		$custom_background_color          = isset( $block_attributes['style']['color']['background'] ) ? $block_attributes['style']['color']['background'] : null;
		$color_block_styles['background'] = $preset_background_color ? $preset_background_color : $custom_background_color;
	}

	// Gradients.
	if ( in_array( 'gradient', $types, true ) ) {
		$preset_gradient_color          = array_key_exists( 'gradient', $block_attributes ) ? "var:preset|gradient|{$block_attributes['gradient']}" : null;
		$custom_gradient_color          = isset( $block_attributes['style']['color']['gradient'] ) ? $block_attributes['style']['color']['gradient'] : null;
		$color_block_styles['gradient'] = $preset_gradient_color ? $preset_gradient_color : $custom_gradient_color;
	}

	return wp_style_engine_get_styles( array( 'color' => $color_block_styles ), array( 'convert_vars_to_classnames' => true ) );
}
