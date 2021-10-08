<?php
/**
 * Load helpers.
 * Define any generic functions in a helper file and then require that helper file here.
 *
 * @package CheckoutEngine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// load ray helper in case ray is not installed.
require_once __DIR__ . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'route-helper.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'helpers' . DIRECTORY_SEPARATOR . 'ray-helper.php';


register_post_type(
	'ce_form',
	array(
		'labels'                => array(
			'name'                     => _x( 'Checkout Forms', 'post type general name' ),
			'singular_name'            => _x( 'Checkout Form', 'post type singular name' ),
			'add_new'                  => _x( 'Add New', 'Checkout Form' ),
			'add_new_item'             => __( 'Add new Checkout Form' ),
			'new_item'                 => __( 'New Checkout Form' ),
			'edit_item'                => __( 'Edit Checkout Form' ),
			'view_item'                => __( 'View Checkout Form' ),
			'all_items'                => __( 'All Checkout Forms' ),
			'search_items'             => __( 'Search Checkout Forms' ),
			'not_found'                => __( 'No checkout forms found.' ),
			'not_found_in_trash'       => __( 'No checkout forms found in Trash.' ),
			'filter_items_list'        => __( 'Filter checkout forms list' ),
			'items_list_navigation'    => __( 'Checkout Forms list navigation' ),
			'items_list'               => __( 'Checkout Forms list' ),
			'item_published'           => __( 'Checkout Form published.' ),
			'item_published_privately' => __( 'Checkout Form published privately.' ),
			'item_reverted_to_draft'   => __( 'Checkout Form reverted to draft.' ),
			'item_scheduled'           => __( 'Checkout Form scheduled.' ),
			'item_updated'             => __( 'Checkout Form updated.' ),
		),
		'public'                => false,
		'show_ui'               => true,
		'show_in_menu'          => false,
		'rewrite'               => false,
		'show_in_rest'          => true,
		'rest_base'             => 'ce-forms',
		'rest_controller_class' => 'WP_REST_Blocks_Controller',
		'capability_type'       => 'block',
		'capabilities'          => array(
			// You need to be able to edit posts, in order to read blocks in their raw form.
			'read'                   => 'edit_posts',
			// You need to be able to publish posts, in order to create blocks.
			'create_posts'           => 'publish_posts',
			'edit_posts'             => 'edit_posts',
			'edit_published_posts'   => 'edit_published_posts',
			'delete_published_posts' => 'delete_published_posts',
			'edit_others_posts'      => 'edit_others_posts',
			'delete_others_posts'    => 'delete_others_posts',
		),
		'map_meta_cap'          => true,
		'supports'              => array(
			'title',
			'editor',
			'custom-fields',
			'revisions',
		),
	)
);

add_action( 'rest_api_init', 'register_form_post_meta_fields' );
function register_form_post_meta_fields() {
	register_post_meta(
		'ce_form',
		'choices',
		array(
			'type'         => 'object',
			'single'       => true,
			'show_in_rest' => [
				'schema' => [
					'type'                 => 'object',
					'additionalProperties' => true,
				],
			],
		)
	);

	register_post_meta(
		'ce_form',
		'align',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'single'            => true,
			'show_in_rest'      => true,
		)
	);

	register_post_meta(
		'ce_form',
		'className',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'single'            => true,
			'show_in_rest'      => true,
		)
	);

	register_post_meta(
		'ce_form',
		'font_size',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'single'            => true,
			'show_in_rest'      => true,
		)
	);
}
