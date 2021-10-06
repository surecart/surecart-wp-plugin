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
			'name'                     => _x( 'Forms', 'post type general name' ),
			'singular_name'            => _x( 'Form', 'post type singular name' ),
			'add_new'                  => _x( 'Add New', 'Form' ),
			'add_new_item'             => __( 'Add new Form' ),
			'new_item'                 => __( 'New Form' ),
			'edit_item'                => __( 'Edit Form' ),
			'view_item'                => __( 'View Form' ),
			'all_items'                => __( 'All Forms' ),
			'search_items'             => __( 'Search Forms' ),
			'not_found'                => __( 'No reusable blocks found.' ),
			'not_found_in_trash'       => __( 'No reusable blocks found in Trash.' ),
			'filter_items_list'        => __( 'Filter reusable blocks list' ),
			'items_list_navigation'    => __( 'Forms list navigation' ),
			'items_list'               => __( 'Forms list' ),
			'item_published'           => __( 'Form published.' ),
			'item_published_privately' => __( 'Form published privately.' ),
			'item_reverted_to_draft'   => __( 'Form reverted to draft.' ),
			'item_scheduled'           => __( 'Form scheduled.' ),
			'item_updated'             => __( 'Form updated.' ),
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
