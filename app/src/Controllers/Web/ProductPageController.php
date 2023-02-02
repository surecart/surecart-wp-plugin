<?php
namespace SureCart\Controllers\Web;

use WP_Post;

/**
 * Handles webhooks
 */
class ProductPageController {
	/**
	 * Show the product page
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @param \SureCartCore\View                      $view View.
	 * @param string                                  $id The id of the product.
	 * @return function
	 */
	public function show( $request, $view, $id ) {
		global $post, $wp_query, $sc_product;

		$sc_product = \SureCart\Models\Product::with( [ 'prices' ] )->find( $id );
		if ( is_wp_error( $sc_product ) ) {
			return $this->handleError( $sc_product );
		}

		$template_id = $sc_product->metadata->wp_template_id ?? 'default';
		if ( is_int( $template_id ) ) {
			$post               = get_post( $template_id ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$post->post_title   = $sc_product->name;
			$post->post_excerpt = $sc_product->description;
			$post->post_name    = $sc_product->slug;
		} else {
			$post = new \WP_Post( // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
				(object) [
					'post_title'    => $sc_product->name,
					'post_excerpt'  => $sc_product->description,
					'post_name'     => $sc_product->slug,
					'comment_count' => 0,
				]
			);
		}
		global $wp_query;
		$wp_query->post              = $post;
		$wp_query->is_404            = false;
		$wp_query->queried_object_id = $post->ID;
		$wp_query->queried_object    = $post;
		$wp_query->is_single         = true;
		$wp_query->is_singular       = true;
		setup_postdata( $GLOBALS['post'] =& $post ); //phpcs:ignore

		// // add a link to the WP Toolbar.
		$this->addEditButton( $sc_product->id );
		$this->setPageTitle( $sc_product );

		// TODO: for Canonical url.
		add_filter(
			'post_link',
			function( $permalink, $requested_post ) use ( $post, $sc_product ) {
				if ( $requested_post->ID === $post->ID ) {
					return \SureCart::routeUrl( 'product', [ 'id' => $sc_product->id ] );
				}
				return $permalink;
			},
			10,
			2
		);

		// check to see if the product has a page or template.
		return \SureCart::view( 'web/product' )->with(
			[
				'product' => $sc_product,
			]
		);
	}

	/**
	 * Add admin bar edit button.
	 *
	 * @return void
	 */
	public function addEditButton( $id ) {
		add_action(
			'admin_bar_menu',
			function( $wp_admin_bar ) use ( $id ) {
				$wp_admin_bar->add_node(
					[
						'id'    => 'template',
						'title' => __( 'Edit Product', 'surecart' ),
						'href'  => esc_url( \SureCart::getUrl()->edit( 'product', $id ) ),
					]
				);
			},
			99
		);
	}

	/**
	 * Set the page title.
	 */
	public function setPageTitle( $product ) {
		add_action(
			'document_title_parts',
			function( $parts ) use ( $product ) {
				$parts['title'] = $product->name;
				return $parts;
			}
		);
	}

	/**
	 * Handle fetching error.
	 *
	 * @param \WP_Error $wp_error
	 *
	 * @return void
	 */
	public function handleError( \WP_Error $wp_error ) {
		$data = (array) $wp_error->get_error_data();
		if ( 404 === ( $data['status'] ?? null ) ) {
			return $this->notFound();
		}
		wp_die( esc_html( implode( ' ', $wp_error->get_error_messages() ) ) );
	}

	/**
	 * Handle not found error.
	 *
	 * @return void
	 */
	public function notFound() {
		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		get_template_part( 404 );
		exit();
	}
}
