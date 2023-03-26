<?php

namespace SureCart\WordPress\Assets;

use SureCart\Models\ManualPaymentMethod;
use SureCart\Models\Processor;

/**
 * Handles the component theme.
 */
class ScriptsService {
	/**
	 * Holds the service container
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * Make sure we change the script loader tag for esm loading.
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function __construct( $container ) {
		$this->container = $container;

		// add module to components tag.
		add_filter( 'script_loader_tag', [ $this, 'componentsTag' ], 10, 3 );
	}

	/**
	 * Add module to the components tag
	 *
	 * @param string $tag Tag output.
	 * @param string $handle Script handle.
	 * @param string $source Script source.
	 *
	 * @return string
	 */
	public function componentsTag( $tag, $handle, $source ) {
		if ( 'surecart-components' !== $handle || ! $source ) {
			return $tag;
		}
		// don't use javascript module if we are not using esm loader.
		if ( ! \SureCart::assets()->usesEsmLoader() ) {
			return $tag;
		}

		// make sure our translations do not get stripped.
		$translations = wp_scripts()->print_translations( $handle, false );
		if ( $translations ) {
			$translations = sprintf( "<script%s id='%s-js-translations'>\n%s\n</script>\n", " type='text/javascript'", esc_attr( $handle ), $translations );
		}

		// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
		return '<script src="' . esc_url_raw( $source ) . '" type="module"></script>' . $translations;
	}

	/**
	 * Register the component scripts and translations.
	 *
	 * @return void
	 */
	public function register() {
		// should we use the esm loader directly?
		if ( \SureCart::assets()->usesEsmLoader() ) {
			wp_register_script(
				'surecart-components',
				trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/surecart/surecart.esm.js',
				[ 'wp-i18n' ],
				filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/surecart/surecart.esm.js' ) . '-' . \SureCart::plugin()->version(),
				false
			);
		} else {
			// instead, use a static loader that injects the script at runtime.
			$static_assets = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/static-loader.asset.php';
			wp_register_script(
				'surecart-components',
				trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/static-loader.js',
				array_merge( [ 'wp-i18n' ], $static_assets['dependencies'] ),
				$static_assets['version'] . '-' . \SureCart::plugin()->version(),
				true
			);
			wp_localize_script(
				'surecart-components',
				'surecartComponents',
				[
					'url' => trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/surecart/surecart.esm.js?ver=' . filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/surecart/surecart.esm.js' ),
				]
			);
		}

		wp_set_script_translations( 'surecart-components', 'surecart' );

		// core-data.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/data.asset.php';
		wp_register_script(
			'sc-core-data',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/store/data.js',
			array_merge( [ 'surecart-components' ], $asset_file['dependencies'] ),
			$asset_file['version'] . '-' . \SureCart::plugin()->version(),
			true
		);

		// ui.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/ui.asset.php';
		wp_register_script(
			'sc-ui-data',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/store/ui.js',
			array_merge( [ 'surecart-components' ], $asset_file['dependencies'] ),
			$asset_file['version'] . '-' . \SureCart::plugin()->version(),
			true
		);

		$this->registerBlocks();

