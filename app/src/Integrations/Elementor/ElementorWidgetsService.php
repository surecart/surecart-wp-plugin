<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle elementor widgets.
 */
class ElementorWidgetsService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerStyles' ] );
		add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'loadScripts' ] );
		add_action( 'elementor/elements/categories_registered', [ $this, 'registerCategories' ] );
		add_action( 'elementor/widgets/register', [ $this, 'registerWidgets' ] );
		add_action( 'elementor/frontend/after_enqueue_styles', [ $this, 'enqueueStyles' ], 1 );
	}

	/**
	 * Register the styles.
	 *
	 * @return void
	 */
	public function registerStyles() {
		wp_register_style( 'surecart-elementor-container-style', plugins_url( 'assets/container.css', __FILE__ ), [], '1.0', 'all' );
	}

	/**
	 * Enqueue the styles.
	 *
	 * @return void
	 */
	public function enqueueStyles() {
		wp_enqueue_style( 'surecart-elementor-container-style' );
	}

	/**
	 * Elementor load scripts
	 *
	 * @return void
	 */
	public function loadScripts() {
		wp_enqueue_script( 'surecart-elementor-editor', plugins_url( 'assets/editor.js', __FILE__ ), array( 'jquery' ), \SureCart::plugin()->version(), true );
		wp_enqueue_style( 'surecart-elementor-style', plugins_url( 'assets/editor.css', __FILE__ ), '', \SureCart::plugin()->version(), 'all' );
		wp_localize_script(
			'surecart-elementor-editor',
			'scElementorData',
			[
				'site_url'                    => site_url(),
				'sc_product_template'         => $this->get_elementor_template_from_file( 'surecart-single-product.json' ),
				'sc_product_card_template'    => $this->get_elementor_template_from_file( 'surecart-product-card.json' ),
				'sc_product_pricing_template' => $this->get_elementor_template_from_file( 'surecart-product-pricing.json' ),
			]
		);
	}

	/**
	 * Elementor surecart categories register.
	 *
	 * @param \Elementor\Elements_Manager $elements_manager The elements manager.
	 *
	 * @return void
	 */
	public function registerCategories( $elements_manager ) {
		$elements_manager->add_category(
			'surecart-elementor-layout',
			[
				'title' => esc_html__( 'SureCart Layout', 'surecart' ),
				'icon'  => 'fa fa-plug',
			]
		);

		$elements_manager->add_category(
			'surecart-elementor-elements',
			[
				'title' => esc_html__( 'SureCart Elements', 'surecart' ),
				'icon'  => 'fa fa-plug',
			]
		);

		$elements_manager->add_category(
			'surecart-elementor-checkout',
			[
				'title' => esc_html__( 'SureCart Checkout Page', 'surecart' ),
				'icon'  => 'fa fa-plug',
			]
		);
	}

	/**
	 * Register the widgets.
	 *
	 * @param \Elementor\Widgets_Manager $widget_manager Widget manager.
	 *
	 * @return void
	 */
	public function registerWidgets( $widget_manager ) {
		if ( ! class_exists( '\Elementor\Widget_Base' ) ) {
			return;
		}

		foreach ( glob( __DIR__ . '/Widgets/*.php' ) as $file ) {
			if ( ! is_readable( $file ) ) {
				continue;
			}

			require_once $file;
			$get_declared_classes = get_declared_classes();
			$widget_class_name    = end( $get_declared_classes );

			$widget_manager->register( new $widget_class_name() );
		}
	}

	/**
	 * Get Elementor template from file.
	 *
	 * @param string $file_name The file name.
	 *
	 * @return array
	 */
	public function get_elementor_template_from_file( string $file_name ) {
		try {
			$template_path    = SURECART_PLUGIN_DIR . '/templates/elementor/' . $file_name;
			$template_content = file_get_contents( $template_path ); // phpcs:ignore

			return isset( $template_content ) ? json_decode( $template_content, true ) : [];
		} catch ( \Throwable $th ) {
			error_log( 'Error while reading the template file: ' . $th->getMessage() );
			return [];
		}
	}
}
