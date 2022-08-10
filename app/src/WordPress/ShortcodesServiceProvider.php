<?php

namespace SureCart\WordPress;

use SureCartBlocks\Blocks\AddToCartButton\Block as AddtoCartBlock;
use SureCartBlocks\Blocks\BuyButton\Block as BuyButtonBlock;
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
		add_shortcode( 'sc_line_item', '__return_false' );
		add_shortcode( 'sc_form', [ $this, 'formShortcode' ] );
		add_shortcode( 'sc_add_to_cart_button', [ $this, 'addToCartShortcode' ], 10, 2 );
		add_shortcode( 'sc_buy_button', [ $this, 'buyButtonShortcode' ], 10, 2 );
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

		global $load_sc_js;
		$load_sc_js = true;

		global $sc_form_id;
		$sc_form_id = $atts['id'];

		// check to make sure we have a form post.
		if ( ! is_a( $form, 'WP_Post' ) ) {
			return __( 'This form is not available or has been deleted.', 'surecart' );
		}

		return apply_filters( 'surecart/shortcode/render', do_blocks( $form->post_content ), $atts, $form );
	}

	/**
	 * Add To Cart Shortcode
	 *
	 * @param array  $atts An array of attributes.
	 * @param string $content Content.
	 *
	 * @return string
	 */
	public function addToCartShortcode( $atts, $content ) {
		$atts = shortcode_atts(
			[
				'price_id'    => null,
				'type'        => 'primary',
				'size'        => 'medium',
				'button_text' => $content,
			],
			$atts,
			'sc_add_to_cart_button'
		);

		$block = new AddToCartBlock();

		return $block->render( $atts );
	}

	/**
	 * Buy button shortcode.
	 *
	 * @param array  $atts An array of attributes.
	 * @param string $content Content.
	 *
	 * @return string
	 */
	public function buyButtonShortcode( $atts, $content ) {
		$atts = shortcode_atts(
			[
				'type'        => 'primary',
				'size'        => 'medium',
				'button_text' => $content,
			],
			$atts,
			'sc_add_to_cart_button'
		);

		$atts['line_items'] = (array) $this->getShortcodesAtts(
			'sc_line_item',
			$content,
			[
				'price_id' => null,
				'quantity' => 1,
			]
		);

		foreach ( $atts['line_items'] as $key => $line_item ) {
			$atts['line_items'][ $key ]['id'] = $line_item['price_id'];
		}

		$block = new BuyButtonBlock();

		return $block->render( $atts );
	}

	/**
	 * Get specific shortcode atts from content
	 *
	 * @param string $name Name of shortcode
	 * @param string $content Page content
	 * @param array  $defaults Defaults for each
	 * @return array
	 */
	public function getShortcodesAtts( $name, $content, $defaults = [] ) {
		$items = [];

		// if shortcode exists.
		if (
		preg_match_all( '/' . get_shortcode_regex() . '/s', $content, $matches )
		&& array_key_exists( 2, $matches )
		&& in_array( $name, $matches[2] )
		) {
			foreach ( (array) $matches[0] as $key => $value ) {
				if ( strpos( $value, $name ) !== false ) {
					$items[] = wp_parse_args(
						shortcode_parse_atts( $matches[3][ $key ] ),
						$defaults
					);
				}
			}
		}

		return $items;
	}
}
