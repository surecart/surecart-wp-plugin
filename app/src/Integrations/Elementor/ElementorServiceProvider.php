<?php
namespace SureCart\Integrations\Elementor;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Elementor service provider.
 */
class ElementorServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		// nothing to register.
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return;
		}
		add_action( 'elementor/widgets/widgets_registered', [ $this, 'widget' ] );
		add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'load_scripts' ] );
		add_action( 'elementor/elements/categories_registered', [ $this, 'categories_registered' ] );
	}

	/**
	 * Elementor load scripts
	 *
	 * @return void
	 */
	public function load_scripts() {
		wp_enqueue_script( 'surecart-elementor-editor', plugins_url( 'assets/editor.js', __FILE__ ), array( 'elementor-editor', 'jquery' ), \SureCart::plugin()->version(), true );
		wp_enqueue_style( 'surecart-elementor-style', plugins_url( 'assets/editor.css', __FILE__ ), '', \SureCart::plugin()->version(), 'all' );
		wp_localize_script(
			'surecart-elementor-editor',
			'scElementorData',
			[
				'site_url' => site_url(),
			]
		);
	}

	/**
	 * Elementor surecart categories register
	 *
	 * @param Obj $elements_manager Elementor category manager.
	 *
	 * @return void
	 */
	public function categories_registered( $elements_manager ) {
		$elements_manager->add_category(
			'surecart-elementor',
			[
				'title' => esc_html__( 'SureCart', 'surecart' ),
				'icon' => 'fa fa-plug',
			]
		);
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
		\Elementor\Plugin::instance()->widgets_manager->register( new ReusableFormWidget() );
	}
}
