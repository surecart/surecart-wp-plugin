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

		// register our blocks.
		$this->registerBlocks();
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

		return array_merge( $components, $tags );
	}

	/**
	 * Register blocks from config
	 *
	 * @return  void
	 * @since   1.0.0
	 * @license GPL
	 */
	public function registerBlocks() {
		$service = \CheckoutEngine::resolve( WPEMERGE_CONFIG_KEY );
		if ( ! empty( $service['blocks'] ) ) {
			foreach ( $service['blocks'] as $block ) {
				( new $block() )->register();
			}
		}
	}
}
