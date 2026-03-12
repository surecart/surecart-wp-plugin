<?php

namespace SureCart\WordPress;

/**
 * Handles theme-related functionality.
 */
class ThemeService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// add the "Brand" color to the theme's color palette.
		add_action( 'after_setup_theme', [ $this, 'addColorToPalette' ], 99999 );
		add_action( 'after_setup_theme', [ $this, 'addAppearanceToolsSupport' ], 99999 );
		// add the theme class to the body tag.
		add_filter( 'body_class', [ $this, 'themeBodyClass' ] );
		add_filter( 'admin_body_class', [ $this, 'themeBodyClassAdmin' ] );
	}

	/**
	 * Get the current theme preference.
	 *
	 * Reads from brand.theme (API) as the primary source.
	 * Falls back to the WP option if the API data is unavailable.
	 *
	 * @return string 'light' or 'dark'
	 */
	public function mode(): string {
		$brand = \SureCart::account()->brand;

		if ( ! empty( $brand ) && ! is_wp_error( $brand ) && ! empty( $brand->theme ) ) {
			return 'dark' === $brand->theme ? 'dark' : 'light';
		}

		return get_option( 'surecart_theme', 'light' );
	}

	/**
	 * Get the logo URL based on the current theme.
	 *
	 * Returns the dark logo URL when theme is dark and a dark logo exists,
	 * otherwise returns the standard logo URL.
	 *
	 * @return string The logo URL.
	 */
	public function logoUrl(): string {
		$brand = \SureCart::account()->brand;

		if ( empty( $brand ) || is_wp_error( $brand ) ) {
			return '';
		}

		if ( 'dark' === ( $brand->theme ?? '' ) && ! empty( $brand->dark_logo->url ) ) {
			return $brand->dark_logo->url;
		}

		return $brand->logo_url ?? '';
	}

	/**
	 * Get the brand color based on the current theme.
	 *
	 * Returns the dark color when theme is dark and a dark color exists,
	 * otherwise returns the standard brand color.
	 *
	 * @return string The brand color hex value (without #).
	 */
	public function brandColor(): string {
		$brand = \SureCart::account()->brand;

		if ( empty( $brand ) || is_wp_error( $brand ) ) {
			return '000000';
		}

		if ( 'dark' === ( $brand->theme ?? '' ) && ! empty( $brand->dark_color ) ) {
			return $brand->dark_color;
		}

		return $brand->color ?? '000000';
	}

	/**
	 * Add support for Appearance Tools.
	 *
	 * @return void
	 */
	public function addAppearanceToolsSupport() {
		add_theme_support( 'appearance-tools' );
		add_theme_support( 'border' );
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
			$classes .= ' surecart-theme-' . $this->mode();
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
		$classes[] = 'surecart-theme-' . $this->mode();
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
	 * Should load on demand block assets setting & functionality or not?
	 *
	 * @return boolean
	 */
	public function shouldLoadOnDemandBlockAssets() {
		$wp_version     = wp_get_wp_version();
		$is_block_theme = (bool) wp_is_block_theme();

		if ( empty( $wp_version ) || $is_block_theme ) {
			return false;
		}

		if ( version_compare( $wp_version, '6.8', '>' ) ) {
			return false;
		}

		return true;
	}
}
