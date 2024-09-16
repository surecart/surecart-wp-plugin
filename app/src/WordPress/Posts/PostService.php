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
	 * Get the form post.
	 *
	 * @param WP_Post|int|null $post The form or post type post.
	 *
	 * @return WP_Post|null
	 */
	public function getFormPost( $post = null ) {
		return $this->getFormPostFromBlock( $post ) ?? $this->getFormPostFromShortcode( $post );
	}

	/**
	 * Get the form post from a page.
	 *
	 * @param WP_Post|int|null $post The form or post type post.
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

		if ( empty( $block['attrs']['id'] ) ) {
			return null;
		}

		// get the post.
		return get_post( $block['attrs']['id'] ?? null );
	}

	/**
	 * Get the form post from a shortcode.
	 *
	 * @param WP_Post|null $post The form or post type post.
	 *
	 * @return WP_Post|null
	 */
	public function getFormPostFromShortcode( $post = null ) {
		$this->post = get_post( $post ?? $this->post );

		if ( empty( $this->post->ID ) ) {
			return null;
		}

		if ( has_shortcode( $this->post->post_content, 'sc_form' ) ) {
			$shortcode = get_shortcode_regex();
			preg_match( "/$shortcode/", $this->post->post_content, $matches );
			$attrs = shortcode_parse_atts( $matches[3] ?? '' );

			// If no id, try to get it from the inner shortcode content.
			if ( empty( $attrs['id'] ) ) {
				foreach ( $matches as $match ) {
					preg_match('/sc_form id=(\d+)/', $match, $inner_matches);
					if ( ! empty( $inner_matches[1] ) && is_numeric( $inner_matches[1] ) ) {
						$attrs['id'] = (int) $inner_matches[1];
						break;
					}
				}
			}

			// If still no id, return null.
			if ( empty( $attrs['id'] ) ) {
				return null;
			}

			return get_post( $attrs['id'] );
		}

		return null;
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
