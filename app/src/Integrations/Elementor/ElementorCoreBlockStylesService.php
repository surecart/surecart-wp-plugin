<?php

namespace SureCart\Integrations\Elementor;

/**
 * Elementor core block styles service.
 * This service is responsible for enqueuing core block styles for our product page
 * as Elementor dequeues them in certain cases resulting in broken styles.
 */
class ElementorCoreBlockStylesService {
	/**
	 * Whether core block styles are enqueued.
	 *
	 * @var array
	 */
	protected $enqueued = [
		'wp-block-library'       => false,
		'wp-block-library-theme' => false,
	];

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// check if core block styles are (should be)enqueued.
		add_action( 'wp_enqueue_scripts', [ $this, 'areCoreBlockStylesEnqueued' ], 900 );
		// enqueue core block styles if they have been dequeued for our product page.
		add_action( 'wp_enqueue_scripts', [ $this, 'maybeEnqueueCoreBlockStyles' ], 9999 );
	}

	/**
	 * Check if core block styles are originally enqueued.
	 * That way we know if we need to re-enqueue them.
	 *
	 * @return void
	 */
	public function areCoreBlockStylesEnqueued() {
		$this->enqueued = [
			'wp-block-library'       => wp_style_is( 'wp-block-library', 'enqueued' ),
			'wp-block-library-theme' => wp_style_is( 'wp-block-library-theme', 'enqueued' ),
		];
	}

	/**
	 * Maybe enqueue core block styles.
	 *
	 * @return void
	 */
	public function maybeEnqueueCoreBlockStyles() {
		// separate core block assets are not loaded, so don't enqueue.
		if ( wp_should_load_separate_core_block_assets() ) {
			return;
		}

		// not a product, so don't enqueue.
		if ( 'sc_product' !== get_post_type() ) {
			return;
		}

		// not originally enqueued, so don't enqueue.
		if ( $this->enqueued['wp-block-library'] ) {
			wp_enqueue_style( 'wp-block-library' );
		}

		// enqueue the theme block library if it's not already enqueued.
		if ( $this->enqueued['wp-block-library-theme'] ) {
			wp_enqueue_style( 'wp-block-library-theme' );
		}
	}
}
