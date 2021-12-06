<?php

namespace CheckoutEngine\Tests\Models;

use CheckoutEngine\Models\User;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class UserTest extends CheckoutEngineUnitTestCase {
	public function test_getsCurrentUser()
	{
		$user = $this->factory->user->create_and_get();
		$user_2 = $this->factory->user->create_and_get();
		wp_set_current_user($user->ID);

		$model = User::current();
		$this->assertEquals($user->ID, $model->ID);
		$this->assertEquals($user->user_email, $model->user_email);

		$model_2 = User::find($user_2->ID);
		$this->assertEquals($user_2->ID, $model_2->ID);
		$this->assertNotEmpty($model_2->user_email);
		$this->assertEquals($user_2->user_email, $model_2->user_email);
	}
}
