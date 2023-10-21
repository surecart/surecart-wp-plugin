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
	public function bootstrap() {
		add_action( 'wp', [ $this, 'register' ] );
	}

	/**
	 * Register block validators.
	 */
	public function register() {
		foreach ( $this->validators as $validator ) {
			add_filter( 'render_block', [ $validator, 'validateAndRender' ], 10, 2 );
		}
	}
}
