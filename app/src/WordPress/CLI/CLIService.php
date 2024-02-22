<?php

namespace SureCart\WordPress\CLI;

/**
 * Our assets service.
 */
class CLIService {
	/**
	 * The service container.
	 *
	 * @var \Pimple\Container $container Service Container.
	 */
	protected $container;

	/**
	 * Get the loader.
	 *
	 * @param Object $container The Container.
	 */
	public function __construct( $container ) {
		$this->container = $container;
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'cli_init', [ $this, 'registerCLICommands' ] );
	}

	/**
	 * Registers CLI commands.
	 *
	 * @return void
	 */
	public function registerCLICommands() {
	}
}
