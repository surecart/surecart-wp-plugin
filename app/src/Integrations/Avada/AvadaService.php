<?php

namespace SureCart\Integrations\Avada;

/**
 * Controls the Avada integration.
 */
class AvadaService {
	/**
	 * Bootstrap the Avada integration.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueAvadaBlockStyles' ], 999999 ); // must be greater than 999.
		add_action( 'after_setup_theme', [ $this, 'removeClientSideRouting' ] );
	}

	/**
	 * Enqueue the Avada block styles.
	 *
	 * @return void
	 */
	public function enqueueAvadaBlockStyles() {
		wp_enqueue_style( 'global-styles' );
		wp_enqueue_style( 'wp-block-library' );
		wp_enqueue_style( 'wp-block-library-theme' );
		wp_enqueue_style( 'classic-theme-styles' );
	}

	/**
	 * Remove the client-side navigation for Avada.
	 *
	 * @return void
	 */
	public function removeClientSideRouting() {
		$active_theme = wp_get_theme();

		if ( 'Avada' === $active_theme->get( 'Name' ) ) {
			wp_interactivity_config( 'core/router', array( 'clientNavigationDisabled' => true ) );
		}
	}
}
