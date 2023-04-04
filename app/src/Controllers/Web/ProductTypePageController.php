<?php
namespace SureCart\Controllers\Web;

/**
 * Handles webhooks
 */
abstract class ProductTypePageController {
	/**
	 * Product.
	 *
	 * @var \SureCart\Models\Product
	 */
	protected $product;

	/**
	 * Handle filters.
	 *
	 * @return void
	 */
	public function filters() {
		// set the document title.
		add_filter( 'document_title_parts', [ $this, 'documentTitle' ] );
		// disallow pre title filter.
		add_filter( 'pre_get_document_title', [ $this, 'disallowPreTitle' ], 214748364 );
		// add edit product link.
		add_action( 'admin_bar_menu', [ $this, 'addEditProductLink' ], 99 );
		// add scripts.
		add_action( 'wp_enqueue_scripts', [ $this, 'scripts' ] );
	}

	/**
	 * Update the document title name to match the product name.
	 *
	 * @param array $parts The parts of the document title.
	 */
	public function documentTitle( $parts ) {
		$parts['title'] = $this->product->name ?? $parts['title'];
		return $parts;
	}

	/**
	 * Disallow the pre title.
	 *
	 * @param string $title The title.
	 *
	 * @return string
	 */
	public function disallowPreTitle( $title ) {
		if ( ! empty( $this->product->id ) ) {
			return '';
		}
		return $title;
	}

	/**
	 * Add edit links
	 *
	 * @param \WP_Admin_bar $wp_admin_bar The admin bar.
	 *
	 * @return void
	 */
	public function addEditProductLink( $wp_admin_bar ) {
		if ( empty( $this->product->id ) ) {
			return;
		}
		$wp_admin_bar->add_node(
			[
				'id'    => 'edit',
				'title' => __( 'Edit Product', 'surecart' ),
				'href'  => esc_url( \SureCart::getUrl()->edit( 'product', $this->product->id ) ),
			]
		);
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function scripts() {
		\SureCart::assets()->enqueueComponents();
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
