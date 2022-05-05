<?php

namespace SureCart\WordPress\Assets;

/**
 * Handles the component theme.
 */
class StylesService {
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
	}

	/**
	 * Register the default theme.
	 *
	 * @return void
	 */
	public function register() {
		wp_register_style(
			'surecart-themes-default',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/surecart/surecart.css',
			[],
			filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/surecart/surecart.css' ),
		);
	}

	/**
	 * Enqueue the front styles.
	 *
	 * @return void
	 */
	public function enqueueFront() {
		// make sure it is registered.
		$this->register();
		// enqueue it.
		wp_enqueue_style( 'surecart-themes-default' );
		// add our inline brand styles.
		$this->addInlineBrandStyles();
	}

	/**
	 * Enqueue the editor styles.
	 *
	 * @return void
	 */
	public function enqueueEditor() {
		// make sure it is registered.
		$this->register();
		// enqueue it.
		wp_enqueue_style( 'surecart-themes-default' );
		// add our inline brand styles.
		$this->addInlineBrandStyles();
	}

	/**
	 * Add inline brand styles to theme.
	 *
	 * @return void
	 */
	public function addInlineBrandStyles() {
		$brand = \SureCart::account()->brand;

		$style = file_get_contents( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'dist/blocks/cloak.css' );

		$style .= ':root {';
		$style .= '--sc-color-primary-500: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '--sc-focus-ring-color-primary: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '--sc-input-border-color-focus: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '}';

		wp_add_inline_style(
			'surecart-themes-default',
			$style
		);
	}
}
