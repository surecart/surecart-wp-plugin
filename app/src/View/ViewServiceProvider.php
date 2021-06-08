<?php

namespace CheckoutEngine\View;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register view composers and globals.
 * This is an example class so feel free to modify or remove it.
 */
class ViewServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$blade = $container[ WPEMERGEBLADE_VIEW_BLADE_VIEW_ENGINE_KEY ];
		$blade->compiler()->directive(
			'attr',
			function( $expression ) {
				list($attr, $value) = explode( ', ', $expression );

				if ( ! $value ) {
					return;
				}
				return "<?php echo {$attr}='{$value}'; ?>";
			}
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		$this->registerGlobals();
		$this->registerComposers();
	}

	/**
	 * Register view globals.
	 *
	 * @return void
	 */
	protected function registerGlobals() {
		/**
		 * Globals
		 *
		 * @link https://docs.wpemerge.com/#/framework/views/overview
		 */
		// phpcs:ignore
		// \CheckoutEngine::views()->addGlobal( 'foo', 'bar' );
	}

	/**
	 * Register view composers.
	 *
	 * @return void
	 */
	protected function registerComposers() {
		/**
		 * View composers
		 *
		 * @link https://docs.wpemerge.com/#/framework/views/view-composers
		 */
		// phpcs:ignore
		// \CheckoutEngine::views()->addComposer( 'partials/foo', 'FooPartialViewComposer' );
	}
}
