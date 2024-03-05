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
		$form_post_id     = get_query_var( 'sc_checkout_change_mode' );
		$checkout_post_id = $request->query( 'sc_checkout_post' ) ?? null;

		if ( ! $form_post_id || ! $checkout_post_id ) {
			return;
		}

		$post = get_post( $form_post_id );
		if ( ! $post ) {
			return;
		}

		$checkout_form_post = \SureCart::blockModeSwitcher()->getBlockFromPost( $post );
		if ( ! $checkout_form_post ) {
			return;
		}

		$default_mode = $checkout_form_post['attrs']['mode'] ?? 'live';

		// Change the mode.
		$checkout_form_post['attrs']['mode'] = 'test' === $default_mode ? 'live' : 'test';

		// Update the post.
		wp_update_post(
			[
				'ID'           => $form_post_id,
				'post_content' => serialize_blocks( [ $checkout_form_post ] ),
			]
		);

		// Redirect to the previous page.
		$redirect_url = get_permalink( $checkout_post_id );

		if ( $redirect_url ) {
			return \SureCart::redirect()->to( $redirect_url );
		}
	}
}
