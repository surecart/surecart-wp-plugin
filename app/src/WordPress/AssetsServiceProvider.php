<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register and enqueues assets.
 */
class AssetsServiceProvider implements ServiceProviderInterface {
	/**
	 * Holds the service container
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$this->container = $container;

		// add module to components tag.
		add_filter( 'script_loader_tag', [ $this, 'componentsTag' ], 10, 3 );

		// register component scripts.
		add_action( 'init', [ $this, 'registerComponents' ] );

		// enqueue assets on front end and editor.
		add_action( 'enqueue_block_editor_assets', [ $this, 'editorAssets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'frontAssets' ] );
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
		if ( 'checkout-engine/components' !== $handle ) {
			return $tag;
		}

		// phpcs:ignore
		return '<script src="' . $source . '" type="module" defer></script>';
	}

	/**
	 * Registers the components script module
	 *
	 * @return void
	 */
	public function registerComponents() {
		$this->registerComponentScripts();
		$this->registerDefaultTheme();
	}

	/**
	 * Register the default theme
	 *
	 * @return void
	 */
	public function registerDefaultTheme() {
		wp_register_style(
			'checkout-engine/themes/default',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/components/checkout-engine/checkout-engine.css',
			[],
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/checkout-engine/checkout-engine.css' ),
		);
	}

	/**
	 * Register the component scripts
	 *
	 * @return void
	 */
	public function registerComponentScripts() {
		wp_register_script(
			'checkout-engine/components',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/components/checkout-engine/checkout-engine.esm.js',
			[],
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/checkout-engine/checkout-engine.esm.js' ),
			true
		);
	}

	/**
	 * Enqueue default theme
	 *
	 * @return void
	 */
	public function enqueueDefaultTheme() {
		 wp_enqueue_style( 'checkout-engine/themes/default' );
	}

	/**
	 * Enqueue components
	 *
	 * @return void
	 */
	public function enqueueComponents() {
		wp_enqueue_script( 'checkout-engine/components' );
	}

	/**
	 * Enqueue default theme
	 *
	 * @return void
	 */
	public function editorAssets() {
		$asset_file = include trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/blocks.asset.php';

		\CheckoutEngine::core()->assets()->enqueueScript(
			'checkout-engine/blocks',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/blocks/blocks.js',
			array_merge( [ 'checkout-engine/components' ], $asset_file['dependencies'] ),
			$asset_file['version']
		);

		$this->enqueueDefaultTheme();
	}

	/**
	 * Output front-end assets
	 *
	 * @return void
	 */
	public function frontAssets() {
		// TODO: only enqueue when block renders.
		$this->enqueueComponents();
		$this->enqueueDefaultTheme();
	}
}
