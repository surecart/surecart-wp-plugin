<?php

namespace SureCart\Abilities;

use SureCart\Abilities\Abilities\CancelSubscription;
use SureCart\Abilities\Abilities\CreateCoupon;
use SureCart\Abilities\Abilities\CreateProduct;
use SureCart\Abilities\Abilities\GetCustomer;
use SureCart\Abilities\Abilities\GetOrder;
use SureCart\Abilities\Abilities\GetOrderStatistics;
use SureCart\Abilities\Abilities\GetProduct;
use SureCart\Abilities\Abilities\GetStoreInfo;
use SureCart\Abilities\Abilities\GetSubscription;
use SureCart\Abilities\Abilities\ListCustomers;
use SureCart\Abilities\Abilities\ListOrders;
use SureCart\Abilities\Abilities\ListProducts;
use SureCart\Abilities\Abilities\ListSubscriptions;

/**
 * Registers the ability category and all SureCart abilities.
 */
class AbilityRegistrar {

	/**
	 * Register the SureCart e-commerce ability category.
	 *
	 * @return void
	 */
	public function register_category() {
		wp_register_ability_category(
			'surecart/ecommerce',
			array(
				'label'       => __( 'SureCart E-Commerce', 'surecart' ),
				'description' => __( 'E-commerce operations including products, orders, customers, and subscriptions.', 'surecart' ),
			)
		);
	}

	/**
	 * Register all SureCart abilities.
	 *
	 * @return void
	 */
	public function register_abilities() {
		$abilities = $this->get_abilities();

		foreach ( $abilities as $ability ) {
			wp_register_ability( $ability->get_name(), $ability->get_config() );
		}
	}

	/**
	 * Get all ability instances.
	 *
	 * @return \SureCart\Abilities\Abilities\AbstractAbility[]
	 */
	public function get_abilities(): array {
		return array(
			new GetStoreInfo(),
			new ListProducts(),
			new GetProduct(),
			new ListOrders(),
			new GetOrder(),
			new ListCustomers(),
			new GetCustomer(),
			new ListSubscriptions(),
			new GetSubscription(),
			new GetOrderStatistics(),
			new CreateProduct(),
			new CreateCoupon(),
			new CancelSubscription(),
		);
	}
}
