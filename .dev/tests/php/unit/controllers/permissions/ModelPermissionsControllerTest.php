<?php
namespace SureCart\Tests\Controllers\Permissions;

use SureCart\Models\User;
use SureCart\Permissions\Models\CheckoutPermissionsController;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * SUR-5621 — isListingOwnCustomerIds() previously used a loose in_array(),
 * so `[ true ]` and `{"x":true}` compared equal to any owned id string and
 * authorized a store-wide listing. Thirteen permission controllers share the
 * guard; the associative shape is also the encoding the platform ignores
 * instead of filtering on, so it must never authorize.
 *
 * @group permissions
 * @group rest-authz-hardening
 */
class ModelPermissionsControllerTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		// Bare app instance — the guard reads user meta only, so an unexpected
		// platform call fails loudly instead of firing HTTP.
		\SureCart::make()->bootstrap( [], false );
		parent::setUp();
	}

	/**
	 * Invoke the protected guard through a concrete controller that shares it.
	 *
	 * @param \SureCart\Models\User $user         User model.
	 * @param mixed                 $customer_ids Requested customer ids.
	 * @return boolean
	 */
	protected function isListingOwnCustomerIds( $user, $customer_ids ) {
		$method = new \ReflectionMethod( CheckoutPermissionsController::class, 'isListingOwnCustomerIds' );
		$method->setAccessible( true );
		return $method->invoke( new CheckoutPermissionsController(), $user, $customer_ids );
	}

	/**
	 * A user holding a live and a test customer id.
	 *
	 * @return \SureCart\Models\User
	 */
	protected function createCustomerUser() {
		$user_id = self::factory()->user->create();
		update_user_meta(
			$user_id,
			'sc_customer_ids',
			array(
				'live' => 'cus_live_123',
				'test' => 'cus_test_123',
			)
		);
		return User::find( $user_id );
	}

	/**
	 * An empty list never authorizes.
	 */
	public function test_refuses_empty_ids() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array() ) );
		$this->assertFalse( $this->isListingOwnCustomerIds( $user, null ) );
	}

	/**
	 * Any non-empty scalar bypassed the pre-fix guard entirely — foreach over
	 * a scalar warns and skips the loop body, falling through to `return true`.
	 * WP REST runs permission_callback before schema validation, so scalars
	 * reach the guard unvalidated. A JSON object body cannot produce stdClass
	 * here — WP_REST_Request::parse_json_params() decodes with assoc = true.
	 */
	public function test_refuses_scalar_customer_ids() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, 'anything' ) );
		$this->assertFalse( $this->isListingOwnCustomerIds( $user, true ) );
		$this->assertFalse( $this->isListingOwnCustomerIds( $user, 7 ) );
	}

	/**
	 * An id nobody holds is refused.
	 */
	public function test_refuses_id_held_by_nobody() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array( 'cus_nobody' ) ) );
	}

	/**
	 * A nested array entry is refused.
	 */
	public function test_refuses_nested_array_entry() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array( array( 'true' ) ) ) );
	}

	/**
	 * `[ true ]` was previously authorized — loose in_array( true, [ 'cus_x' ] )
	 * casts the owned id string to true.
	 */
	public function test_refuses_boolean_entry() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array( true ) ) );
	}

	/**
	 * The live vector: `{"customer_ids":{"x":true}}` was previously authorized,
	 * then forwarded as an encoding the platform ignores — full store listing.
	 */
	public function test_refuses_associative_shape() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array( 'x' => true ) ) );
		// even an owned id must not authorize under an associative key.
		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array( 'x' => 'cus_live_123' ) ) );
	}

	/**
	 * Integer entries are refused before any comparison.
	 */
	public function test_refuses_integer_entries() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array( 1, 2 ) ) );
	}

	/**
	 * The regression guard: a sequential list of the user's own ids still
	 * authorizes, so dashboard listings keep working.
	 */
	public function test_authorizes_sequential_list_of_own_ids() {
		$user = $this->createCustomerUser();

		$this->assertTrue( $this->isListingOwnCustomerIds( $user, array( 'cus_live_123' ) ) );
		$this->assertTrue( $this->isListingOwnCustomerIds( $user, array( 'cus_live_123', 'cus_test_123' ) ) );
	}

	/**
	 * One owned id does not smuggle in an unowned one.
	 */
	public function test_refuses_list_mixing_owned_and_unowned_ids() {
		$user = $this->createCustomerUser();

		$this->assertFalse( $this->isListingOwnCustomerIds( $user, array( 'cus_live_123', 'cus_other' ) ) );
	}

	/**
	 * customerIds() deliberately flattens both modes — an id owned under the
	 * other mode still authorizes.
	 */
	public function test_authorizes_id_owned_under_other_mode() {
		$user = $this->createCustomerUser();

		$this->assertTrue( $this->isListingOwnCustomerIds( $user, array( 'cus_test_123' ) ) );
	}
}
