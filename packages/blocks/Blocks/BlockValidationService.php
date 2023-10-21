<?php

namespace SureCartBlocks\Blocks;

use SureCartCore\Application\Application;

/**
 * Provide block validation related functionality.
 */
class BlockValidationService {
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

	public function validate( $block_content, $block ): string {
		return $block_content;
	}
}
