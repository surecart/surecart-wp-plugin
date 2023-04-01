<?php

namespace SureCart\WordPress;

use SureCartCore\ServiceProviders\ServiceProviderInterface;
use SureCart\Models\Form;

/**
 * Register translations.
 */
class ThemeServiceProvider implements ServiceProviderInterface {

	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		// add the "Brand" color to the theme's color palette.
		add_action( 'after_setup_theme', [ $this, 'addColorToPalette' ], 99999 );
		// add the theme class to the body tag.
		add_filter( 'body_class', [ $this, 'themeBodyClass' ] );
		add_filter( 'admin_body_class', [ $this, 'themeBodyClassAdmin' ] );
		add_filter( 'wp_nav_menu_items', [ $this, 'addCartMenu' ], 10, 2 );
	}

	/**
	 * Add Theme to body class admin.
	 *
	 * @param string $classes String of classes.
	 *
	 * @return string
	 */
	public function themeBodyClassAdmin( $classes ) {
		global $pagenow;
		if ( 'post.php' === $pagenow ) {
			$classes .= ' surecart-theme-' . get_option( 'surecart_theme', 'light' );
		}
		return $classes;
	}

	/**
	 * Add our theme class to the body tag.
	 *
	 * @param array $classes Array of body classes.
	 *
	 * @return array
	 */
	public function themeBodyClass( $classes ) {
		$classes[] = 'surecart-theme-' . get_option( 'surecart_theme', 'light' );
		return $classes;
	}

	/**
	 * Add our color to the palette.
	 *
	 * @return void
	 */
	public function addColorToPalette() {
		// Try to get the current theme default color palette.
		$old_color_palette = current( (array) get_theme_support( 'editor-color-palette' ) );

		// Get default core color palette from wp-includes/theme.json.
		if ( false === $old_color_palette && class_exists( 'WP_Theme_JSON_Resolver' ) ) {
			$settings = \WP_Theme_JSON_Resolver::get_core_data()->get_settings();
			// wp 6.0+.
			if ( isset( $settings['color']['palette']['default'] ) ) {
				$old_color_palette = $settings['color']['palette']['default'];
			}
			// pre wp 6.0.
			if ( isset( $settings['color']['palette']['core'] ) ) {
				$old_color_palette = $settings['color']['palette']['default'];
			}
		}

		// The new colors we are going to add.
		$new_color_palette = [
			[
				'name'  => esc_attr__( 'SureCart', 'surecart' ),
				'slug'  => 'surecart',
				'color' => 'var(--sc-color-primary-500)',
			],
		];

		// Merge the old and new color palettes.
		if ( ! empty( $old_color_palette ) ) {
			$new_color_palette = array_merge( $old_color_palette, $new_color_palette );
		}

		// Apply the color palette containing the original colors and 2 new colors.
		add_theme_support( 'editor-color-palette', $new_color_palette );
	}

	/**
	 * Add cart to menu.
	 *
	 * @param array  $items Menu items.
	 * @param object $args Menu args.
	 *
	 * @return array
	 */
	public function addCartMenu( $items, $args ) {
		$cart_menu_id      = get_option( 'surecart_cart_menu_selected_id', null );
		$cart_menu_enabled = (bool) get_option( 'sc_cart_menu_button_enabled', false );

		if ( ! $cart_menu_enabled || $cart_menu_id != $args->menu->term_id ) {
			return $items;
		}

		$cart_menu_alignment = get_option( 'surecart_cart_menu_alignment', 'left' );
		$form                = \SureCart::forms()->getDefault();
		$mode                = Form::getMode( $form->ID );

		$menu = "<li><sc-cart-button form-id='" . esc_attr( $form->ID ) . "' mode='" . esc_attr( $mode ) . "'/></li>";

		if ( 'right' === $cart_menu_alignment ) {
			$items = $menu . $items;
		} else {
			$items .= $menu;
		}

		return $items;
	}
}
