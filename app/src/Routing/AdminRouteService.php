<?php

namespace SureCart\Routing;

use SureCart\Routing\AdminURLService;

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
		'product'             => 'sc-products',
		'products'            => 'sc-products',
		'order'               => 'sc-orders',
		'orders'              => 'sc-orders',
		'checkout'            => 'sc-checkouts',
		'bump'                => 'sc-bumps',
		'bumps'               => 'sc-bumps',
		'invoice'             => 'sc-invoices',
		'invoices'            => 'sc-invoices',
		'customers'           => 'sc-customers',
		'customer'            => 'sc-customers',
		'subscriptions'       => 'sc-subscriptions',
		'subscription'        => 'sc-subscriptions',
		'licenses'            => 'sc-licenses',
		'license'             => 'sc-licenses',
		'abandoned-checkout'  => 'sc-abandoned-checkouts',
		'abandoned-checkouts' => 'sc-abandoned-checkouts',
		'upgrade-paths'       => 'sc-product-groups',
		'coupon'              => 'sc-coupons',
		'coupons'             => 'sc-coupons',
		'product_group'       => 'sc-product-groups',
		'product_groups'      => 'sc-product-groups',
		'cancellations'       => 'sc-cancellation-insights',
		'product_collection'  => 'sc-product-collections',
		'product_collections' => 'sc-product-collections',
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
