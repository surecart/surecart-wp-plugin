<?php

namespace SureCart\WordPress\Posts;

use WP_Post;

/**
 * Handles Post related services.
 */
class PostService {
	/**
	 * The post.
	 *
	 * @var WP_Post|null
	 */
	public $post;

	/**
	 * Get the form post from a page.
	 *
	 * @param \WP_Post|int|null $post The form or post type post.
	 *
	 * @return WP_Post|null
	 */
	public function getFormPostFromBlock( $post = null ) {
		$this->post = get_post( $post ?? $this->post );

		// we don't have a post.
		if ( empty( $this->post->ID ) ) {
			return null;
		}

		// get the checkout form block.
		$block = wp_get_first_block( parse_blocks( $this->post->post_content ), 'surecart/checkout-form' );

		// get the post.
		return get_post( $block['attrs']['id'] ?? null );
	}

	/**
	 * Get the form block.
	 *
	 * @param WP_Post|null $post The form or post type post.
	 * @return array|null
	 */
	public function getFormBlock( $post = null ) {
		$this->post = get_post( $post ?? $this->post );

		// we don't have a post.
		if ( empty( $this->post->ID ) ) {
			return null;
		}

		// this is not the block we are are looking for.
		if ( ! has_block( 'surecart/checkout-form', $this->post ) && ! has_block( 'surecart/form', $this->post ) ) {
			return null;
		}

		$blocks = parse_blocks( $this->post->post_content );

		// we have a checkout form block.
		if ( has_block( 'surecart/checkout-form', $post ) ) {
			$block = wp_get_first_block( $blocks, 'surecart/checkout-form' );
			// Get the form post id.
			$this->post = get_post( $block['attrs']['id'] ?? null );
		}

		$blocks = parse_blocks( $this->post->post_content );

		return wp_get_first_block( $blocks, 'surecart/form' );
	}
}
