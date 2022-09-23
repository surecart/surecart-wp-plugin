<?php
namespace SureCart\Integrations\Elementor;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

class Elementor implements ServiceProviderInterface {

    /**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
    public function register( $container ) {
        add_action( 'elementor/widgets/widgets_registered', [ $this, 'widget' ] );
	}

    /**
     * Elementor widget register
     *
     * @return void
     */
    public function widget() {
        if ( ! class_exists( '\Elementor\Plugin' ) ) {
            return;
        }
        \Elementor\Plugin::instance()->widgets_manager->register_widget_type(new ReusableFormWidget());
    }

    /**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {}
}
