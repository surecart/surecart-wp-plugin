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
	public function registerBlockShortcode( $name, $class, $defaults = array() ) {
		add_shortcode(
			$name,
			function ( $attributes, $content ) use ( $name, $class, $defaults ) {
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
	public function registerBlockShortcodeByName( $name, $block_name, $defaults = array() ) {
		add_shortcode(
			$name,
			function ( $attributes, $content ) use ( $name, $block_name, $defaults ) {
				if ( empty( $block_name ) ) {
					return '';
				}

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

				// we need to remove this since this is processed twice for some blocks.
				add_filter( 'doing_it_wrong_trigger_error', [ $this, 'removeInteractivityDoingItWrong' ], 10, 2 );

				$content = $this->processBlock( $block_name, $shortcode_attrs, $content );

				remove_filter( 'doing_it_wrong_trigger_error', [ $this, 'removeInteractivityDoingItWrong' ], 10 );

				return $content;
			}
		);
	}

	/**
	 * Process the block
	 *
	 * @param string $block_name Block name.
	 * @param array  $shortcode_attrs Shortcode attributes.
	 * @param string $content Content.
	 *
	 * @return string
	 */
	public function processBlock( $block_name, $shortcode_attrs, $content ) {
		switch ( $block_name ) {
			case 'surecart/product-list':
			case 'surecart/product-collection':
				return wp_interactivity_process_directives( \SureCart::block()->productListMigration( $shortcode_attrs )->render() );

			case 'surecart/product-collection-tags':
				return wp_interactivity_process_directives( \SureCart::block()->productCollectionBadgesMigration( $shortcode_attrs )->render() );

			case 'surecart/product-price':
				return wp_interactivity_process_directives( \SureCart::block()->productSelectedPriceMigration( $shortcode_attrs )->render() );

			case 'surecart/product-price-choices':
				return wp_interactivity_process_directives( \SureCart::block()->productPriceChoicesMigration( $shortcode_attrs )->render() );

			case 'surecart/product-variant-choices':
				return wp_interactivity_process_directives( \SureCart::block()->productVariantsMigration( $shortcode_attrs )->render() );
		}

		return wp_interactivity_process_directives(
			do_blocks( '<!-- wp:' . $block_name . ' ' . wp_json_encode( $shortcode_attrs, JSON_FORCE_OBJECT ) . ' -->' . do_shortcode( $content ) . '<!-- /wp:' . $block_name . ' -->' )
		);
	}

	/**
	 * Remove interactivity doing it wrong
	 *
	 * @param string $trigger Trigger.
	 * @param string $function_name Function name.
	 *
	 * @return string|false
	 */
	public function removeInteractivityDoingItWrong( $trigger, $function_name ) {
		if ( 'WP_Interactivity_API::evaluate' !== $function_name ) {
			return $trigger;
		}
		return false;
	}
}
