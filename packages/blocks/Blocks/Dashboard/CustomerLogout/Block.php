<?php

namespace SureCartBlocks\Blocks\Dashboard\CustomerLogout;

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
		$current_user = wp_get_current_user();

		ob_start() ?>

		<div class="sc-customer-logout">
			<sc-dropdown style="margin-top: auto;">
				<sc-button type="text" slot="trigger" style="<?php echo isset( $attributes['color'] ) ? 'color:' . $attributes['color'] . ';' : ''; ?>">
					<sc-avatar image="<?php echo esc_url( get_avatar_url( $current_user->ID, [ 'size' => 80 ] ) ); ?>"
					slot="prefix" style="--sc-avatar-size: 2em"></sc-avatar>
					<?php echo esc_html( $current_user->display_name ); ?>
					<sc-icon name="chevron-up" slot="suffix"></sc-icon>
				</sc-button>

				<sc-menu>
					<sc-menu-item href="<?php echo esc_url( wp_logout_url( $attributes['redirectToCurrent'] ? $current_url : '' ) ); ?>">
						<sc-icon slot="prefix" name="log-out"></sc-icon>
						<?php echo esc_html__( 'Logout', 'surecart' ); ?>
					</sc-menu-item>
				</sc-menu>
			</sc-dropdown>
		</div>
		<?php

		return ob_get_clean();
	}
}
