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

	public function test_creating_a_user_without_an_username_uses_email() {
		$user = User::create([
			'user_email' => 'testemail@email.com'
		]);
		$this->assertSame($user->user_login, 'testemail');

		$user = User::create([
			'user_name' => null,
			'user_email' => 'testemail2@email.com'
		]);
		$this->assertSame($user->user_login, 'testemail2');
	}

	/**
	 * @group failing
	 *
	 * @return void
	 */
	public function test_creating_a_user_with_an_existing_username_appends_numbers() {
		$user = User::create([
			'user_name' => 'person',
			'user_email' => 'testemail@email.com'
		]);
		$user1 = User::create([
			'user_name' => 'person',
			'user_email' => 'testemail1@email.com'
		]);
		$user2 = User::create([
			'user_name' => 'person',
			'user_email' => 'testemail2@email.com'
		]);
		$user_special = User::create([
			'user_name' => 'הדר',
			'user_email' => 'specialemail@email.com'
		]);

		$this->assertSame($user->user_login, 'person');
		$this->assertSame($user1->user_login, 'person1');
		$this->assertSame($user2->user_login, 'person2');
		$this->assertSame($user_special->user_login, 'specialemail');
	}
}
