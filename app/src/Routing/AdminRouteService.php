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
		'product'   => 'ce-products',
		'products'  => 'ce-products',
		'order'     => 'ce-orders',
		'orders'    => 'ce-orders',
		'customers' => 'ce-customers',
		'customer'  => 'ce-customers',
		'coupon'    => 'ce-coupons',
		'coupons'   => 'ce-coupons',
	];

	/**
	 * Get URL function
	 *
	 * @return AdminURLService
	 */
	public function getUrl() {
		return new AdminURLService( $this->page_names );
	}
}
