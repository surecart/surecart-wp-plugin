<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Models\AccountPortalSession;
use SureCart\Models\ApiToken;

/**
 * Controls the settings page.
 */
abstract class FrameSettings {
	/**
	 * The endpoint for the frame.
	 *
	 * @var string
	 */
	protected $endpoint = '';


	/**
	 * View for the settings page.
	 *
	 * @var string
	 */
	protected $view = 'admin/settings';

	/**
	 * Get the frame url for the iframed settings.
	 *
	 * @param  string $endpoint The endpoint for the frame.
	 * @return string|\WP_Error
	 */
	protected function getFrameUrl() {
		$session = AccountPortalSession::create(
			[
				'frame_url' => ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'],
			]
		);

		if ( ! $session || is_wp_error( $session ) ) {
			return $session;
		}

		if ( is_ssl() ) {
			$session->url = str_replace( 'http://', 'https://', $session->url );
		}

		return add_query_arg(
			[
				'hide_sidebar' => true,
			],
			trailingslashit( SURECART_APP_URL ) . 'account_portal/' . $session->id . '/' . $this->endpoint
		);
	}

	/**
	 * Class to extend variables for the settings page.
	 *
	 * @return array
	 */
	protected function with() {
		return [];
	}

	/**
	 * Show the settings page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return string
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		$frame_url = $this->getFrameUrl();
		\SureCart::assets()->enqueueComponents();

		// cannot create frame url.
		if ( $frame_url && is_wp_error( $frame_url ) ) {
			if ( 'unauthorized' === $frame_url->get_error_code() ) {
				return \SureCart::view( 'admin/connection-invalid' )->with(
					[
						'api_token' => '',
						'status'    => 'unauthorized',
					]
				);
			}
			wp_die( esc_html__( 'Could not load settings page.', 'surecart' ) );
		}

		// merge args.
		$args = wp_parse_args(
			$this->with( $request ),
			[
				'tab'         => $request->query( 'tab' ),
				'session_url' => $this->getFrameUrl(),
			]
		);
		// return view.
		return \SureCart::view( $this->view )->with( $args );
	}
}
