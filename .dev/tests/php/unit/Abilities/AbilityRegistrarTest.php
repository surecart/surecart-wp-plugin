<?php

namespace SureCart\Tests\Abilities;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Abilities\AbilityRegistrar;
use SureCart\Abilities\Abilities\AbstractAbility;

/**
 * @group abilities
 */
class AbilityRegistrarTest extends SureCartUnitTestCase {
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
	 * Test that all abilities extend AbstractAbility.
	 */
	public function test_all_abilities_extend_abstract_ability() {
		$abilities = $this->registrar->get_abilities();
		foreach ( $abilities as $ability ) {
			$this->assertInstanceOf( AbstractAbility::class, $ability );
		}
	}

	/**
	 * Test that all ability names follow the surecart/ prefix convention.
	 */
	public function test_all_ability_names_have_surecart_prefix() {
		$abilities = $this->registrar->get_abilities();
		foreach ( $abilities as $ability ) {
			$this->assertStringStartsWith( 'surecart/', $ability->get_name() );
		}
	}

	/**
	 * Test that all ability names are unique.
	 */
	public function test_all_ability_names_are_unique() {
		$abilities = $this->registrar->get_abilities();
		$names     = array_map( fn( $a ) => $a->get_name(), $abilities );
		$this->assertCount( count( $names ), array_unique( $names ) );
	}

	/**
	 * Test that all abilities return a valid config array.
	 */
	public function test_all_abilities_return_valid_config() {
		$abilities = $this->registrar->get_abilities();
		foreach ( $abilities as $ability ) {
			$config = $ability->get_config();
			$this->assertArrayHasKey( 'label', $config );
			$this->assertArrayHasKey( 'description', $config );
			$this->assertArrayHasKey( 'category', $config );
			$this->assertArrayHasKey( 'permission_callback', $config );
			$this->assertArrayHasKey( 'input_schema', $config );
			$this->assertArrayHasKey( 'output_schema', $config );
			$this->assertArrayHasKey( 'execute_callback', $config );
			$this->assertArrayHasKey( 'meta', $config );
			$this->assertEquals( 'surecart-ecommerce', $config['category'] );
			$this->assertTrue( $config['meta']['mcp']['public'] );
		}
	}

	/**
	 * Get the list of expected ability names.
	 *
	 * @return array
	 */
	private function get_expected_ability_names(): array {
		return array(
			// Store.
			'surecart/get-store-info',
			'surecart/get-store-dashboard',
			// Products.
			'surecart/list-products',
			'surecart/get-product',
			'surecart/create-product',
			'surecart/update-product',
			'surecart/archive-product',
			'surecart/duplicate-product',
			// Orders.
			'surecart/list-orders',
			'surecart/get-order',
			'surecart/get-order-statistics',
			'surecart/filter-orders',
			'surecart/get-orders-filter-schema',
			// Abandoned Checkouts.
			'surecart/list-abandoned-checkouts',
			'surecart/get-abandoned-checkout',
			// Customers.
			'surecart/list-customers',
			'surecart/get-customer',
			'surecart/create-customer',
			'surecart/update-customer',
			'surecart/delete-customer',
			'surecart/filter-customers',
			'surecart/get-customers-filter-schema',
			// Subscriptions.
			'surecart/list-subscriptions',
			'surecart/get-subscription',
			'surecart/cancel-subscription',
			'surecart/filter-subscriptions',
			'surecart/get-subscriptions-filter-schema',
			// Prices.
			'surecart/list-prices',
			'surecart/create-price',
			'surecart/update-price',
			// Coupons.
			'surecart/list-coupons',
			'surecart/get-coupon',
			'surecart/create-coupon',
			'surecart/update-coupon',
			'surecart/delete-coupon',
			// Promotions.
			'surecart/list-promotions',
			'surecart/get-promotion',
			'surecart/create-promotion',
			'surecart/update-promotion',
			'surecart/delete-promotion',
			// Fulfillments.
			'surecart/list-fulfillments',
			'surecart/get-fulfillment',
			'surecart/create-fulfillment',
			'surecart/update-fulfillment',
			'surecart/delete-fulfillment',
			// Fulfillment Items.
			'surecart/get-fulfillment-item',
			// Licensing.
			'surecart/list-licenses',
			'surecart/get-license',
			// Refunds.
			'surecart/list-refunds',
			'surecart/get-refund',
			'surecart/create-refund',
		);
	}

