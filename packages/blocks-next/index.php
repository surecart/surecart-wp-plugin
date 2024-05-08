<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register all blocks.
 */
add_action(
	'init',
	function() {
		foreach ( glob( __DIR__ . '/build/blocks/**/block.json' ) as $file ) {
			register_block_type( dirname( $file ) );
		}
	}
);

/**
 * Use our controller view pattern.
 */
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

			if ( ! $view ) {
				return '';
			}

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
	11,
	2
);

add_filter( 'render_block_context', function( $context, $parsed_block, $parent_block ) {
	// we are passing an id.
	if ( $parsed_block['blockName'] === 'surecart/product-page' && !empty($parsed_block['attrs']['product_id']) ) {
		$product = \SureCart\Models\Product::with( array( 'image', 'prices', 'product_medias', 'product_media.media', 'variants', 'variant_options' ) )->find( $parsed_block['attrs']['product_id'] );
		set_query_var('surecart_current_product', $product);
	}

	// we have product context.
	if ( get_query_var('surecart_current_product') ) {
		$context['surecart/product'] = get_query_var( 'surecart_current_product' );
	}

	// add context for required blocks.
	if ( $parsed_block['blockName'] === 'surecart/product-page' ) {
		$context['surecart/has-ad-hoc-block'] = !empty(wp_get_first_block([$parsed_block], 'surecart/product-selected-price-ad-hoc-amount'));
		$context['surecart/has-variant-choices'] = !empty(wp_get_first_block([$parsed_block], 'surecart/product-variant-choices-v2'));
	}

	// cart sidebar context.
	if ( $parsed_block['blockName'] === 'surecart/cart-v2' ) {
		$context['surecart/cart-v2/blockId'] = wp_unique_id();
	}

	return $context;
}, 10, 3 );


add_action('init', function() {
	// instead, use a static loader that injects the script at runtime.
	$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/fetch/index.asset.php';
	wp_register_script_module(
		'@surecart/api-fetch',
		trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/fetch/index.js',
		[],
		$static_assets['version']
	);

	// instead, use a static loader that injects the script at runtime.
	$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/dialog/index.asset.php';
	wp_register_script_module(
		'@surecart/dialog',
		trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/dialog/index.js',
		[
			[
				'id' => '@wordpress/interactivity',
				'import' => 'dynamic'
			]
		],
		$static_assets['version']
	);

	// instead, use a static loader that injects the script at runtime.
	$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/product-page/index.asset.php';
	wp_register_script_module(
		'@surecart/product-page',
		trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/product-page/index.js',
		[
			[
				'id' => '@surecart/dialog',
				'import' => 'dynamic'
			]
		],
		$static_assets['version']
	);
});
