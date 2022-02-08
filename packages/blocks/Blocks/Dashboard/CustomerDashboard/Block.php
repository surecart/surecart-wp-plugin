<?php

namespace CheckoutEngineBlocks\Dashboard\CustomerDashboard;

use CheckoutEngineBlocks\BaseBlock;
use CheckoutEngine\Models\User;

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
			return \CheckoutEngine::blocks()->render( 'web/login' );
		}

		// cannot get user.
		$user = User::current();
		if ( ! $user ) {
			return \CheckoutEngine::blocks()->render( 'web/login' );
		}

		$is_customer = $user->customerId();

		if ( ! $is_customer ) {
			return \CheckoutEngine::blocks()->render( 'web/no-customer' );
		}

		// maybe redirect to the first tab if one is not specified.
		$this->maybeRedirectToInitialTab();

		return $content;
	}

	/**
	 * If we don't yet have a tab, maybe redirect to the first tab.
	 *
	 * @return void
	 */
	public function maybeRedirectToInitialTab() {
		if ( is_admin() || wp_doing_ajax() || defined( 'REST_REQUEST' ) ) {
			return;
		}

		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;

		if ( empty( $tab ) ) {
			global $post;
			$postcontent = $post->post_content;
			$blocks      = parse_blocks( $postcontent );
			$named       = \CheckoutEngine::blocks()->filterBy( 'blockName', 'checkout-engine/dashboard-tab', $blocks );

			if ( ! empty( $named[0]['attrs']['panel'] ) ) {
				wp_redirect( esc_url_raw( add_query_arg( [ 'tab' => $named[0]['attrs']['panel'] ] ) ) );
				exit;
			}
		}
	}
}
