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
		$provider = new AbilitiesServiceProvider();

		// Use a mock container — bootstrap() returns before touching it.
		$container = \Mockery::mock( 'Pimple\Container' );

		// This should not throw any errors.
		$provider->bootstrap( $container );

		// Container should never be accessed since bootstrap returns early.
		$container->shouldNotHaveBeenCalled();
		$this->assertTrue( true );
	}
}
