<?php

namespace SureCartBlocks\Blocks\Dashboard\CustomerDashboard;

use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\User;

/**
 * Checkout block
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		if ( ! is_user_logged_in() ) {
			return \SureCart::blocks()->render( 'web/login' );
		}

		// cannot get user.
		$user = User::current();
		if ( ! $user ) {
			return \SureCart::blocks()->render( 'web/login' );
		}

		$content = '<style>
		.sc-temp-left-section {
			flex-direction: column;
			display: flex;
			height: 100vh;
		}

		.admin-bar .sc-temp-left-section {
			top: 32px;
			height: calc(100vh - 32px);
		}

		.sc-temp-pin {
			margin-top: auto !important;
		}
		</style>' . $content;

		return $content;
	}
}
