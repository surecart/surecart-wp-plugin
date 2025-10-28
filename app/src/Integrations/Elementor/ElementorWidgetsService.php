<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle elementor widgets.
 */
class ElementorWidgetsService {
	/**
	 * The widgets.
	 *
	 * @var array
	 */
	protected $free_widgets = [
		'ReusableFormWidget',
		'CartMenuIcon',
	];

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerStyles' ] );
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

			// pro is not active and the widget is not in the free widgets array.
			if ( ! $this->is_pro_active() && ! in_array( basename( $file, '.php' ), $this->free_widgets, true ) ) {
				continue;
			}

			require_once $file;
			$get_declared_classes = get_declared_classes();
			$widget_class_name    = end( $get_declared_classes );

			$widget_manager->register( new $widget_class_name() );
		}
	}

	/**
	 * Check if Elementor Pro is active.
	 *
	 * @return bool
	 */
	protected function is_pro_active(): bool {
		return class_exists( '\ElementorPro\Plugin' );
	}
}
