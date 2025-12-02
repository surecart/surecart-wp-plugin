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
		// we have product context.
		if ( get_query_var( 'surecart_current_product' ) ) {
			$context['surecart/product'] = sc_get_product();
		}

		// pass a unique id to each product list block.
		if ( 'surecart/product-list' === $parsed_block['blockName'] ) {
			// we use our own counter to ensure uniqueness so that product page urls don't have ids.
			global $sc_query_id;
			$sc_query_id = sc_unique_product_list_id();
		}

		// pass a unique id to each product list block.
		if ( 'surecart/product-page' === $parsed_block['blockName'] ) {
			// we use our own counter to ensure uniqueness so that product page urls don't have ids.
			global $sc_query_id;
			$sc_query_id = sc_unique_product_page_id();
		}
		return $context;
	},
	10,
	2
);

/**
 * Register all css at src/styles folder.
 */
add_action(
	'init',
	function () {
		$css_files = glob( __DIR__ . '/build/styles/*.css' ) ?? [];

		foreach ( $css_files as $css_file ) {
			// Extract the file name without the extension and prepend with 'surecart-'.
			$handle = 'surecart-' . basename( $css_file, '.css' );

			wp_register_style(
				$handle,
				plugins_url( 'build/styles/' . basename( $css_file ), __FILE__ ),
				[],
				filemtime( $css_file )
			);
		}
	}
);

add_action(
	'wp_footer',
	function () {
		// if lightbox is enqueued, then add the lightbox markup.
		if ( ! wp_style_is( 'surecart-lightbox', 'enqueued' ) ) {
			return;
		}

		$close_button_label = esc_attr__( 'Close' );
		$dialog_label       = esc_attr__( 'Enlarged images' );
		$prev_button_label  = esc_attr__( 'Previous' );
		$next_button_label  = esc_attr__( 'Next' );

		// If the current theme does NOT have a `theme.json`, or the colors are not
		// defined, it needs to set the background color & close button color to some
		// default values because it can't get them from the Global Styles.
		$background_color   = '#fff';
		$close_button_color = '#000';
		if ( wp_theme_has_theme_json() ) {
			$global_styles_color = wp_get_global_styles( array( 'color' ) );
			if ( ! empty( $global_styles_color['background'] ) ) {
				$background_color = esc_attr( $global_styles_color['background'] );
			}
			if ( ! empty( $global_styles_color['text'] ) ) {
				$close_button_color = esc_attr( $global_styles_color['text'] );
			}
		}

		echo <<<HTML
		<div
			class="sc-lightbox-overlay zoom"
			aria-label="$dialog_label"
			data-wp-interactive="surecart/lightbox"
			data-wp-bind--role="state.roleAttribute"
			data-wp-bind--aria-modal="state.ariaModal"
			data-wp-class--active="state.overlayEnabled"
			data-wp-class--show-closing-animation="state.showClosingAnimation"
			data-wp-watch="callbacks.setOverlayFocus"
			data-wp-on--keydown="actions.handleKeydown"
			data-wp-on-async--touchstart="actions.handleTouchStart"
			data-wp-on--touchmove="actions.handleTouchMove"
			data-wp-on-async--touchend="actions.handleTouchEnd"
			data-wp-on-async--click="actions.hideLightbox"
			data-wp-on-async-window--resize="callbacks.setOverlayStyles"
			data-wp-on-async-window--scroll="actions.handleScroll"
			tabindex="-1"
			>
				<button type="button" aria-label="$close_button_label" style="fill: $close_button_color" class="sc-lightbox-close-button">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z"></path></svg>
				</button>
				<button type="button" aria-label="$prev_button_label" style="fill: $close_button_color" class="sc-lightbox-prev-button" data-wp-bind--hidden="!state.hasNavigation" data-wp-on--click="actions.showPreviousImage" data-wp-bind--aria-disabled="!state.hasPreviousImage">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path d="M14.6 7l-1.2-1L8 12l5.4 6 1.2-1-4.6-5z"></path></svg>
				</button>
				<button type="button" aria-label="$next_button_label" style="fill: $close_button_color" class="sc-lightbox-next-button" data-wp-bind--hidden="!state.hasNavigation" data-wp-on--click="actions.showNextImage" data-wp-bind--aria-disabled="!state.hasNextImage">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path d="M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z"></path></svg>
				</button>
				<div class="sc-lightbox-image-container">
					<figure>
						<img data-wp-bind--alt="state.currentImage.alt" data-wp-bind--class="state.currentImage.imgClassNames" data-wp-bind--style="state.imgStyles" data-wp-bind--src="state.currentImage.currentSrc">
					</figure>
				</div>
				<div class="sc-lightbox-image-container">
					<figure>
						<img data-wp-bind--alt="state.currentImage.alt" data-wp-bind--class="state.currentImage.imgClassNames" data-wp-bind--style="state.imgStyles" data-wp-bind--src="state.enlargedSrc">
					</figure>
				</div>
				<div data-wp-watch="callbacks.setScreenReaderText" aria-live="polite" aria-atomic="true" class="lightbox-speak screen-reader-text"></div>
				<div class="scrim" style="background-color: $background_color" aria-hidden="true"></div>
				<style data-wp-text="state.overlayStyles"></style>
		</div>
	HTML;
	},
);

