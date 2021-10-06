<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Models\Product;

/**
 * Checkout form class
 */
class Form {
	protected $post;

	/**
	 * Get the post
	 *
	 * @param [type] $id
	 */
	public function __construct( $id = 0 ) {
		$this->post = get_post( $id );
	}

	/**
	 * Get the stored product choices
	 *
	 * @param int|WP_Post $id Post object or id.
	 * @return array
	 */
	protected function getProductIds( $id ) {
		$this->post = get_post( $id );
		return array_keys( (array) get_post_meta( $this->post->ID, 'choices', true ) );
	}

	/**
	 * Get the form's products.
	 *
	 * @param int|WP_Post Block post id.
	 */
	protected function getProducts( $id ) {
		$ids = $this->getProductIds( $id );
		// no products.
		if ( empty( $ids ) ) {
			return [];
		}

		// TODO: filter out choices here.
		return Product::where(
			[
				'ids' => $ids,
			]
		)->get();
	}

	protected function getPosts() {
		$posts = get_posts(
			[
				's'         => '<!-- wp:checkout-engine/checkout-form ',
				'sentence'  => 1,
				'post_type' => 'any',
				'per_page'  => -1,
			]
		);
		return $this->getBlocksFromPosts( $posts );
	}

	/**
	 * Get blocks from the posts.
	 *
	 * @param array $posts Array of posts.
	 * @return array Array of blocks.
	 */
	public function getBlocksFromPosts( $posts ) {
		$blocks = [];
		foreach ( $posts as $post ) {
			$parsed_blocks = parse_blocks( $post->post_content );
			$blocks        = array_merge( $blocks, $this->findCheckoutBlocks( $parsed_blocks, $post ) );
		}
		return array_filter( $blocks );
	}

	/**
	 * Find our checkout block.
	 *
	 * @param array    $post_blocks Blocks array
	 * @param \WP_Post $post Post object.
	 * @return void
	 */
	public function findCheckoutBlocks( $post_blocks, $post_object ) {
		$blocks = [];
		foreach ( $post_blocks as $block ) {
			if ( 'checkout-engine/checkout-form' === $block['blockName'] ) {
				$block['post'] = $post_object;
				$blocks[]      = $block;
			} elseif ( ! empty( $block['innerBlocks'] ) ) {
				$blocks = array_merge( $blocks, $this->findCheckoutBlocks( $block['innerBlocks'], $post_object ) );
			}
		}

		return array_filter( $blocks );
	}

	/**
	 * Static Facade Accessor
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 *
	 * @return mixed
	 */
	public static function __callStatic( $method, $params ) {
		return call_user_func_array( [ new static(), $method ], $params );
	}
}
