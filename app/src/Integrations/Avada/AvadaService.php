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
	public function bootstrap(): void {
		add_action( 'after_setup_theme', [ $this, 'init' ] );
	}

	/**
	 * Check if Avada theme is active.
	 *
	 * @return bool
	 */
	private function isAvadaThemeActive(): bool {
		$active_theme = wp_get_theme();
		return 'Avada' === $active_theme->get( 'Name' );
	}

	/**
	 * Initialize the Avada integration.
	 *
	 * @return void
	 */
	public function init(): void {
		if ( ! $this->isAvadaThemeActive() ) {
			return;
		}

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueAvadaBlockStyles' ], 999999 ); // must be greater than 999.
		add_action( 'render_block', [ $this, 'balanceBlockTagsForAvada' ], 10, 2 );
	}

	/**
	 * Enqueue the Avada block styles.
	 *
	 * @return void
	 */
	public function enqueueAvadaBlockStyles(): void {
		wp_enqueue_style( 'global-styles' );
		wp_enqueue_style( 'wp-block-library' );
		wp_enqueue_style( 'wp-block-library-theme' );
		wp_enqueue_style( 'classic-theme-styles' );
	}

	/**
	 * Balance block tags for Avada.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block         The block.
	 *
	 * @return string
	 */
	public function balanceBlockTagsForAvada( string $block_content, array $block ) {
		return balanceTags( $block_content, true );
	}
}
