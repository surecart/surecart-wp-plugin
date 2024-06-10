<?php

namespace SureCart\WordPress\Shortcodes;

/**
 * The shortcodes service.
 */
class ShortcodesService {
	/**
	 * Convert the block
	 *
	 * @param string $name Block name.
	 * @param string $block Block class.
	 * @param array  $defaults Default attributes.
	 *
	 * @return string
	 */
	public function registerBlockShortcode( $name, $class, $defaults = [] ) {
		add_shortcode(
			$name,
			function( $attributes, $content ) use ( $name, $class, $defaults ) {
				return ( new ShortcodesBlockConversionService( $attributes, $content ) )->convert(
					$name,
					$class,
					$defaults
				);
			},
			10,
			2
		);
	}

	/**
	 * Register shortcode by name
	 *
	 * @param string $name Name of the shortcode.
	 * @param string $block_name The registered block name.
	 * @param array  $defaults Default attributes.
	 *
	 * @return void
	 */
	public function registerBlockShortcodeByName( $name, $block_name, $defaults = [] ) {
		add_shortcode(
			$name,
			function( $attributes, $content ) use ( $name, $block_name, $defaults ) {
				// convert comma separated attributes to array.
				if ( is_array( $attributes ) ) {
					foreach ( $attributes as $key => $value ) {
						if ( strpos( $value, ',' ) !== 0 && isset( $defaults[ $key ] ) && is_array( $defaults[ $key ] ) ) {
							$attributes[ $key ] = explode( ',', $value );
						}
					}
				}

				$shortcode_attrs = wp_parse_args(
					$attributes,
					$defaults
				);

				$shortcode_attrs = apply_filters( "shortcode_atts_{$name}", $shortcode_attrs, $shortcode_attrs, $shortcode_attrs, $name );
				
				if ( ! empty( $block_name ) && 'surecart/product-list' === $block_name ) {
					return wp_interactivity_process_directives( \SureCart::block()->productListMigration( $shortcode_attrs )->render() );
				}

				return wp_interactivity_process_directives(
					do_blocks( '<!-- wp:' . $block_name . ' ' . wp_json_encode( $shortcode_attrs, JSON_FORCE_OBJECT ) . ' -->' . do_shortcode($content) . '<!-- /wp:' . $block_name . ' -->')
				);
			}
		);
	}
}
