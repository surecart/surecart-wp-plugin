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
	 * Get the form block.
	 *
	 * @param WP_Post|null $post The form post.
	 * @return array|null
	 */
	public function getFormBlock( $post = null ) {
		$this->post = get_post( $post ?? $this->post );

		if ( empty( $this->post->ID ) ) {
			return null;
		}

		$blocks = parse_blocks( $this->post->post_content );

		return wp_get_first_block( $blocks, 'surecart/form' );
	}
}
