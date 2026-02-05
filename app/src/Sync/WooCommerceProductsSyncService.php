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
	private $products_import_batch = [];

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
	 * Enqueue Sync Action.
	 *
	 * @param string  $page Current page.
	 * @param integer $batch_size Batch size.
	 *
	 * @return object
	 */
	public function dispatch( $page = 1, $batch_size = 100 ) {
		return as_enqueue_async_action(
			'surecart/sync/woocommerce_products',
			[
				'page'       => $page,
				'batch_size' => apply_filters( 'surecart/sync/woocommerce_products/batch_size', $batch_size ),
			],
			'surecart'
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

		( new ProductImport() )->create( [ 'data' => $this->products_import_batch ] );

		// if the total number of pages less than or equal to the current page, we don't have another page.
		if ( $products->max_num_pages <= $page ) {
			// we don't have another page.
			return;
		}

		// get the next batch.
		return $this->dispatch( $page + 1, $batch_size );
	}

	/**
	 * Sync a single product.
	 *
	 * @param int $product_id Product ID.
	 */
	public function syncProduct( $product_id ) {
		// get the product.
		$product = wc_get_product( $product_id );

		// map the WooCommerce Product to SureCart and save in the imports batch.
		$this->mapWooCommerceProductToSureCart( $product );
	}

	/**
	 * Map the WooCommerce Product to SureCart.
	 *
	 * @param array $product WooCoomerce Product.
	 *
	 * @return void
	 */
	public function mapWooCommerceProductToSureCart( $product ) {
		// Core Fields.
		$product_import_data = [
			'name'        => $product->get_name(),
			'slug'        => $product->get_slug(),
			'featured'    => $product->is_featured(),
			'status'      => $product->get_status() === 'publish' ? 'published' : 'draft',
			'description' => $product->get_description() ?? null,
			'sku'         => $product->get_sku() ?? null,
		];

		// Stock Fields.
		$managing_stock = $product->managing_stock();

		if ( $managing_stock ) {
			$product_import_data = array_merge(
				$product_import_data,
				[
					'stock_enabled'                => $managing_stock,
					'allow_out_of_stock_purchases' => $product->backorders_allowed(),
					'stock_adjustment'             => $managing_stock ? (int) $product->get_stock_quantity() : 0,
				]
			);
		}

		// Shipping Fields.
		$is_digital = $product->is_virtual();

		if ( ! $is_digital ) {
			$product_import_data = array_merge(
				$product_import_data,
				[
					'shipping_enabled'     => true,
					'auto_fulfill_enabled' => false,

					'weight'               => (float) $product->get_weight(),
					'weight_unit'          => get_option( 'woocommerce_weight_unit' ),

					'dimensions'           => [
						'length' => (float) $product->get_length(),
						'width'  => (float) $product->get_width(),
						'height' => (float) $product->get_height(),
						'unit'   => get_option( 'woocommerce_dimension_unit' ),
					],
				]
			);
		} else {
			$product_import_data = array_merge(
				$product_import_data,
				[
					'shipping_enabled'     => false,
					'auto_fulfill_enabled' => true,
				]
			);
		}

		// Tax Fields.
		$taxable      = $product->is_taxable();
		$tax_category = $is_digital || $product->is_downloadable() ? 'digital' : 'tangible';

		$product_import_data = array_merge(
			$product_import_data,
			[
				'tax_enabled'  => $taxable,
				'tax_category' => $tax_category,
			]
		);

		// Reviews Fields.
		$product_import_data = array_merge(
			$product_import_data,
			[
				'reviews_enabled' => comments_open( $product->get_id() ),
				'solicit_reviews' => true,
			]
		);

		// Media Fields.
		$media = [];

		if ( $image_id === $product->get_image_id() ) {
			$media[] = [
				'type' => 'image',
				'url'  => wp_get_attachment_url( $image_id ),
			];
		}

		foreach ( $product->get_gallery_image_ids() as $id ) {
			$media[] = [
				'type' => 'image',
				'url'  => wp_get_attachment_url( $id ),
			];
		}

		$product_import_data = array_merge(
			$product_import_data,
			[
				'product_medias' => $media,
			]
		);

		$this->products_import_batch[] = $product_import_data;
	}
}
