<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register and enqueues assets.
 */
class AssetsServiceProvider implements ServiceProviderInterface {
	protected $container;

	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		$this->container = $container;
		add_action( 'wp_enqueue_scripts', [ $this, 'registerComponents' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'registerComponents' ] );
		add_filter( 'script_loader_tag', [ $this, 'componentsTag' ], 10, 3 );

		add_action( 'enqueue_block_editor_assets', [ $this, 'editorAssets' ] );
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
		if ( 'checkout-engine-components' === $handle ) {
			// phpcs:ignore
			$tag = '<script src="' . $source . '" type="module" defer></script>';
		}

		return $tag;
	}

	/**
	 * Registers the components script module
	 *
	 * @return void
	 */
	public function registerComponents() {
		wp_register_script(
			'checkout-engine-components',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/dist/components/presto-components/presto-components.esm.js',
			[],
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/dist/components/presto-components/presto-components.esm.js' ),
			true
		);

		// Register styles.
		wp_register_style(
			'checkout-engine-default-theme',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/styles/gutenberg.css',
			[],
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/styles/gutenberg.css' ),
		);
	}

	/**
	 * Enqueue default theme
	 *
	 * @return void
	 */
	public function editorAssets() {
		\CheckoutEngine::core()->assets()->enqueueStyle(
			'checkout-engine-editor',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/styles/gutenberg.css'
		);
	}
}
