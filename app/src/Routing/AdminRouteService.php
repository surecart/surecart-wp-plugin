<?php

namespace CheckoutEngine\Routing;

use CheckoutEngine\Routing\AdminURLService;

/**
 * Provide custom route conditions.
 * This is an example class so feel free to modify or remove it.
 */
class AdminRouteService {
	/**
	 * Page name map.
	 *
	 * @var array
	 */
	protected $page_names = [
		'product'  => 'ce-products',
		'products' => 'ce-products',
		'order'    => 'ce-orders',
		'orders'   => 'ce-orders',
		'coupon'   => 'ce-coupons',
		'coupons'  => 'ce-coupons',
	];

	/**
	 * Get URL function
	 *
	 * @return AdminURLService
	 */
	public function getUrl() {
		return new AdminURLService( $this->page_names );
	}

	/**
	 * Get the Edit url for a model.
	 *
	 * @param string $name Name of the model.
	 * @param string $id Id of the model.
	 *
	 * @return string Url.
	 */
	public function getEditUrl( $name, $id = null ) {
		return esc_url(
			add_query_arg(
				[
					'action' => 'edit',
					'id'     => $id,
				],
				menu_page_url( $this->page_names[ $name ], false )
			)
		);
	}

	public function getIndexUrl( $name ) {
		 return esc_url( menu_page_url( $this->page_names[ $name ], false ) );
	}

	/**
	 * Get the Archive URL
	 *
	 * @param string $name Lowercase name of the model.
	 * @return string
	 */
	public function getArchiveUrl( $name, $id ) {
		return esc_url(
			add_query_arg(
				[
					'action' => 'archive',
					'nonce'  => wp_create_nonce( "archive_$name" ),
					'id'     => $id,
				],
				$this->getIndexUrl()
			)
		);
	}
}
