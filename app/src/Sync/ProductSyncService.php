<?php


namespace SureCart\Sync;

use SureCart\Models\Product;

/**
 * Syncs customer records to WordPress users.
 */
class ProductSyncService {
	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'surecart/sync/products', [ $this, 'sync' ], 10, 2 );
		add_action( 'admin_notices', [ $this, 'showSyncNotice' ] );
	}

	/**
	 * Is this sync running.
	 *
	 * @return boolean
	 */
	public function isRunning() {
		return as_has_scheduled_action( 'surecart/sync/product' ) || as_has_scheduled_action( 'surecart/sync/products' );
	}

	/**
	 * Show an admin notice if products are being synced.
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
					'title' => esc_html__( 'SureCart product sync in progress', 'surecart' ),
					'text'  => '<p>' . esc_html__( 'SureCart is syncing products in the background. The process may take a little while, so please be patient.', 'surecart' ) . '</p>',
				]
			)
		);
	}

	/**
	 * Sync products.
	 *
	 * @param string  $page Current page.
	 * @param integer $batch_size Batch size.
	 *
	 * @return void
	 */
	public function sync( $page, $batch_size = 1 ) {
		// get products.
		$products = Product::with( [ 'prices', 'variants', 'variant_options', 'product_medias', 'product_media.media' ] )->paginate(
			[
				'per_page' => $batch_size,
				'page'     => $page,
			]
		);

		if ( is_wp_error( $products ) ) {
			return $products;
		}

		// enqueue actions to sync an individual customer.
		foreach ( $products->data as $product ) {
			$this->syncProduct( $product );
		}

		// calculate the total number of pages.
		$total_pages = ceil( $products->pagination->count / $products->pagination->limit );

		// if the total number of pages less than or equal to the current page, we don't have another page.
		if ( $total_pages <= $products->pagination->page ) {
			// we don't have another page.
			return;
		}

		// get the next batch.
		return as_enqueue_async_action(
			'surecart/sync/products',
			[
				'page'       => $page + 1,
				'batch_size' => $batch_size,
			],
			'surecart'
		);
	}

	/**
	 * Sync an individual customer.
	 *
	 * @param \SureCart\Models\Product $product Customer.
	 *
	 * @return \SureCart\Models\Product|\WP_Error
	 */
	public function syncProduct( $product ) {
		if ( ! $product || is_wp_error( $product ) ) {
			return $product;
		}

		$product->sync();

		return $product;
	}
}
