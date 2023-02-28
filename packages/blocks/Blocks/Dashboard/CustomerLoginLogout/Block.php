<?php

namespace SureCartBlocks\Blocks\Dashboard\CustomerLoginLogout;

use SureCartBlocks\Blocks\Dashboard\DashboardPage;
use SureCartBlocks\Blocks\BaseBlock;


/**
 * Login Logout block
 */
class Block extends BaseBlock {

	/**
	 * Run any block middleware before rendering.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content   Post content.
	 *
	 * @return boolean
	 */
	public function middleware( $attributes, $content ) {
		return is_user_logged_in();
	}

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content, $block = null ) {
		// Build the redirect URL.
		$current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

		return \SureCart::blocks()->render(
			'blocks/logout-button',
			[
				'href'      => esc_url( wp_logout_url( $current_url ) ),
				'type'      => 'primary',
				'size'      => 'medium',
				'show_icon' => false,
				'label'     => __( 'Logout', 'surecart' ),
			]
		);
		return '<p>Login/Logout</p>';
	}
}
