<?php
namespace SureCart\Integrations;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

class DiviServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		add_filter( 'surecart/shortcode/render', [ $this, 'handleDiviShortcode' ], 10, 2 );
	}

	/**
	 * If divi is active, only load the assets on the current request.
	 *
	 * @param boolean $load
	 *
	 * @return boolean
	 */
	public function handleDiviShortcode($content, $atts) {
		if( ! empty( $_GET['et_pb_preview'] ) ) {
			return '[sc_form id="' . $atts['id'] . '"]';
		}
		return $content;
	}
}
