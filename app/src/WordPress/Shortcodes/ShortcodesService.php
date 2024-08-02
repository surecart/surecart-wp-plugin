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
	 * @param string $block Block block.
	 * @param array  $defaults Default attributes.
	 *
	 * @return void
	 */
	public function registerBlockShortcode( $name, $block, $defaults = array() ) {
		add_shortcode(
			$name,
			function ( $attributes, $content ) use ( $name, $block, $defaults ) {
				return ( new ShortcodesBlockConversionService( $attributes, $content ) )->convert(
					$name,
					$block,
					$defaults
				);
			},
			10,
			2
		);
	}

	/**
	 * Render shortcode
	 *
	 * @param array  $attributes Attributes.
	 * @param string $name Name.
	 *
	 * @return string
	 */
	public function renderShortcode( $attributes, $name ) {
		// Build the shortcode string dynamically.
		$shortcode_parts = array( '[' . esc_attr( $name ) );

		// Add each attribute to the shortcode string.
		foreach ( $attributes as $key => $value ) {
			$shortcode_parts[] = esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
		}

		// Close the shortcode.
		$shortcode_parts[] = ']';

		// Join the parts into a single string.
		return implode( ' ', $shortcode_parts );
	}

	/**
	 * Check if shortcode should render itself
	 *
	 * @param string $name Name of the shortcode.
	 * @return boolean
	 */
	public function shouldRenderShortcodeItself( $name ) {
		if ( ! is_admin() || 'sc_product_list' !== $name ) { // If we are not in the admin or the shortcode is not Product List, return false.
			return false;
		}

		if ( \Elementor\Plugin::instance()->editor->is_edit_mode() ) {
			return true;
		}
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
				if ( $this->shouldRenderShortcodeItself( $name ) ) { // If we are in the editor of any Page Builders & Block is Product List, render the shortcode itself.
					return $this->renderShortcode( $attributes, $name );
				}
				
				wp_enqueue_global_styles(); // Enqueue global styles.
				add_filter( 'should_load_separate_core_block_assets', '__return_false', 11 ); // Disable loading separate core block assets.

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
