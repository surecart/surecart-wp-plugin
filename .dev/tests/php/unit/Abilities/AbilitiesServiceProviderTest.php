<?php

namespace SureCart\Tests\Abilities;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Abilities\AbilitiesServiceProvider;
use SureCart\Abilities\AbilityRegistrar;

/**
 * @group abilities
 */
class AbilitiesServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up test fixtures.
	 */
	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			array(
				'providers' => array(
					\SureCart\WordPress\PluginServiceProvider::class,
					AbilitiesServiceProvider::class,
				),
			),
			false
		);
	}

	/**
	 * Test that the registrar is registered in the container.
	 */
	public function test_registrar_bound_in_container() {
		$registrar = \SureCart::resolve( 'surecart.abilities.registrar' );
		$this->assertInstanceOf( AbilityRegistrar::class, $registrar );
	}

	/**
	 * Test graceful degradation when wp_register_ability_category does not exist.
	 */
	public function test_bootstrap_does_nothing_without_abilities_api() {
		// wp_register_ability_category doesn't exist in test env (WP < 6.9).
		// bootstrap() should return early without errors.
		$provider  = new AbilitiesServiceProvider();
		$container = new \Pimple\Container();
		$provider->register( $container );

		// This should not throw any errors.
		$provider->bootstrap( $container );

		// If we get here without errors, the graceful degradation works.
		$this->assertTrue( true );
	}
}
