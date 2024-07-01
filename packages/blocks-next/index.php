<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register all blocks.
 */
add_action(
	'init',
	function () {
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
	function ( $settings, $metadata ) {
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

add_filter(
	'render_block_context',
	function ( $context, $parsed_block ) {
		// we are passing an id.
		if ( 'surecart/product-page' === $parsed_block['blockName'] && ! empty( $parsed_block['attrs']['product_id'] ) ) {
			$product_post_ids = get_posts(
				array(
					'post_type'      => 'sc_product',
					'status'         => 'publish',
					'fields'         => 'ids',
					'posts_per_page' => -1,
					'meta_query'     => array(
						array(
							'key'     => 'sc_id',
							'value'   => array( $parsed_block['attrs']['product_id'] ),
							'compare' => 'IN',
						),
					),
				)
			);
			$product          = sc_get_product( $product_post_ids[0] ?? 0 );
			set_query_var( 'surecart_current_product', $product );
		}

		// we have product context.
		if ( get_query_var( 'surecart_current_product' ) ) {
			$context['surecart/product'] = sc_get_product();
		}

		// pass a unique id to each product list block.
		if ( 'surecart/product-list' === $parsed_block['blockName'] ) {
			$context['surecart/product-list/block_id'] = wp_unique_id();
		}

		// add context for required blocks.
		if ( 'surecart/product-page' === $parsed_block['blockName'] ) {
			$context['surecart/has-ad-hoc-block']    = ! empty( wp_get_first_block( array( $parsed_block ), 'surecart/product-selected-price-ad-hoc-amount' ) );
			$context['surecart/has-variant-choices'] = ! empty( wp_get_first_block( array( $parsed_block ), 'surecart/product-variant-choices-v2' ) );
		}

		return $context;
	},
	10,
	2
);


add_action(
	'init',
	function () {
		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/fetch/index.asset.php';
		wp_register_script_module(
			'@surecart/api-fetch',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/fetch/index.js',
			array(
				array(
					'id'     => 'wp-url',
					'import' => 'dynamic',
				),
				array(
					'id'     => 'wp-api-fetch',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/dialog/index.asset.php';
		wp_register_script_module(
			'@surecart/dialog',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/dialog/index.js',
			array(
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/dropdown/index.asset.php';
		wp_register_script_module(
			'@surecart/dropdown',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/dropdown/index.js',
			array(
				array(
					'id'     => '@surecart/dialog',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/google/index.asset.php';
		wp_register_script_module(
			'@surecart/google-events',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/google/index.js',
			[],
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/facebook/index.asset.php';
		wp_register_script_module(
			'@surecart/facebook-events',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/facebook/index.js',
			[],
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/product-page/index.asset.php';
		wp_register_script_module(
			'@surecart/product-page',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/product-page/index.js',
			array(
				array(
					'id'     => '@surecart/dialog',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/product-list/index.asset.php';
		wp_register_script_module(
			'@surecart/product-list',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/product-list/index.js',
			[
				[
					'id'     => '@wordpress/interactivity-router',
					'import' => 'dynamic',
				],
				[
					'id'     => '@surecart/google-events',
					'import' => 'dynamic',
				],
				[
					'id'     => '@surecart/facebook-events',
					'import' => 'dynamic',
				],
			],
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/image-slider/index.asset.php';
		wp_register_script_module(
			'@surecart/image-slider',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/image-slider/index.js',
			array(
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// Checkout actions.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/checkout-actions/index.asset.php';
		wp_register_script_module(
			'@surecart/checkout-service',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/checkout-actions/index.js',
			array(
				array(
					'id'     => '@surecart/api-fetch',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// Checkout events.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/checkout-events/index.asset.php';
		wp_register_script_module(
			'@surecart/checkout-events',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/checkout-events/index.js',
			array(
				array(
					'id'     => '@surecart/api-fetch',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// Cart side drawer.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/cart/index.asset.php';
		wp_register_script_module(
			'@surecart/cart',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/cart/index.js',
			array(
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
				array(
					'id'     => 'wp-i18n',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// SureCart Checkout.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/checkout/index.asset.php';
		wp_register_script_module(
			'@surecart/checkout',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/checkout/index.js',
			array(
				array(
					'id'     => '@surecart/checkout-service',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/checkout-events',
					'import' => 'dynamic',
				),
				[
					'id'     => '@surecart/google-events',
					'import' => 'dynamic',
				],
				[
					'id'     => '@surecart/facebook-events',
					'import' => 'dynamic',
				],
				array(
					'id'     => '@surecart/cart',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);
	},
	10,
	3
);