		wp_localize_script( 'surecart-cart-blocks', 'scIcons', [ 'path' => esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . 'dist/icon-assets' ) ] );
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/cart.asset.php';
		$deps       = $asset_file['dependencies'];
		// fix bug in deps array.
		$deps[ array_search( 'wp-blockEditor', $deps ) ] = 'wp-block-editor';
		wp_register_script(
			'surecart-cart-blocks',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/blocks/cart.js',
			array_merge( [ 'surecart-components' ], $deps ),
			$asset_file['version'] . '-' . \SureCart::plugin()->version(),
			true
		);
		wp_localize_script(
			'surecart-cart-blocks',
			'scBlockData',
			[
				'currency' => \SureCart::account()->currency,
				'theme'    => get_option( 'surecart_theme', 'light' ),
			]
		);

		wp_localize_script( 'surecart-cart-blocks', 'scIcons', [ 'path' => esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . 'dist/icon-assets' ) ] );

		// cart.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/cart.asset.php';
		$deps       = $asset_file['dependencies'];
		// fix bug in deps array.
		$deps[ array_search( 'wp-blockEditor', $deps ) ] = 'wp-block-editor';
		wp_register_script(
			'surecart-cart-blocks',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/blocks/cart.js',
			array_merge( [ 'surecart-components' ], $deps ),
			$asset_file['version'] . '-' . \SureCart::plugin()->version(),
			true
		);

		wp_localize_script( 'surecart-cart-blocks', 'scIcons', [ 'path' => esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . 'dist/icon-assets' ) ] );

		// regsiter recaptcha.
		wp_register_script( 'surecart-google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . \SureCart::settings()->recaptcha()->getSiteKey(), [], \SureCart::plugin()->version(), true );

		// register stripe if enabled.
		if ( get_option( 'surecart_load_stripe_js', false ) ) {
			wp_enqueue_script( 'surecart-stripe-script', 'https://js.stripe.com/v3', [], \SureCart::plugin()->version(), false );
		}

		// templates.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/templates/admin.asset.php';
		wp_register_script(
			'surecart-templates-admin',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/templates/admin.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}

	/**
	 * Enqueue block front scripts.
	 *
	 * @return void
	 */
	public function enqueueFront() {
		// make sure it is registered.
		$this->register();
		// enqueue it.
		wp_enqueue_script( 'surecart-components' );
		wp_localize_script(
			'surecart-components',
			'scData',
			apply_filters(
				'surecart-components/scData',
				[
					'root_url'            => esc_url_raw( get_rest_url() ),
					'plugin_url'          => \SureCart::core()->assets()->getUrl(),
					'api_url'             => \SureCart::requests()->getBaseUrl(),
					'currency'            => \SureCart::account()->currency,
					'do_not_persist_cart' => is_admin(),
					'theme'               => get_option( 'surecart_theme', 'light' ),
					'pages'               => [
						'dashboard' => \SureCart::pages()->url( 'dashboard' ),
						'checkout'  => \SureCart::pages()->url( 'checkout' ),
					],
					'page_id'             => get_the_ID(),
					'nonce'               => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
					'nonce_endpoint'      => admin_url( 'admin-ajax.php?action=sc-rest-nonce' ),
					'recaptcha_site_key'  => \SureCart::settings()->recaptcha()->getSiteKey(),
				]
			)
		);

		// fix shitty jetpack issues key hijacking issues.
		add_filter(
			'wp_head',
			function() {
				wp_dequeue_script( 'wpcom-notes-common' );
				wp_dequeue_script( 'wpcom-notes-admin-bar' );
				wp_dequeue_style( 'wpcom-notes-admin-bar' );
				wp_dequeue_style( 'noticons' );
			},
			200
		);

		wp_localize_script( 'surecart-components', 'scIcons', [ 'path' => esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . 'dist/icon-assets' ) ] );
	}

	/**
	 * Enqueue editor scripts.
	 *
	 * @return void
	 */
	public function enqueueEditor() {
		$this->enqueueBlocks();
		$this->enqueuePageTemplateEditor();
		$this->enqueueCartBlocks();
	}

	/**
	 * Enqueue page templates.
	 *
	 * @return void
	 */
	public function enqueuePageTemplateEditor() {
		wp_enqueue_script( 'surecart-templates-admin' );
	}

	/**
	 * Enqueue Cart Blocks.
	 *
	 * @return void
	 */
	public function enqueueCartBlocks() {
		// not our post type.
		if ( 'sc_cart' !== get_post_type() ) {
			return;
		}
		wp_enqueue_script( 'surecart-cart-blocks' );
	}

	/**
	 * Register block scripts.
	 *
	 * @return void
	 */
	public function registerBlocks() {
		// blocks.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/library.asset.php';
		$deps       = $asset_file['dependencies'];
		// fix bug in deps array.
		$deps[ array_search( 'wp-blockEditor', $deps ) ] = 'wp-block-editor';
		wp_register_script(
			'surecart-blocks',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/blocks/library.js',
			$deps,
			$asset_file['version'] . '-' . \SureCart::plugin()->version(),
			true
		);

		// localize.
		wp_localize_script(
			'surecart-blocks',
			'scData',
			apply_filters(
				'surecart-components/scData',
				[
					'root_url'            => esc_url_raw( get_rest_url() ),
					'plugin_url'          => \SureCart::core()->assets()->getUrl(),
					'api_url'             => \SureCart::requests()->getBaseUrl(),
					'currency'            => \SureCart::account()->currency,
					'do_not_persist_cart' => is_admin(),
					'theme'               => get_option( 'surecart_theme', 'light' ),
					'pages'               => [
						'dashboard' => \SureCart::pages()->url( 'dashboard' ),
						'checkout'  => \SureCart::pages()->url( 'checkout' ),
					],
					'page_id'             => get_the_ID(),
					'nonce'               => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
					'nonce_endpoint'      => admin_url( 'admin-ajax.php?action=sc-rest-nonce' ),
					'recaptcha_site_key'  => \SureCart::settings()->recaptcha()->getSiteKey(),
				]
			)
		);

		wp_localize_script(
			'surecart-blocks',
			'scBlockData',
			[
				'root_url'             => esc_url_raw( get_rest_url() ),
				'nonce'                => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
				'nonce_endpoint'       => admin_url( 'admin-ajax.php?action=sc-rest-nonce' ),
				'processors'           => (array) Processor::get() ?? [],
				'manualPaymentMethods' => (array) ManualPaymentMethod::get() ?? [],
				'plugin_url'           => \SureCart::core()->assets()->getUrl(),
				'currency'             => \SureCart::account()->currency,
				'theme'                => get_option( 'surecart_theme', 'light' ),
				'entitlements'         => \SureCart::account()->entitlements,
				'upgrade_url'          => \SureCart::config()->links->purchase,
				'beta'                 => [
					'stripe_payment_element' => (bool) get_option( 'sc_stripe_payment_element', false ),
				],
				'pages'                => [
					'dashboard' => \SureCart::pages()->url( 'dashboard' ),
					'checkout'  => \SureCart::pages()->url( 'checkout' ),
				],
			]
		);

		wp_localize_script( 'surecart-blocks', 'scIcons', [ 'path' => esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . 'dist/icon-assets' ) ] );
	}

	/**
	 * Enqueue blocks scripts.
	 *
	 * @return void
	 */
	public function enqueueBlocks() {
		wp_enqueue_script( 'surecart-blocks' );
	}
}
