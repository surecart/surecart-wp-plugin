<?php

namespace SureCart\WordPress\Shortcodes;

/**
 * The shortcodes service.
 */
class ShortcodesService {

	/**
	 * Old Shortcode block names which we want to not render through interactivity.
	 *
	 * @var array
	 */
	protected $old_shortcode_block_names = [
		'surecart/product-buy-button-old',
		'surecart/product-price-choices',
		'surecart/product-title-old',
		'surecart/product-price',
		'surecart/product-description-old',
		'surecart/product-variant-choices',
		'surecart/product-quantity-old',
		'surecart/product-media-old',
	];

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

				if ( in_array( $block_name, $this->old_shortcode_block_names, true ) && ! empty( $shortcode_attrs['id'] ) ) {
					// translators: %s is the shortcode name.
					wp_trigger_error( '', sprintf( esc_html__( 'Passing an id to the [%s] shortcode is deprecated. Please use these shortcodes on product pages directly.', 'surecart' ), $name ) );
						$block = new \WP_Block(
							[
								'blockName'    => $block_name,
								'attrs'        => $shortcode_attrs,
								'innerContent' => do_shortcode( $content ),
							]
						);
						return $block->render();
				}

				if ( ! empty( $block_name ) ) {
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
				}

				if ( ! empty( $block_name ) && ( 'surecart/product-list' === $block_name || 'surecart/product-collection' === $block_name ) ) {
					return wp_interactivity_process_directives( \SureCart::block()->productListMigration( $shortcode_attrs )->render() );
				}

				return wp_interactivity_process_directives(
					do_blocks( '<!-- wp:' . $block_name . ' ' . wp_json_encode( $shortcode_attrs, JSON_FORCE_OBJECT ) . ' -->' . do_shortcode( $content ) . '<!-- /wp:' . $block_name . ' -->' )
				);
			}
		);
	}
}
