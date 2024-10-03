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
		add_action( 'elementor/widgets/register', [ $this, 'registerWidgets' ] );
		add_action( 'elementor/widgets/register', [ $this, 'registerNestedWidgets' ] );
		add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'enqueueEditorScripts' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueScripts' ] );
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
	 * Register the nested widgets.
	 *
	 * @param \Elementor\Widgets_Manager $widget_manager Widget manager.
	 *
	 * @return void
	 */
	public function registerNestedWidgets( $widget_manager ) {
		if ( ! class_exists( '\Elementor\Widget_Base' ) ) {
			return;
		}

		$experiment_name = \Elementor\Modules\NestedElements\Module::EXPERIMENT_NAME;
		if ( ! \Elementor\Plugin::$instance->experiments->is_feature_active( $experiment_name ) ) {
			return;
		}

		foreach ( glob( __DIR__ . '/Widgets/Nested/**.php' ) as $file ) {
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
	 * Enqueue the editor scripts.
	 *
	 * @return void
	 */
	public function enqueueEditorScripts() {
		wp_enqueue_script( 'surecart-elementor-product', plugins_url( 'Widgets/Nested/assets/js/product/index.js', __FILE__ ), [ 'elementor-common' ], '1.0', true );
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueueScripts() {
		wp_register_style( 'surecart-elementor-container-style', plugins_url( 'assets/container.css', __FILE__ ), '', '1.0', 'all' );
	}
}
