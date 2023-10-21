<?php

declare(strict_types=1);

namespace SureCart\BlockLibrary;

/**
 * Provide block validation functionality.
 */
class BlockValidationService {
	/**
	 * Block validators to register.
	 *
	 * @var array
	 */
	protected array $validators = [];

	/**
	 * Set validators
	 */
	public function __construct() {
		/**
		 * Filters the list of block validators for SureCart blocks.
		 *
		 * @param array $validators An array of block validator instances.
		 * @return array Modified array of block validator instances.
		 */
		$this->validators = apply_filters(
			'surecart_block_validators',
			[
				new \SureCart\BlockValidator\VariantChoice(),
			]
		);
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_action( 'wp', [ $this, 'register' ] );
	}

	/**
	 * Register block validators.
	 *
	 * @return void
	 */
	public function register(): void {
		foreach ( $this->validators as $validator ) {
			add_filter( 'render_block', [ $validator, 'validateAndRender' ], 10, 2 );
		}
	}
}
