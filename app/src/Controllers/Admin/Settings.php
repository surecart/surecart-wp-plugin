<?php

namespace SureCart\Controllers\Admin;

use SureCart\Models\Account;
use SureCart\Models\AccountPortalSession;
use SureCart\Models\ApiToken;

/**
 * Controls the settings page.
 */
class Settings {
	/**
	 * Show the settings page.
	 *
	 * @return function|void
	 */
	public function show( $request ) {
		$session = AccountPortalSession::create(
			[
				'frame_url' => ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'],
			]
		);

		if ( ! $session || is_wp_error( $session ) ) {
			wp_die( esc_html__( 'Could not load settings page.', 'surecart' ) );
		}

		if ( is_ssl() ) {
			$session->url = str_replace( 'http://', 'https://', $session->url );
		}

		$tab  = $request->query( 'tab' );
		$tabs = [
			'store'                          => [
				'frame_url' => 'account/edit',
			],
			'brand'                          => [
				'frame_url' => 'brand',
			],
			'customer_notification_protocol' => [
				'frame_url' => 'customer_notification_protocol',
			],
			'subscription_protocol'          => [
				'frame_url' => 'subscription_protocol',
			],
			'portal_protocol'                => [
				'frame_url' => 'portal_protocol',
			],
			'tax_protocol'                   => [
				'frame_url' => 'tax_protocol',
			],
			'connection'                     => [
				'icon'   => 'upload-cloud',
				'label'  => esc_html__( 'Connection', 'surecart' ),
				'url'    => add_query_arg( [ 'tab' => 'connection' ] ),
				'active' => 'connection' === $tab,
				'view'   => \SureCart::view( 'admin/plugin' )->with(
					[
						'api_token'      => ApiToken::get(),
						'uninstall'      => get_option( 'sc_uninstall', false ),
						'use_esm_loader' => get_option( 'surecart_use_esm_loader', false ),
						'status'         => $request->query( 'status' ),
					]
				),
			],
		];

		if ( ! empty( $tabs[ $tab ?? 'store' ]['frame_url'] ) ) {
			return \SureCart::view( 'admin/settings' )->with(
				[
					'tab'         => $tab,
					'tabs'        => $tabs,
					'session_url' => add_query_arg(
						[
							'hide_sidebar' => true,
						],
						$this->generateURL( $session, $tabs[ $tab ?? 'store' ]['frame_url'] )
					),
				]
			);
		}

		if ( ! empty( $tabs[ $tab ]['view'] ) ) {
			return $tabs[ $tab ]['view'];
		}
	}

	/**
	 * Generate the current url.
	 *
	 * @param \SureCart\Models\AccountPortalSession $session Session.
	 * @param string                                $endpoint Endpoint.
	 *
	 * @return string
	 */
	public function generateURL( $session, $endpoint ) {
		return trailingslashit( SURECART_APP_URL ) . 'account_portal/' . $session->id . '/' . $endpoint;
	}
}
