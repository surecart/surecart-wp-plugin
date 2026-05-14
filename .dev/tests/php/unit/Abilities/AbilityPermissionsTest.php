<?php

namespace SureCart\Tests\Abilities;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Abilities\AbilityRegistrar;

/**
 * @group abilities
 */
class AbilityPermissionsTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * The registrar instance.
	 *
	 * @var AbilityRegistrar
	 */
	private $registrar;

	/**
	 * Set up test fixtures.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->registrar = new AbilityRegistrar();
	}

	/**
	 * Test that abilities deny access to subscribers (no capabilities).
	 */
	public function test_abilities_deny_access_to_subscribers() {
		$subscriber = self::factory()->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $subscriber );

		$abilities = $this->registrar->get_abilities();
		foreach ( $abilities as $ability ) {
			$this->assertFalse(
				$ability->check_permission(),
				"Ability '{$ability->get_name()}' should deny subscriber access."
			);
		}
	}

	/**
	 * Test that read abilities allow access to administrators.
	 */
	public function test_read_abilities_allow_admin_access() {
		$admin = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin );

		// Grant SureCart capabilities to admin.
		$user = get_user_by( 'id', $admin );
		$user->add_cap( 'manage_sc_shop_settings' );
		$user->add_cap( 'read_sc_products' );
		$user->add_cap( 'read_sc_orders' );
		$user->add_cap( 'read_sc_customers' );
		$user->add_cap( 'read_sc_subscriptions' );
		$user->add_cap( 'read_sc_coupons' );
		$user->add_cap( 'read_sc_promotions' );
		$user->add_cap( 'read_sc_licenses' );
		$user->add_cap( 'read_sc_refunds' );
		$user->add_cap( 'read_sc_prices' );
		$user->add_cap( 'read_sc_checkouts' );
		$user->add_cap( 'view_sc_shop_reports' );
		$user->add_cap( 'publish_sc_products' );
		$user->add_cap( 'publish_sc_prices' );
		$user->add_cap( 'publish_sc_coupons' );
		$user->add_cap( 'edit_sc_coupons' );
		$user->add_cap( 'delete_sc_coupons' );
		$user->add_cap( 'publish_sc_customers' );
		$user->add_cap( 'publish_sc_promotions' );
		$user->add_cap( 'edit_sc_promotions' );
		$user->add_cap( 'delete_sc_promotions' );
		$user->add_cap( 'edit_sc_subscriptions' );
		$user->add_cap( 'edit_sc_customers' );
		$user->add_cap( 'delete_sc_customers' );
		$user->add_cap( 'edit_sc_orders' );
		$user->add_cap( 'edit_sc_refunds' );
		$user->add_cap( 'edit_sc_products' );
		$user->add_cap( 'edit_sc_prices' );
		$user->add_cap( 'edit_sc_subscriptions' );
		$user->add_cap( 'delete_sc_products' );

		$abilities = $this->registrar->get_abilities();
		foreach ( $abilities as $ability ) {
			$this->assertTrue(
				$ability->check_permission(),
				"Ability '{$ability->get_name()}' should allow admin access."
			);
		}
	}

	/**
	 * Test that the AbstractAbility error() returns proper format.
	 */
	public function test_error_response_format() {
		$abilities = $this->registrar->get_abilities();
		$ability   = $abilities[0]; // GetStoreInfo

		$reflection = new \ReflectionMethod( $ability, 'error' );
		$reflection->setAccessible( true );
		$result = $reflection->invoke( $ability, 'test_code', 'Test error message' );

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'test_code', $result->get_error_code() );
		$this->assertEquals( 'Test error message', $result->get_error_message() );
	}

	/**
	 * Test that the AbstractAbility success() returns proper format.
	 */
	public function test_success_response_format() {
		$abilities = $this->registrar->get_abilities();
		$ability   = $abilities[0]; // GetStoreInfo

		$reflection = new \ReflectionMethod( $ability, 'success' );
		$reflection->setAccessible( true );
		$result = $reflection->invoke( $ability, array( 'foo' => 'bar' ) );

		$this->assertTrue( $result['success'] );
		$this->assertEquals( 'bar', $result['foo'] );
	}
}
