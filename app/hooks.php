<?php
/**
 * Declare any actions and filters here.
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package CheckoutEngine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// handle sessions in admin for flash messages.
add_action(
	'admin_init',
	function() {
		if ( ! session_id() ) {
			session_start();
		}
	}
);

// redirect to an admin page that they can't access instead of homepage.
// Otherwise the homepage if they cannot access admin.
add_filter(
	'wpemerge.middleware.user.can.redirect_url',
	function( $url ) {
		if ( current_user_can( 'read' ) ) {
			return get_admin_url() . 'admin.php?page=ce-denied';
		}
		return $url;
	}
);


function maybe_create_or_update_form( $post_id ) {
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}

	$post = get_post( $post_id );

	// get the form ids by the post id.
	// $form_ids = get_form_ids_by_post_id($post_id);
	$block_form_ids = [];

	if ( has_block( 'checkout-engine/checkout-form', $post ) ) {
		$blocks = parse_blocks( $post->post_content );
		foreach ( $blocks as $block ) {
			if ( 'checkout-engine/checkout-form' === $block['blockName'] ) {
				// this is generated in the client.
				$form_id          = $block['attrs']['form_id'];
				$block_form_ids[] = $form_id;

				// if ( in_array( $form_id, $form_ids ) ) {
				// update
				// } else {
				// create
				// }
			}
		}
	}

	// soft delete the difference.
}
add_action( 'save_post', 'maybe_create_or_update_form' );
