<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Permissions\AdminAccessService;

class AdminAccessServiceTest extends SureCartUnitTestCase {

	/**
	 * Set up admin access service redirect for tests.
	 */
	public function test_admin_access_service_redirect() {
		$service = new AdminAccessService();
		$user_id = $this->factory->user->create( [ 'role' => 'sc_customer' ] );
        
        wp_set_current_user( $user_id );

        $this->assertTrue( $service->prevent_admin_access() );
	}
}
