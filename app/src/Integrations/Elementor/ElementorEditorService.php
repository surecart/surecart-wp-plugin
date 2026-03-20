<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle elementor editor scripts.
 */
class ElementorEditorService {
	/**
	 * Templates service instance.
	 *
	 * @var ElementorTemplatesService
	 */
	protected $templates_service;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->templates_service = new ElementorTemplatesService();
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'elementor/frontend/before_enqueue_styles', [ $this, 'enqueue_editor_styles' ], 1 );
		add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'enqueue_editor_scripts' ] );
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'show_template_selection_modal' ] );
	}

	/**
	 * Enqueue SureCart editor assets.
	 *
	 * @return void
	 */
	public function enqueue_editor_styles() {
		wp_register_style(
			'surecart-elementor-editor',
			plugins_url( 'app/src/Integrations/Elementor/assets/editor.css', SURECART_PLUGIN_FILE ),
			[],
			filemtime( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'app/src/Integrations/Elementor/assets/editor.css' )
		);

		wp_enqueue_style( 'surecart-elementor-editor' );
	}

	/**
	 * Enqueue editor scripts.
	 *
	 * @return void
	 */
	public function enqueue_editor_scripts() {
		wp_enqueue_script(
			'surecart-elementor-editor',
			plugins_url( 'assets/editor.js', __FILE__ ),
			array( 'jquery' ),
			\SureCart::plugin()->version(),
			true
		);

		wp_enqueue_style(
			'surecart-elementor-style',
			plugins_url( 'assets/editor.css', __FILE__ ),
			'',
			\SureCart::plugin()->version(),
			'all'
		);

		wp_localize_script(
			'surecart-elementor-editor',
			'scElementorData',
			[
				'site_url'  => site_url(),
				'templates' => $this->templates_service->get_templates(),
				'i18n'      => [
					'no_product_form_templates' => __( 'No product form templates available.', 'surecart' ),
					'no_product_card_templates' => __( 'No product card templates available.', 'surecart' ),
					'no_templates'              => __( 'No templates found.', 'surecart' ),
				],
			]
		);
	}

	/**
	 * Output the template selection modal.
	 *
	 * @return void
	 */
	public function show_template_selection_modal() {
		$all_templates = $this->templates_service->get_templates();

		// Filter out hidden templates for the list.
		$templates = array_filter(
			$all_templates,
			function ( $template ) {
				return ! ( isset( $template['hidden'] ) && true === $template['hidden'] );
			}
		);

		require plugin_dir_path( SURECART_PLUGIN_FILE ) . 'templates/elementor/template-selector-modal.php';
	}
}
