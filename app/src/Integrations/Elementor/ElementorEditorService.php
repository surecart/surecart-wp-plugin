<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle elementor editor scripts.
 */
class ElementorEditorService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'elementor/frontend/before_enqueue_styles', [ $this, 'enqueue_editor_assets' ], 1 );
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'show_template_selection_modal' ] );
	}

	/**
	 * Enqueue SureCart editor assets.
	 *
	 * @return void
	 */
	public function enqueue_editor_assets() {
		wp_register_style(
			'surecart-elementor-editor',
			plugins_url( 'app/src/Integrations/Elementor/assets/editor.css', SURECART_PLUGIN_FILE ),
			[],
			filemtime( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'app/src/Integrations/Elementor/assets/editor.css' )
		);

		wp_enqueue_style( 'surecart-elementor-editor' );
	}

	/**
	 * Output the template selection modal.
	 *
	 * @return void
	 */
	public function show_template_selection_modal() {
		require plugin_dir_path( SURECART_PLUGIN_FILE ) . 'templates/elementor/template-selector-modal.php';
	}
}
