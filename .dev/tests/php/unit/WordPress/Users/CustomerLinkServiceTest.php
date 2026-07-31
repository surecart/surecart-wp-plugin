<?php

namespace SureCart\Tests\WordPress\Users;

use SureCart\Models\Checkout;
use SureCart\Tests\MocksRequestService;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Users\CustomerLinkService;

/**
 * SUR-5621 — linkUserWithEmail() previously wrote the checkout's customer id
 * onto whichever WP user matched the checkout's email. Both fields are
 * independently attacker-controlled on an unauthenticated draft checkout, so
 * the link must be justified by the customer record's own email instead.
 *
 * @group users
 * @group rest-authz-hardening
 */
class CustomerLinkServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	use MocksRequestService;

	public function setUp(): void {
		// Bare app instance so tests can alias the request service; no providers
		// means an unexpected platform call fails loudly instead of firing HTTP.
		\SureCart::make()->bootstrap( [], false );
		parent::setUp();
	}

	/**
	 * Invoke the protected linkUserWithEmail() — link() short-circuits through
	 * getLinked() for some of the scenarios pinned here.
	 *
	 * @param \SureCart\Models\Checkout $checkout Checkout model.
	 * @return \SureCart\Models\User|false
	 */
	protected function linkUserWithEmail( Checkout $checkout ) {
		$service = new CustomerLinkService( $checkout );
		$method  = new \ReflectionMethod( $service, 'linkUserWithEmail' );
		$method->setAccessible( true );
		return $method->invoke( $service );
	}

	/**
	 * The attack: checkout email = victim, checkout customer = attacker's.
	 * The mismatch between the customer's email and the matched user must
	 * refuse the link and leave the victim's meta untouched.
	 */
	public function test_link_user_with_email_refuses_when_customer_email_does_not_match() {
		$victim_id = self::factory()->user->create( array( 'user_email' => 'victim@example.test' ) );

		$checkout = new Checkout(
			array(
				'email'     => 'victim@example.test',
				'customer'  => array(
					'id'    => 'cust_attacker',
					'email' => 'attacker@evil.test',
				),
				'live_mode' => true,
			)
		);

		$this->assertFalse( $this->linkUserWithEmail( $checkout ) );
		$this->assertEmpty( get_user_meta( $victim_id, 'sc_customer_ids', true ) );

		// end-to-end: link() falls through to creating a fresh user for the
		// attacker's email — it must never hand back or mutate the victim.
		$linked = ( new CustomerLinkService( $checkout ) )->link();
		$this->assertNotSame( $victim_id, $linked->ID ?? null );
		$this->assertEmpty( get_user_meta( $victim_id, 'sc_customer_ids', true ) );
	}

	/**
	 * Legitimate returning customer: user, checkout and customer emails all
	 * agree (case-insensitively) and the user has no id for the mode yet.
	 */
	public function test_link_user_with_email_links_when_customer_email_matches() {
		$user_id = self::factory()->user->create( array( 'user_email' => 'jane@example.test' ) );

		$checkout = new Checkout(
			array(
				'email'     => 'jane@example.test',
				'customer'  => array(
					'id'    => 'cust_jane',
					'email' => 'Jane@Example.test', // comparison is case-insensitive.
				),
				'live_mode' => true,
			)
		);

		$linked = $this->linkUserWithEmail( $checkout );

		$this->assertNotFalse( $linked );
		$this->assertSame( $user_id, $linked->ID );

		$meta = (array) get_user_meta( $user_id, 'sc_customer_ids', true );
		$this->assertSame( 'cust_jane', $meta['live'] ?? null );
	}

	/**
	 * A user who already holds an id for the checkout's mode is skipped.
	 */
	public function test_link_user_with_email_skips_user_who_already_has_id_for_mode() {
		$user_id = self::factory()->user->create( array( 'user_email' => 'repeat@example.test' ) );
		update_user_meta( $user_id, 'sc_customer_ids', array( 'live' => 'cust_existing' ) );

		$checkout = new Checkout(
			array(
				'email'     => 'repeat@example.test',
				'customer'  => array(
					'id'    => 'cust_new',
					'email' => 'repeat@example.test',
				),
				'live_mode' => true,
			)
		);

		$this->assertFalse( $this->linkUserWithEmail( $checkout ) );

		$meta = (array) get_user_meta( $user_id, 'sc_customer_ids', true );
		$this->assertSame( 'cust_existing', $meta['live'] ?? null );
	}

	/**
	 * setCustomerId() refuses an id another user already holds
	 * (customer_id_in_use) — the service must not report a successful link.
	 */
	public function test_link_user_with_email_does_not_report_success_when_id_held_by_another_user() {
		$holder_id = self::factory()->user->create( array( 'user_email' => 'holder@example.test' ) );
		update_user_meta( $holder_id, 'sc_customer_ids', array( 'live' => 'cust_taken' ) );

		$victim_id = self::factory()->user->create( array( 'user_email' => 'victim2@example.test' ) );

		$checkout = new Checkout(
			array(
				'email'     => 'victim2@example.test',
				'customer'  => array(
					'id'    => 'cust_taken',
					'email' => 'victim2@example.test',
				),
				'live_mode' => true,
			)
		);

		$this->assertFalse( $this->linkUserWithEmail( $checkout ) );
		$this->assertEmpty( get_user_meta( $victim_id, 'sc_customer_ids', true ) );
	}

	/**
	 * Fail closed: when the checkout only carries a customer id and the
	 * platform fetch fails, the customer's email is unknown — no link.
	 */
	public function test_link_user_with_email_refuses_when_customer_email_cannot_be_determined() {
		$user_id = self::factory()->user->create( array( 'user_email' => 'guest@example.test' ) );

		$captured = array();
		$this->mockRequest( new \WP_Error( 'not_found', 'Not found.' ), $captured );

		$checkout = new Checkout(
			array(
				'email'     => 'guest@example.test',
				'customer'  => 'cust_unfetchable',
				'live_mode' => true,
			)
		);

		$this->assertFalse( $this->linkUserWithEmail( $checkout ) );
		$this->assertEmpty( get_user_meta( $user_id, 'sc_customer_ids', true ) );
	}

	/**
	 * A partially-expanded customer (id but no email) falls back to fetching
	 * the record by id — a matching email must still link.
	 */
	public function test_link_user_with_email_links_when_partially_expanded_customer_fetch_matches() {
		$user_id = self::factory()->user->create( array( 'user_email' => 'partial@example.test' ) );

		$captured = array();
		$this->mockRequest(
			(object) array(
				'id'    => 'cust_partial',
				'email' => 'partial@example.test',
			),
			$captured
		);

		$checkout = new Checkout(
			array(
				'email'     => 'partial@example.test',
				'customer'  => array( 'id' => 'cust_partial' ),
				'live_mode' => true,
			)
		);

		$linked = $this->linkUserWithEmail( $checkout );

		$this->assertNotFalse( $linked );
		$this->assertSame( $user_id, $linked->ID );
		$this->assertSame( 'customers/cust_partial', $captured[0] );

		$meta = (array) get_user_meta( $user_id, 'sc_customer_ids', true );
		$this->assertSame( 'cust_partial', $meta['live'] ?? null );
	}

	/**
	 * When only an id is available the customer is fetched from the platform,
	 * and a matching email still links — the guest checkout path keeps working.
	 */
	public function test_link_user_with_email_links_when_fetched_customer_email_matches() {
		$user_id = self::factory()->user->create( array( 'user_email' => 'fetched@example.test' ) );

		$captured = array();
		$this->mockRequest(
			(object) array(
				'id'    => 'cust_fetch',
				'email' => 'fetched@example.test',
			),
			$captured
		);

		$checkout = new Checkout(
			array(
				'email'     => 'fetched@example.test',
				'customer'  => 'cust_fetch',
				'live_mode' => true,
			)
		);

		$linked = $this->linkUserWithEmail( $checkout );

		$this->assertNotFalse( $linked );
		$this->assertSame( $user_id, $linked->ID );
		$this->assertSame( 'customers/cust_fetch', $captured[0] );

		$meta = (array) get_user_meta( $user_id, 'sc_customer_ids', true );
		$this->assertSame( 'cust_fetch', $meta['live'] ?? null );
	}
}
