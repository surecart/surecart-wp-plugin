<?php

namespace SureCart\WordPress;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register shortcodes.
 */
class ShortcodesServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		add_shortcode( 'sc_form', [ $this, 'formShortcode' ] );
	}

	/**
	 * Form shorcode
	 *
	 * @param  array  $atts Shortcode attributes.
	 * @param  string $content Shortcode content.
	 * @return string Shortcode output.
	 */
	public function formShortcode( $atts ) {
		$atts = shortcode_atts(
			[
				'id' => null,
			],
			$atts,
			'sc_form'
		);

		if ( ! $atts['id'] ) {
			return;
		}

		$form = \SureCart::forms()->get( $atts['id'] );

		global $sc_form_id;
		$sc_form_id = $atts['id'];

		global $load_sc_js;
		$load_sc_js = true;

		return apply_filters( 'surecart/shortcode/render', do_blocks( $form->post_content ), $atts, $form );
	}
}
