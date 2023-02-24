<?php

namespace SureCartBlocks\Blocks\Dashboard\CustomerLoginLogout;

use SureCartBlocks\Blocks\Dashboard\DashboardPage;
use SureCartBlocks\Blocks\BaseBlock;


/**
 * Login Logout block
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
	public function render( $attributes, $content, $block = null ) {
		return '<p>Login/Logout</p>';
	}
}
