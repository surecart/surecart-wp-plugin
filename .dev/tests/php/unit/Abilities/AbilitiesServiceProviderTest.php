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
}