	/**
	 * Test expected ability names are present.
	 */
	public function test_expected_ability_names_present() {
		$abilities = $this->registrar->get_abilities();
		$names     = array_map( fn( $a ) => $a->get_name(), $abilities );

		foreach ( $this->get_expected_ability_names() as $name ) {
			$this->assertContains( $name, $names, "Expected ability '{$name}' not found." );
		}
	}

	/**
	 * Test that all abilities have explicit annotations with all 3 boolean keys.
	 */
	public function test_all_abilities_have_explicit_annotations() {
		$abilities = $this->registrar->get_abilities();
		foreach ( $abilities as $ability ) {
			$annotations = $ability->get_annotations();
			$name        = $ability->get_name();

			$this->assertArrayHasKey( 'readonly', $annotations, "Ability '{$name}' missing 'readonly' annotation." );
			$this->assertArrayHasKey( 'destructive', $annotations, "Ability '{$name}' missing 'destructive' annotation." );
			$this->assertArrayHasKey( 'idempotent', $annotations, "Ability '{$name}' missing 'idempotent' annotation." );

			$this->assertIsBool( $annotations['readonly'], "Ability '{$name}' 'readonly' must be boolean." );
			$this->assertIsBool( $annotations['destructive'], "Ability '{$name}' 'destructive' must be boolean." );
			$this->assertIsBool( $annotations['idempotent'], "Ability '{$name}' 'idempotent' must be boolean." );
		}
	}

	/**
	 * Test that all List/Get abilities are marked as readonly.
	 */
	public function test_readonly_abilities_have_correct_annotations() {
		$readonly_prefixes = array( 'surecart/list-', 'surecart/get-', 'surecart/filter-' );
		$abilities         = $this->registrar->get_abilities();

		foreach ( $abilities as $ability ) {
			$name = $ability->get_name();
			foreach ( $readonly_prefixes as $prefix ) {
				if ( str_starts_with( $name, $prefix ) ) {
					$annotations = $ability->get_annotations();
					$this->assertTrue( $annotations['readonly'], "Ability '{$name}' should be readonly." );
					$this->assertFalse( $annotations['destructive'], "Ability '{$name}' should not be destructive." );
					$this->assertTrue( $annotations['idempotent'], "Ability '{$name}' should be idempotent." );
				}
			}
		}
	}

	/**
	 * Test that all Delete abilities are marked as destructive.
	 */
	public function test_delete_abilities_have_destructive_annotations() {
		$abilities = $this->registrar->get_abilities();

		foreach ( $abilities as $ability ) {
			$name = $ability->get_name();
			if ( str_starts_with( $name, 'surecart/delete-' ) ) {
				$annotations = $ability->get_annotations();
				$this->assertTrue( $annotations['destructive'], "Ability '{$name}' should be destructive." );
				$this->assertFalse( $annotations['readonly'], "Ability '{$name}' should not be readonly." );
			}
		}
	}

	/**
	 * Test that get_config() includes annotations and instructions in meta.
	 */
	public function test_all_abilities_return_annotations_in_config() {
		$abilities = $this->registrar->get_abilities();

		foreach ( $abilities as $ability ) {
			$config = $ability->get_config();
			$name   = $ability->get_name();

			$this->assertArrayHasKey( 'annotations', $config['meta'], "Ability '{$name}' config missing meta.annotations." );
			$this->assertArrayHasKey( 'instructions', $config['meta'], "Ability '{$name}' config missing meta.instructions." );
			$this->assertIsArray( $config['meta']['annotations'], "Ability '{$name}' meta.annotations must be an array." );
			$this->assertIsString( $config['meta']['instructions'], "Ability '{$name}' meta.instructions must be a string." );
		}
	}
}
