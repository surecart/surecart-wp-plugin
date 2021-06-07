<?php

namespace CheckoutEngine\Blocks;

use WPEmerge\Application\Application;

/**
 * Provide general block-related functionality.
 */
class BlockService {
	/**
	 * View engine.
	 *
	 * @var Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param Application $app Application Instance.
	 */
	public function __construct( Application $app ) {
		$this->app = $app;
	}

	/**
	 * Render a block using a template
	 *
	 * @param  string|string[]      $views A view or array of views.
	 * @param  array<string, mixed> $context Context to send.
	 * @return string View html output.
	 */
	public function render( $views, $context = [] ) {
		return apply_filters( 'checkout_engine_block_output', $this->app->views()->make( $views )->with( $context )->toString() );
	}
}
