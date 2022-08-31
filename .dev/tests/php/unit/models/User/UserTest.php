<?php

namespace SureCart\Tests\Models;

use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;

class UserTest extends SureCartUnitTestCase {
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

	public function test_findByCustomerId() {
		$user_id = $this->factory->user->create();
		$user_id_2 = $this->factory->user->create();
		// up
		$model = User::find($user_id);
		$model->setCustomerId('liveid', 'live');

		$model_2 = User::find($user_id_2);
		$model_2->setCustomerId('testid', 'test');

		$this->assertSame($user_id, User::findByCustomerId('liveid')->ID);
		$this->assertSame($user_id_2, User::findByCustomerId('testid')->ID);
	}

	public function test_setCustomerId() {
		$user_id = $this->factory->user->create();

		$model = User::find($user_id);
		$model->setCustomerId('liveid', 'live');
		$model->setCustomerId('test', 'test');

		$this->assertWPError($model->setCustomerId('somethingelse', 'live'));
		$this->assertWPError($model->setCustomerId('somethingelse', 'test'));

		$this->assertNotWPError($model->setCustomerId('somethingelse', 'live', true));
		$this->assertNotWPError($model->setCustomerId('somethingelse', 'test', true));
	}
}
