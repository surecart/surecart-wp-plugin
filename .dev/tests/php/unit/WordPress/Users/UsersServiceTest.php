<?php

namespace SureCart\Tests\WordPress\Users;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Users\UsersService;

/**
 * @group users
 * @group webhooks
 */
class UsersServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * @var UsersService
	 */
	protected $service;

	public function setUp(): void {
		parent::setUp();

		// Other suites may have bootstrapped UsersService and left a `profile_update`
		// listener wired to the SureCart App (via syncUserProfile -> Customer::update).
		// We're testing only the inbound webhook path, so isolate this hook.
		remove_all_filters( 'profile_update' );

		$this->service = new UsersService();
	}

	public function tearDown(): void {
		remove_all_filters( 'profile_update' );
		parent::tearDown();
	}

	/**
	 * CVE-2026-7655 — `customer.updated` payload must NOT change a linked WP user's
	 * `user_email`. The webhook is unauthenticated; flipping the login email gives
	 * an attacker an account-takeover primitive via wp-login.php's lost-password flow.
	 *
	 * first_name / last_name / phone are non-security-sensitive and DO sync.
	 */
	public function test_syncCustomerProfile_does_not_change_user_email() {
		$original_email = 'owner@example.test';
		$user_id        = self::factory()->user->create(
			array(
				'user_email' => $original_email,
				'first_name' => 'Old First',
				'last_name'  => 'Old Last',
			)
		);

		// Link this WP user to a SureCart customer id. WP_User_Query LIKEs the
		// serialized meta value, so storing the id in the array is enough.
		update_user_meta( $user_id, 'sc_customer_ids', array( 'live' => 'cust_123' ) );

		$customer = (object) array(
			'id'         => 'cust_123',
			'email'      => 'attacker@evil.test',
			'first_name' => 'New First',
			'last_name'  => 'New Last',
		);

		$this->service->syncCustomerProfile( $customer );

		$user = get_user_by( 'id', $user_id );

		// CVE-2026-7655 — user_email must remain unchanged.
		$this->assertSame( $original_email, $user->user_email, 'user_email must NOT be mutated by a webhook payload (CVE-2026-7655).' );

		// Non-sensitive fields still sync.
		$this->assertSame( 'New First', get_user_meta( $user_id, 'first_name', true ) );
		$this->assertSame( 'New Last', get_user_meta( $user_id, 'last_name', true ) );
	}

	/**
	 * A WP user without a `sc_customer_ids` link must be untouched, even if the
	 * webhook payload mentions a customer id we don't recognize.
	 */
	public function test_syncCustomerProfile_is_noop_for_unlinked_user() {
		$user_id = self::factory()->user->create(
			array(
				'user_email' => 'unlinked@example.test',
				'first_name' => 'Untouched',
			)
		);

		$customer = (object) array(
			'id'         => 'cust_999_unknown',
			'email'      => 'attacker@evil.test',
			'first_name' => 'Should Not Apply',
		);

		$this->service->syncCustomerProfile( $customer );

		$user = get_user_by( 'id', $user_id );
		$this->assertSame( 'unlinked@example.test', $user->user_email );
		$this->assertSame( 'Untouched', get_user_meta( $user_id, 'first_name', true ) );
	}
}
