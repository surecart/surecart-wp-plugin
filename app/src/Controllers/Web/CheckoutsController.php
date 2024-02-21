<?php

declare(strict_types=1);

namespace SureCart\Controllers\Web;

/**
 * Handles Checkout related routes.
 */
class CheckoutsController {

	/**
	 * Change the mode of the checkout form.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 */
	public function changeMode( $request ) {
		$post_id = get_query_var( 'sc_checkout_change_mode' );

		if ( ! $post_id ) {
			return;
		}

		$post = get_post( $post_id );
		if ( ! $post ) {
			return;
		}

		$checkout_form_post = \SureCart::block_mode_switcher()->getBlockFromPost( $post );
		if ( ! $checkout_form_post ) {
			return;
		}

		$default_mode = $checkout_form_post['attrs']['mode'] ?? 'live';

		// Change the mode.
		$checkout_form_post['attrs']['mode'] = 'test' === $default_mode ? 'live' : 'test';

		// Update the post.
		wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => serialize_blocks( [ $checkout_form_post ] ),
			]
		);

		// Redirect to the previous page.
		$redirect_url = sanitize_text_field( wp_unslash( $_GET[ 'sc_redirect_url' ] ) );

		if ( $redirect_url ) {
			return \SureCart::redirect()->to( $redirect_url );
		}
	}
}
