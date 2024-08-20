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

		foreach ( glob( __DIR__ . '/Widgets/**' ) as $file ) {
			if ( ! is_readable( $file ) ) {
				continue;
			}

			require_once $file;
			$get_declared_classes = get_declared_classes();
			$widget_class_name    = end( $get_declared_classes );

			$widget_manager->register( new $widget_class_name() );
		}
	}
}
