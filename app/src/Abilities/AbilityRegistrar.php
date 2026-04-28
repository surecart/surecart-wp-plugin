<?php

namespace SureCart\Abilities;

use SureCart\Abilities\Abilities\ArchiveProduct;
use SureCart\Abilities\Abilities\CancelSubscription;
use SureCart\Abilities\Abilities\CreateCoupon;
use SureCart\Abilities\Abilities\CreateCustomer;
use SureCart\Abilities\Abilities\CreateFulfillment;
use SureCart\Abilities\Abilities\CreateInvoice;
use SureCart\Abilities\Abilities\CreateProduct;
use SureCart\Abilities\Abilities\DeleteFulfillment;
use SureCart\Abilities\Abilities\GetFulfillment;
use SureCart\Abilities\Abilities\GetFulfillmentItem;
use SureCart\Abilities\Abilities\ListFulfillments;
use SureCart\Abilities\Abilities\UpdateFulfillment;
use SureCart\Abilities\Abilities\CreatePromotion;
use SureCart\Abilities\Abilities\CreateRefund;
use SureCart\Abilities\Abilities\GetRefund;
use SureCart\Abilities\Abilities\CreatePrice;
use SureCart\Abilities\Abilities\DuplicateProduct;
use SureCart\Abilities\Abilities\GetCustomer;
use SureCart\Abilities\Abilities\GetLicense;
use SureCart\Abilities\Abilities\GetOrder;
use SureCart\Abilities\Abilities\GetOrderStatistics;
use SureCart\Abilities\Abilities\GetProduct;
use SureCart\Abilities\Abilities\GetStoreDashboard;
use SureCart\Abilities\Abilities\GetStoreInfo;
use SureCart\Abilities\Abilities\GetSubscription;
use SureCart\Abilities\Abilities\ListCoupons;
use SureCart\Abilities\Abilities\ListCustomers;
use SureCart\Abilities\Abilities\ListLicenses;
use SureCart\Abilities\Abilities\ListOrders;
use SureCart\Abilities\Abilities\ListPrices;
use SureCart\Abilities\Abilities\ListProducts;
use SureCart\Abilities\Abilities\ListPromotions;
use SureCart\Abilities\Abilities\ListRefunds;
use SureCart\Abilities\Abilities\ListSubscriptions;
use SureCart\Abilities\Abilities\DeleteCoupon;
use SureCart\Abilities\Abilities\DeleteCustomer;
use SureCart\Abilities\Abilities\DeletePromotion;
use SureCart\Abilities\Abilities\GetCoupon;
use SureCart\Abilities\Abilities\GetPromotion;
use SureCart\Abilities\Abilities\UpdateCoupon;
use SureCart\Abilities\Abilities\UpdateCustomer;
use SureCart\Abilities\Abilities\UpdatePromotion;
use SureCart\Abilities\Abilities\UpdatePrice;
use SureCart\Abilities\Abilities\UpdateProduct;
use SureCart\Abilities\Abilities\UpdateInvoice;
use SureCart\Abilities\Abilities\UpdateSubscriptionRenewalDate;

/**
 * Registers the ability category and all SureCart abilities.
 */
class AbilityRegistrar {

	/**
	 * MCP settings for filtering abilities.
	 *
	 * @var array
	 */
	private $settings = array(
		'edit_enabled'   => true,
		'delete_enabled' => true,
	);

	/**
	 * Set the MCP toggle settings.
	 *
	 * @param array $settings The settings array with 'edit_enabled' and 'delete_enabled' keys.
	 * @return void
	 */
	public function set_settings( array $settings ) {
		$this->settings = array_merge( $this->settings, $settings );
	}

	/**
	 * Register the SureCart e-commerce ability category.
	 *
	 * @return void
	 */
	public function register_category() {
		wp_register_ability_category(
			'surecart-ecommerce',
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
			// Filter out abilities based on MCP settings.
			if ( ! $this->should_register_ability( $ability ) ) {
				continue;
			}

			wp_register_ability( $ability->get_name(), $ability->get_config() );
		}
	}

	/**
	 * Check if an ability should be registered based on the current settings.
	 *
	 * @param \SureCart\Abilities\Abilities\AbstractAbility $ability The ability to check.
	 * @return bool
	 */
	private function should_register_ability( $ability ): bool {
		$annotations = $ability->get_annotations();

		$is_readonly    = $annotations['readonly'] ?? false;
		$is_destructive = $annotations['destructive'] ?? false;

		// If edit abilities are disabled, skip non-readonly, non-destructive abilities (create/update).
		if ( ! $this->settings['edit_enabled'] && ! $is_readonly && ! $is_destructive ) {
			return false;
		}

		// If delete abilities are disabled, skip destructive abilities.
		if ( ! $this->settings['delete_enabled'] && $is_destructive ) {
			return false;
		}

		return true;
	}

	/**
	 * Get all ability instances.
	 *
	 * @return \SureCart\Abilities\Abilities\AbstractAbility[]
	 */
	public function get_abilities(): array {
		return array(
			// Store.
			new GetStoreInfo(),
			new GetStoreDashboard(),
			// Products.
			new ListProducts(),
			new GetProduct(),
			new CreateProduct(),
			new UpdateProduct(),
			new ArchiveProduct(),
			new DuplicateProduct(),
			// Orders.
			new ListOrders(),
			new GetOrder(),
			new GetOrderStatistics(),
			// Customers.
			new ListCustomers(),
			new GetCustomer(),
			new CreateCustomer(),
			new UpdateCustomer(),
			new DeleteCustomer(),
			// Subscriptions.
			new ListSubscriptions(),
			new GetSubscription(),
			new CancelSubscription(),
			new UpdateSubscriptionRenewalDate(),
			// Prices.
			new ListPrices(),
			new CreatePrice(),
			new UpdatePrice(),
			// Coupons.
			new ListCoupons(),
			new GetCoupon(),
			new CreateCoupon(),
			new UpdateCoupon(),
			new DeleteCoupon(),
			// Promotions.
			new ListPromotions(),
			new GetPromotion(),
			new CreatePromotion(),
			new UpdatePromotion(),
			new DeletePromotion(),
			// Invoices.
			new CreateInvoice(),
			new UpdateInvoice(),
			// Fulfillments.
			new ListFulfillments(),
			new GetFulfillment(),
			new CreateFulfillment(),
			new UpdateFulfillment(),
			new DeleteFulfillment(),
			// Fulfillment Items.
			new GetFulfillmentItem(),
			// Licensing.
			new ListLicenses(),
			new GetLicense(),
			// Refunds.
			new ListRefunds(),
			new GetRefund(),
			new CreateRefund(),
		);
	}
}
