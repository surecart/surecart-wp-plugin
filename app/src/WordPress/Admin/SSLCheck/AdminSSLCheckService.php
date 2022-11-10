<?php

namespace SureCart\WordPress\Admin\SSLCheck;

/**
 * Admin SSL check service
 */
class AdminSSLCheckService {
	/**
	 * Bootstrap related hooks.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action(
			'admin_notices',
			function() {
				if ( is_ssl() ) {
					echo wp_kses_post(
						\SureCart::notices()->render(
							[
								'name'  => 'ssl_notice',
								'type'  => 'warning',
								'title' => esc_html__( 'SureCart', 'surecart' ),
								'text'  => esc_html__('Your store does not appear to be using a secure connection. A secure connection (https) is required to use SureCart to process live transactions.', 'surecart'),
							]
						)
					);
				}
			}
		);
	}

}
