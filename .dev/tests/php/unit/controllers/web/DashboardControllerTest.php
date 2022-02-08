<?php

namespace CheckoutEngine\Tests\Controllers\Rest;

use CheckoutEngine\Controllers\Web\WebhookController;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class DashboardControllerTest extends CheckoutEngineUnitTestCase {
	public function test_should_login_if_wordpress_user_matches_email() {
		// admin check
		// login
		// maybe associate customer id if not already being used, and they don't have a customer id
	}

	public function test_should_login_if_customer_id_matches_a_wordpress_user() {
		// admin check
		// login regardless if emails match
	}

	public function test_should_create_user_if_customer_id_matches_no_known_user() {
		// create
		// maybe associate customer id if not already being used, and they don't have a customer id
	}
}


// emails match and no customer id
// emails match and customer id matches another wordpress user
