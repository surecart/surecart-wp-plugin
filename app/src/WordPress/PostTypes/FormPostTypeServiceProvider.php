<?php

namespace CheckoutEngine\WordPress\PostTypes;

use CheckoutEngine\Models\Form;
use CheckoutEngine\WordPress\PageService;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register our form post type
 */
class FormPostTypeServiceProvider implements ServiceProviderInterface {
	protected $post_type = 'ce_form';

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['checkout_engine.forms'] = function () {
			return new FormPostTypeService( new PageService() );
		};

		$container[ WPEMERGE_APPLICATION_KEY ]
			->alias( 'forms', 'checkout_engine.forms' );

		add_action( 'display_post_states', [ $container['checkout_engine.forms'], 'displayDefaultFormStatus' ] );
		add_action( 'init', [ $container['checkout_engine.forms'], 'registerPostType' ] );

		add_filter( "manage_{$this->post_type}_posts_columns", [ $this, 'postTypeColumns' ], 1 );
		add_action( "manage_{$this->post_type}_posts_custom_column", [ $this, 'postTypeContent' ], 10, 2 );
	}

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}

	public function postTypeColumns( $defaults ) {
		$columns = array_merge(
			$defaults,
			array(
				'title'     => $defaults['title'],
				'public'    => __( 'Published In', 'checkout_engine' ),
				'products'  => __( 'Included Products', 'checkout_engine' ),
				'shortcode' => __( 'Shortcode', 'presto-player' ),
			)
		);

		$v = $columns['date'];
		unset( $columns['date'] );
		$columns['date'] = $v;
		return $columns;
	}

	public function postTypeContent( $column_name, $post_ID ) {
		if ( 'shortcode' === $column_name ) {
			return $this->columnShortcode( $post_ID );
		}
		if ( 'public' === $column_name ) {
			return $this->columnPosts( $post_ID );
		}
		if ( 'products' === $column_name ) {
			return $this->columnProducts( $post_ID );
		}
	}

	/**
	 * Get the shortcode for the current post.
	 *
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function columnShortcode( $post_ID ) {
		echo '<code>[ce_form id=' . (int) $post_ID . ']</code>';
	}

	/**
	 * Get the posts where this form appears.
	 *
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function columnPosts( $post_ID ) {
		 $posts = Form::getPosts( $post_ID );

		$post_names = array_map(
			function ( $post ) {
				return '<a href="' . esc_url( get_edit_post_link( $post->ID ) ) . '">' . wp_kses_post( $post->post_title ) . '</a>';
			},
			$posts,
		);

		echo implode( ', ', $post_names );
	}

	/**
	 * Get the products that are in this form by default
	 *
	 * @param integer $post_ID Post ID.
	 * @return void
	 */
	public function columnProducts( $post_ID ) {
		$products = Form::getProducts( $post_ID );

		$product_names = array_map(
			function ( $product ) {
				return '<a href="' . esc_url( \CheckoutEngine::getUrl()->edit( 'product', $product->id ) ) . '">' . wp_kses_post( $product->name ) . '</a>';
			},
			$products,
		);

		echo implode( ', ', $product_names );
	}
}
