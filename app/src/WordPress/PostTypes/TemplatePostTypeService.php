<?php

namespace SureCart\WordPress\PostTypes;

use SureCart\WordPress\Pages\PageService;

/**
 * Form post type service class.
 */
class TemplatePostTypeService {
	/**
	 * Bootstrap service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'register_post_type_args', [ $this, 'whitelistEdit' ], 10, 2 );
		add_action( 'rest_api_init', [ $this, 'addRestField' ] );
		add_filter( 'get_canonical_url', [ $this, 'maybeSetUrl' ] );
		add_filter( 'get_shortlink', [ $this, 'maybeSetUrl' ] );
		add_filter( 'post_link', [ $this, 'maybeSetUrl' ] );
		add_filter( 'get_block_file_template', [ $this, 'maybeAddDefaultTemplate' ], 20, 3 );
	}

	/**
	 * Whitelist surecart specific templates to edit in post edit screen.
	 *
	 * @param array  $args Register post type args.
	 * @param string $post_type The post type.
	 *
	 * @return array
	 */
	public function whitelistEdit( $args, $post_type ) {
		// just templates.
		if ( 'wp_template' !== $post_type ) {
			return $args;
		}

		// get the post that is trying to be edited.
		$post_id = $_GET['post'] ?? null;
		if ( ! $post_id ) {
			return $args;
		}

		// show the UI if it's a surecart template.
		$args['show_ui'] = get_post_meta( $post_id, 'is_surecart_template', true );

		// return args.
		return $args;
	}

	/**
	 * Add our template identifier to the REST field.
	 *
	 * @return void
	 */
	public function addRestField() {
		register_rest_field(
			'wp_template',
			'is_surecart_template',
			array(
				'get_callback'    => function() {
					return get_post_meta( get_the_ID(), 'is_surecart_template', true );
				},
				'update_callback' => function( $value, $object ) {
					return update_post_meta( $object->ID, 'is_surecart_template', (bool) $value );
				},
			)
		);
	}

	/**
	 * Maybe set the url if needed.
	 *
	 * @param string $url The url.
	 *
	 * @return string
	 */
	public function maybeSetUrl( $url ) {
		global $sc_product;
		if ( empty( $sc_product->id ) ) {
			return $url;
		}
		return \SureCart::routeUrl( 'product', [ 'id' => $sc_product->id ] );
	}

	public function maybeAddDefaultTemplate( $template, $id, $template_type ) {
		var_dump( $id );
		return $template;
	}
}
