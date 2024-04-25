<?php
namespace SureCart\Sync;

use SureCart\Sync\Customers\CustomerSyncService;
use SureCart\Sync\Products\ProductsSyncService;
use SureCart\Sync\Product\ProductSyncService;

/**
 * The sync service.
 */
class SyncService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// bootstrap the product sync.
		$this->product()->bootstrap();
		// bootstrap the customers sync.
		$this->customers()->bootstrap();
	}

	/**
	 * Get the (multiple) products sync process.
	 *
	 * @return ProductsSyncProcess
	 */
	public function products() {
		return new ProductsSyncService();
	}

	/**
	 * Get the (single) product sync service.
	 *
	 * @return ProductSyncService
	 */
	public function product() {
		return new ProductSyncService();
	}

	/**
	 * Get the customer sync service.
	 *
	 * @return ProductSyncService
	 */
	public function customers() {
		return new CustomerSyncService();
	}
}
