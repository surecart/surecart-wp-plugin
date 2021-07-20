<?php

namespace CheckoutEngine\WordPress;

use CheckoutEngine\Models\Account;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register a session for Flash and OldInput to work with.
 */
class SettingsServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		add_action( 'admin_init', [ $this, 'registerSettings' ] );
		add_action( 'rest_api_init', [ $this, 'registerSettings' ] );

		// return account info.
		add_filter( 'pre_option_checkout_engine_account', [ $this, 'returnAccount' ] );
	}

	public function returnAccount() {
		$account = Account::find();

		return [
			'name'     => $account->name,
			'currency' => $account->currency,
		];
	}

	/**
	 * Start a new session.
	 *
	 * @return void
	 */
	public function registerSettings() {
		// TODO: remove before production.
		\register_setting(
			'checkout_engine',
			'checkout_engine_keys',
			[
				'type'         => 'object',
				'description'  => __( 'Private keys.', 'checkout_engine' ),
				'show_in_rest' => [
					'name'   => 'checkout_engine_keys',
					'type'   => 'object',
					'schema' => [
						'properties' => [
							'test'        => [
								'type' => 'string',
							],
							'live'        => [
								'type' => 'string',
							],
							'stripe_test' => [
								'type' => 'string',
							],
							'stripe_live' => [
								'type' => 'string',
							],
						],
					],
				],
				'default'      => [
					'test'        => '',
					'live'        => '',
					'stripe_test' => '',
					'stripe_live' => '',
				],
			]
		);

		\register_setting(
			'checkout_engine',
			'checkout_engine_account',
			[
				'type'         => 'object',
				'description'  => __( 'Account Info.', 'checkout_engine' ),
				'show_in_rest' => [
					'name'   => 'checkout_engine_account',
					'type'   => 'object',
					'schema' => [
						'properties' => [
							'name'     => [
								'type' => 'string',
							],
							'currency' => [
								'type' => 'string',
							],
						],
					],
				],
				'default'      => [
					'name'     => '',
					'currency' => 'usd',
				],
			]
		);
	}
}
