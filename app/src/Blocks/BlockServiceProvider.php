<?php

/**
 * Block Service Provider
 */

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Blocks\BlockService;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Block Service Provider Class
 * Registers block service used throughout the plugin
 *
 * @author  Checkout Engine <andre@checkoutengine.com>
 * @since   1.0.0
 * @license GPL
 */
class BlockServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		$container['blocks'] = function () use ( $app ) {
			return new BlockService( $app );
		};

		$app->alias( 'blocks', 'blocks' );

		$app->alias(
			'block',
			function () use ( $app ) {
				return call_user_func_array( [ $app->blocks(), 'render' ], func_get_args() );
			}
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 *
	 * @return void
	 *
	 * phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter
	 */
	public function bootstrap( $container ) {
		// allow our web components in wp_kses contexts.
		add_filter( 'wp_kses_allowed_html', [ $this, 'ksesComponents' ] );
		add_filter(
			'wp_kses_allowed_html',
			function( $tags ) {
				return [];
			}
		);

		// register our blocks.
		$this->registerBlocks( $container );
	}

	public function registerCheckoutStyles() {
		wp_register_style( 'awp-block-styles', get_template_directory_uri() . '/assets/css/custom-block-style.css', false );
		register_block_style(
			'checkout_engine/checkout-form',
			[
				'name'         => 'colored-bottom-border',
				'label'        => __( 'Colored bottom border', 'txtdomain' ),
				'style_handle' => 'awp-block-styles',
			]
		);
	}

	/**
	 * Add iFrame to allowed wp_kses_post tags
	 *
	 * @param array $tags Allowed tags, attributes, and/or entities.
	 *
	 * @return array
	 */
	public function ksesComponents( $tags ) {
		$components = include 'kses.php';

		// add slot to defaults.
		$tags['span']['slot'] = true;
		$tags['div']['slot']  = true;

		$tags['ce-button'] = [
			'full'   => true,
			'submit' => true,
		];

		return array_merge( $components, $tags );
	}

	/**
	 * Register blocks from config
	 *
	 * @return  void
	 * @since   1.0.0
	 * @license GPL
	 */
	public function registerBlocks( $container ) {
		$service = \CheckoutEngine::resolve( WPEMERGE_CONFIG_KEY );
		if ( ! empty( $service['blocks'] ) ) {
			foreach ( $service['blocks'] as $block ) {
				( new $block() )->register( $container );
			}
		}
	}
}
