<?php

namespace CheckoutEngine\Routing;

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
	 * Get the Edit url for a model.
	 *
	 * @param string $name Name of the model.
	 * @param string $id Id of the model.
	 *
	 * @return string Url.
	 */
	public function getEditUrl( $name, $id ) {
		return esc_url_raw(
			add_query_arg(
				[
					'action' => 'edit',
					'id'     => $id,
				],
				menu_page_url( $this->page_names[ $name ], false )
			)
		);
	}
}
