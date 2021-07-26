<?php
namespace CheckoutEngine\Settings\Setting;

use CheckoutEngine\Models\Account;
use CheckoutEngine\Settings\RegisterSetting;
use CheckoutEngine\Settings\RegisterSettingInterface;

/**
 * Provides an account setting to register.
 */
class AccountSetting extends RegisterSetting implements RegisterSettingInterface {
	/**
	 * Slug for the setting
	 *
	 * @since 1.0
	 * @var string $slug
	 */
	protected $name = 'account';

	/**
	 * Setting REST API Schema
	 *
	 * @var array
	 */
	protected $schema = [
		'name'     => [
			'type' => 'string',
		],
		'currency' => [
			'type' => 'string',
		],
	];

	/**
	 * What to return when settings are indexed.
	 */
	public function index( $settings, $params ) {
		$account = Account::find();
		return [
			'name'     => $account->name,
			'currency' => $account->currency,
		];
	}

	/**
	 * What to return when settings are updated.
	 */
	public function update( $values = [] ) {
		return Account::update(
			[
				'name'     => $values['name'],
				'currency' => $values['currency'],
			]
		);
	}
}
