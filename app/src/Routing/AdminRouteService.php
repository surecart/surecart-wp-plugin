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
		'product'          => 'ce-products',
		'products'         => 'ce-products',
		'order'            => 'ce-orders',
		'orders'           => 'ce-orders',
		'customers'        => 'ce-customers',
		'customer'         => 'ce-customers',
		'subscriptions'    => 'ce-subscriptions',
		'subscription'     => 'ce-subscriptions',
		'abandoned_orders' => 'ce-abandoned-orders',
		'upgrade-paths'    => 'ce-product-groups',
		'coupon'           => 'ce-coupons',
		'coupons'          => 'ce-coupons',
		'product_group'    => 'ce-product-groups',
		'product_groups'   => 'ce-product-groups',
	];

	/**
	 * Get the page names.
	 *
	 * @return void
	 */
	public function getPageNames() {
		return $this->page_names;
	}

	/**
	 * Get URL function
	 *
	 * @return AdminURLService
	 */
	public function getUrl() {
		return new AdminURLService( $this->page_names );
	}
}
