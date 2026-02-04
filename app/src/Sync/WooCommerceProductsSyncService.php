<?php


namespace SureCart\Sync;

use SureCart\Models\ProductImport;

/**
 * Syncs WooCommerce products records to SureCart Products.
 */
class WooCommerceProductsSyncService {

	/**
	 * Products import data.
	 *
	 * @var array
	 */
	private $products_import_data = [];

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_notices', [ $this, 'showSyncNotice' ] );
		add_action( 'surecart/sync/woocommerce_products', [ $this, 'sync' ], 10, 2 );
	}

	/**
	 * Is this sync running.
	 *
	 * @return boolean
	 */
	public function isRunning() {
		return as_has_scheduled_action( 'surecart/sync/woocommerce_products' );
	}

	/**
	 * Show an admin notice if customers are being synced.
	 *
	 * @return void
	 */
	public function showSyncNotice() {
		if ( ! $this->isRunning() ) {
			return;
		}

		echo wp_kses_post(
			\SureCart::notices()->render(
				[
					'type'  => 'info',
					'title' => esc_html__( 'SureCart: WooCommerce products import in progress.', 'surecart' ),
					'text'  => '<p>' . esc_html__( 'SureCart is importing WooCommerce products in the background. The process may take a little while, so please be patient.', 'surecart' ) . '</p>',
				]
			)
		);
	}

	/**
	 * Sync customers.
	 *
	 * @param string  $page Current page.
	 * @param integer $batch_size Batch size.
	 *
	 * @return void
	 */
	public function sync( $page = 1, $batch_size = 100 ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		// get WooCommerce products.
		$products = wc_get_products(
			[
				'limit'    => $batch_size,
				'page'     => $page,
				'return'   => 'ids',
				'paginate' => true,
			]
		);

		// enqueue actions to sync an individual customer.
		foreach ( $products->products as $product_id ) {
			$this->syncProduct( $product_id );
		}

		( new ProductImport() )->create( [ 'data' => $this->products_import_data ] );

		// if the total number of pages less than or equal to the current page, we don't have another page.
		if ( $products->max_num_pages <= $page ) {
			// we don't have another page.
			return;
		}

		// get the next batch.
		return as_enqueue_async_action(
			'surecart/sync/woocommerce_products',
			[
				'page'       => $page + 1,
				'batch_size' => $batch_size,
			],
			'surecart'
		);
	}

	/**
	 * Sync a single product.
	 *
	 * @param int $product_id Product ID.
	 */
	public function syncProduct( $product_id ) {
		// get the product.
		$product = wc_get_product( $product_id );

		// get the product data.
		$product_data = $product->get_data();

		$product_import_data = [
			'name'        => $product_data['name'],
			'slug'        => $product_data['slug'],
			'created_at'  => $product_data['date_created'],
			'updated_at'  => $product_data['date_modified'],
			'featured'    => $product_data['featured'],
			'status'      => $product_data['status'],
			'description' => $product_data['description'],
			'sku'         => $product_data['sku'],
		];

		$this->products_import_data[] = $product_import_data;
	}
}
