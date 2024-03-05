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
		$this->post = $this->getPostByIdOrObject( $post ?? $this->post );

		if ( empty( $this->post->ID ) ) {
			return null;
		}

		$blocks = parse_blocks( $this->post->post_content );

		return wp_get_first_block( $blocks, 'surecart/form' );
	}

	/**
     * Retrieves a valid WP_Post object.
     *
     * @param WP_Post|int|null $post The post to validate.
     *
     * @return WP_Post|null
     */
    private function getPostByIdOrObject( $post ) {
        if ( is_numeric( $post ) ) {
            $post = get_post( $post );
        }

        return $post instanceof WP_Post ? $post : get_post();
    }
}