add_action(
	'init',
	function () {
		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/fetch/index.asset.php';
		wp_register_script_module(
			'@surecart/api-fetch',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/fetch/index.js',
			$static_assets['dependencies'],
			$static_assets['version']
		);

		add_action(
			'wp_footer',
			function () {
				?>
				<script>
					window.scFetchData =
					<?php
					echo wp_json_encode(
						[
							'root_url'       => esc_url_raw( get_rest_url() ),
							'nonce'          => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
							'nonce_endpoint' => admin_url( 'admin-ajax.php?action=sc-rest-nonce' ),
						]
					);
					?>
				</script>
				<?php
			}
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
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/a11y/index.asset.php';
		wp_register_script_module(
			'@surecart/a11y',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/a11y/index.js',
			array(),
			$static_assets['version']
		);

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/dropdown/index.asset.php';
		wp_register_script_module(
			'@surecart/dropdown',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/dropdown/index.js',
			array(
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
			[
				[
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				],
				[
					'id'     => '@surecart/checkout-service',
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
				[
					'id'     => '@surecart/a11y',
					'import' => 'dynamic',
				],
			],
			$static_assets['version']
		);

		// Sticky purchase button interactivity script.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/sticky-purchase/index.asset.php';
		wp_register_script_module(
			'@surecart/sticky-purchase',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/sticky-purchase/index.js',
			array(
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/product-page',
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
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				],
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

		// instead, use a static loader that injects the script at runtime.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/lightbox/index.asset.php';
		wp_register_script_module(
			'surecart/lightbox',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/lightbox/index.js',
			array(
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/video/index.asset.php';
		wp_register_script_module(
			'@surecart/video',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/video/index.js',
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
				array(
					'id'     => '@wordpress/interactivity',
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
			[],
			$static_assets['version']
		);

		// Cart side drawer.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/cart/index.asset.php';
		wp_register_script_module(
			'@surecart/cart',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/cart/index.js',
			array(
				array(
					'id'     => '@surecart/checkout',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/checkout-events',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// Product Quick View.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/product-quick-view/index.asset.php';
		wp_register_script_module(
			'@surecart/product-quick-view',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/product-quick-view/index.js',
			array(
				array(
					'id'     => '@surecart/checkout',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/product-page',
					'import' => 'dynamic',
				),
				array(
					'id'     => 'surecart/lightbox',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/image-slider',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/checkout-events',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@wordpress/interactivity-router',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// Cart side drawer.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/sidebar/index.asset.php';
		wp_register_script_module(
			'@surecart/sidebar',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/sidebar/index.js',
			array(
				array(
					'id'     => '@wordpress/interactivity',
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
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/checkout-service',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/checkout-events',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/google-events',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/facebook-events',
					'import' => 'dynamic',
				),
				array(
					'id'     => '@surecart/a11y',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);

		// Line Item Note.
		$static_assets = include trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/scripts/line-item-note/index.asset.php';
		wp_register_script_module(
			'@surecart/line-item-note',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/scripts/line-item-note/index.js',
			array(
				array(
					'id'     => '@wordpress/interactivity',
					'import' => 'dynamic',
				),
			),
			$static_assets['version']
		);
	},
	10,
	3
);
