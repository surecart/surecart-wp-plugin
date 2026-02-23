<?php


namespace SureCart\Sync;

use SureCart\Models\ProductImport;

/**
 * Syncs WooCommerce products records to SureCart Products.
 *
 * @package SureCart
 */
class WooCommerceProductsSyncService {

	/**
	 * Products import data.
	 *
	 * @var array
	 */
	private $products_import_batch = [];

	/**
	 * Collections cache (per batch) to avoid duplicate API calls.
	 *
	 * @var array
	 */
	private $collections_cache = [];

	/**
	 * Cached WooCommerce currency (per batch).
	 *
	 * @var string|null
	 */
	private $currency_cache = null;

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_notices', [ $this, 'showSyncNotice' ] );
		add_action( 'admin_notices', [ $this, 'showCompletionNotice' ] );
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
	 * Show an admin notice if products are being synced.
	 *
	 * @return void
	 */
	public function showSyncNotice() {
		// Don't show on the import results page — the user is already viewing results.
		if ( 'import_results' === ( isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '' ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

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
	 * Show a completion notice after import finishes.
	 *
	 * @return void
	 */
	public function showCompletionNotice() {
		// Don't show on the import results page — the user is already viewing results.
		if ( 'import_results' === ( isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '' ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		// don't show if import is still running.
		if ( $this->isRunning() ) {
			return;
		}

		$import_ids             = get_option( 'sc_woo_import_ids', [] );
		$all_skipped_session_id = get_option( 'sc_woo_import_all_skipped' );

		// Generate results URL and notice name per branch.
		$notice_name = '';
		if ( ! empty( $import_ids ) ) {
			// Normal case: has import_ids.
			$results_url = \SureCart::getUrl()->importResults( 'products', $import_ids );
			$notice_name = 'woo_import_complete_' . md5( implode( ',', $import_ids ) );
		} elseif ( $all_skipped_session_id ) {
			// All-skipped case: use session_id.
			$results_url = add_query_arg(
				[
					'page'       => 'sc-products',
					'action'     => 'import_results',
					'session_id' => $all_skipped_session_id,
				],
				admin_url( 'admin.php' )
			);
			$notice_name = 'woo_import_complete_' . md5( $all_skipped_session_id );
		} else {
			// No data available, skip notice.
			return;
		}

		echo wp_kses_post(
			\SureCart::notices()->render(
				[
					'name'  => $notice_name,
					'type'  => 'success',
					'title' => esc_html__( 'SureCart: WooCommerce products import complete.', 'surecart' ),
					'text'  => '<p>' . sprintf(
						/* translators: %s: URL to import results page */
						__( 'The import has finished. <a href="%s">View Import Results</a>', 'surecart' ),
						esc_url( $results_url )
					) . '</p>',
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
	 * @return int
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
	 * Exclude already-imported products from wc_get_products query.
	 *
	 * @param array $wp_query_args WP_Query args.
	 * @param array $query_vars    Query vars passed to wc_get_products.
	 *
	 * @return array
	 */
	public function excludeImportedProducts( $wp_query_args, $query_vars ) {
		if ( ! empty( $query_vars['surecart_not_imported'] ) ) {
			$wp_query_args['meta_query'][] = [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'key'     => '_surecart_imported',
				'compare' => 'NOT EXISTS',
			];
		}

		return $wp_query_args;
	}

	/**
	 * Sync products.
	 *
	 * @param string  $page Current page.
	 * @param integer $batch_size Batch size.
	 *
	 * @return int|void
	 */
	public function sync( $page = 1, $batch_size = 100 ) {
		// Reset per-batch caches.
		$this->currency_cache = null;

		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		// get WooCommerce products (exclude already-imported products).
		// Note: wc_get_products() strips raw meta_query args, so we use the official filter.
		add_filter( 'woocommerce_product_data_store_cpt_get_products_query', [ $this, 'excludeImportedProducts' ], 10, 2 );

		$products = wc_get_products(
			[
				'limit'                 => $batch_size,
				'page'                  => $page,
				'return'                => 'ids',
				'paginate'              => true,
				'surecart_not_imported' => true,
			]
		);

		remove_filter( 'woocommerce_product_data_store_cpt_get_products_query', [ $this, 'excludeImportedProducts' ], 10 );

		// Validate wc_get_products() result in case WooCommerce was deactivated mid-sync.
		if ( ! is_object( $products ) || ! isset( $products->products, $products->max_num_pages ) ) {
			return;
		}

		// Sync each product.
		foreach ( $products->products as $product_id ) {
			$this->syncProduct( $product_id );
		}

		// Create import batch if we have products.
		if ( ! empty( $this->products_import_batch ) ) {
			$import = ( new ProductImport() )->create( [ 'data' => $this->products_import_batch ] );
			$this->products_import_batch = []; // Clear batch after import.

			// Accumulate import IDs across batches for the completion notice.
			if ( ! is_wp_error( $import ) && ! empty( $import->id ) ) {
				$existing_ids = get_option( 'sc_woo_import_ids', [] );
				$existing_ids[] = $import->id;
				update_option( 'sc_woo_import_ids', $existing_ids );
			} elseif ( is_wp_error( $import ) ) {
				error_log( 'SureCart WooCommerce Sync: Import failed - ' . $import->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			}
		}

		// if the total number of pages less than or equal to the current page, we don't have another page.
		if ( $products->max_num_pages <= $page ) {
			// All batches processed - check if ANY imports were created.
			$import_ids = get_option( 'sc_woo_import_ids', [] );

			if ( empty( $import_ids ) ) {
				// No imports created - check if products were skipped.
				$session_id = get_option( 'sc_woo_import_session_id' );

				if ( $session_id ) {
					$transient_key    = 'sc_woo_import_skipped_' . $session_id;
					$skipped_products = get_transient( $transient_key );

					if ( ! empty( $skipped_products ) ) {
						// All products skipped - store session_id for results page.
						update_option( 'sc_woo_import_all_skipped', $session_id, false );
					}
				}
			}

			return;
		}

		// get the next batch.
		return $this->dispatch( $page + 1, $batch_size );
	}

	/**
	 * Sync a single product.
	 *
	 * @param int $product_id Product ID.
	 * @return void
	 */
	public function syncProduct( $product_id ) {
		try {
			$product = wc_get_product( $product_id );

			if ( ! $product ) {
				$this->trackSkippedProduct( null, 'invalid', 'product_not_found' );
				return;
			}

			// Skip unsupported product types.
			$product_type = $product->get_type();
			if ( in_array( $product_type, [ 'grouped', 'external' ], true ) ) {
				$this->trackSkippedProduct( $product, $product_type, 'unsupported_type' );
				return;
			}

			// Map the WooCommerce Product to SureCart and save in the imports batch.
			$this->mapWooCommerceProductToSureCart( $product );

			// Mark product as imported to prevent duplicate syncing.
			update_post_meta( $product_id, '_surecart_imported', time() );

		} catch ( \Exception $e ) {
			error_log( sprintf( 'SureCart WooCommerce Sync: Failed to sync product %d - %s', $product_id, $e->getMessage() ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
	}

	/**
	 * Get or create import session ID for tracking skipped products.
	 *
	 * @return string Session ID (UUID).
	 */
	private function getImportSessionId() {
		$session_id = get_option( 'sc_woo_import_session_id' );
		if ( ! $session_id ) {
			$session_id = wp_generate_uuid4();
			update_option( 'sc_woo_import_session_id', $session_id, false );
		}
		return $session_id;
	}

	/**
	 * Track a skipped product for import results reporting.
	 *
	 * @param \WC_Product|null $product      WooCommerce Product (null if not found).
	 * @param string           $product_type Product type.
	 * @param string           $skip_reason  Machine-readable skip reason code.
	 * @return void
	 */
	private function trackSkippedProduct( $product, $product_type, $skip_reason ) {
		// Build human-readable skip reason message.
		$reason_messages = [
			'unsupported_type'  => sprintf(
				/* translators: %s: product type */
				__( 'Unsupported product type: %s', 'surecart' ),
				$product_type
			),
			'product_not_found' => __( 'Product not found in WooCommerce', 'surecart' ),
		];

		$reason = $reason_messages[ $skip_reason ] ?? __( 'Product skipped', 'surecart' );

		$skipped_data = [
			'wc_product_id' => $product ? $product->get_id() : 0,
			'name'          => $product ? ( $product->get_name() ?: __( 'Unnamed Product', 'surecart' ) ) : __( 'Unknown Product', 'surecart' ),
			'type'          => $product_type,
			'reason'        => $reason,
		];

		// Get session ID for this import.
		$session_id    = $this->getImportSessionId();
		$transient_key = 'sc_woo_import_skipped_' . $session_id;

		// Retrieve existing skipped products from transient.
		$skipped_products = get_transient( $transient_key );
		if ( ! is_array( $skipped_products ) ) {
			$skipped_products = [];
		}

		$skipped_products[] = $skipped_data;

		// Store for 7 days (matches typical ImportRow retention).
		set_transient( $transient_key, $skipped_products, 7 * DAY_IN_SECONDS );
	}

	/**
	 * Map the WooCommerce Product to SureCart.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return void
	 */
	public function mapWooCommerceProductToSureCart( $product ) {
		// Build product data using helper methods.
		$product_import_data = $this->mapCoreFields( $product );

		// Prices (CRITICAL).
		$product_import_data['prices'] = $this->mapPrices( $product );

		// Categories to collections (CRITICAL).
		$product_import_data = array_merge( $product_import_data, $this->mapCategories( $product ) );

		// Variants (for variable products).
		// Compute stock-ownership flag once to avoid scanning variations twice.
		$any_variation_manages_own_stock = false;
		if ( $product->is_type( 'variable' ) ) {
			$any_variation_manages_own_stock = $this->anyVariationManagesOwnStock( $product );
			$product_import_data             = array_merge( $product_import_data, $this->mapVariants( $product, $any_variation_manages_own_stock ) );
		}

		// Stock, shipping, tax.
		// When any variation owns its stock, product-level stock is suppressed.
		$product_import_data = array_merge( $product_import_data, $this->mapStockFields( $product, $any_variation_manages_own_stock ) );
		$product_import_data = array_merge( $product_import_data, $this->mapShippingFields( $product ) );
		$product_import_data = array_merge( $product_import_data, $this->mapTaxFields( $product ) );

		// Reviews.
		$product_import_data            = array_merge( $product_import_data, $this->mapReviewsFields( $product ) );
		$product_import_data['reviews'] = $this->mapReviews( $product );

		// Media (with bug fix).
		$product_import_data['product_medias'] = $this->mapMedia( $product );

		// Metadata (comprehensive WooCommerce data).
		$product_import_data['metadata'] = $this->mapMetadata( $product );

		// Allow filtering.
		$product_import_data = apply_filters( 'surecart/woocommerce_sync/product_data', $product_import_data, $product );

		$this->products_import_batch[] = $product_import_data;
	}

	/**
	 * Map core product fields.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapCoreFields( $product ) {
		$core_fields = [
			'name'         => $product->get_name(),
			'slug'         => $product->get_slug(),
			'featured'     => $product->is_featured(),
			'status'       => $this->mapStatus( $product ),
			'description'  => $product->get_description(),
			'sku'          => $product->get_sku(),
			'archived'     => $product->get_status() === 'trash',
			'recurring'    => $this->isSubscriptionProduct( $product ),
			'cataloged_at' => $product->get_date_created() ? $product->get_date_created()->getTimestamp() : null,
		];

		// Purchase limit (sold individually).
		if ( $product->get_sold_individually() ) {
			$core_fields['purchase_limit'] = 1;
		}

		// Licensing (if applicable).
		if ( $this->hasLicensing( $product ) ) {
			$core_fields['licensing_enabled']        = true;
			$core_fields['license_activation_limit'] = $this->getLicenseActivationLimit( $product );
		}

		return $core_fields;
	}

	/**
	 * Map product status considering catalog visibility.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return string
	 */
	public function mapStatus( $product ) {
		$status             = $product->get_status();
		$catalog_visibility = $product->get_catalog_visibility();

		// Hidden products map to draft.
		if ( 'hidden' === $catalog_visibility || 'private' === $status ) {
			return 'draft';
		}

		return 'publish' === $status ? 'published' : 'draft';
	}

	/**
	 * Check if product is a subscription.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return bool
	 */
	public function isSubscriptionProduct( $product ) {
		return class_exists( 'WC_Subscriptions_Product' ) && \WC_Subscriptions_Product::is_subscription( $product );
	}

	/**
	 * Check if product has licensing enabled.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return bool
	 */
	public function hasLicensing( $product ) {
		return 'yes' === get_post_meta( $product->get_id(), '_has_license', true );
	}

	/**
	 * Get license activation limit.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return int|null
	 */
	public function getLicenseActivationLimit( $product ) {
		$limit = get_post_meta( $product->get_id(), '_license_activation_limit', true );
		return $limit ? (int) $limit : null;
	}

	/**
	 * Map prices array.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapPrices( $product ) {
		$prices = [];

		// Subscription products.
		if ( $this->isSubscriptionProduct( $product ) ) {
			return $this->mapSubscriptionPrices( $product );
		}

		// Simple products.
		$price_data = [
			'amount'   => $this->convertPriceToInteger( $product->get_price() ),
			'currency' => strtolower( $this->getCurrency() ),
			// translators: %s: Product name.
			'name'     => sprintf( __( '%s Price', 'surecart' ), $product->get_name() ),
			'position' => 0,
			'archived' => false,
		];

		// Sale price -> scratch_amount.
		if ( $product->is_on_sale() && $product->get_sale_price() ) {
			$price_data['scratch_amount'] = $this->convertPriceToInteger( $product->get_regular_price() );
			$price_data['amount']         = $this->convertPriceToInteger( $product->get_sale_price() );
		}

		// Metadata.
		$price_data['metadata'] = [
			'wc_product_id'    => $product->get_id(),
			'wc_price_type'    => 'regular',
			'wc_tax_class'     => $product->get_tax_class(),
			'wc_regular_price' => $product->get_regular_price(),
			'wc_sale_price'    => $product->get_sale_price(),
		];

		// Sale dates.
		if ( $product->get_date_on_sale_from() ) {
			$price_data['metadata']['wc_sale_start'] = $product->get_date_on_sale_from()->format( 'c' );
		}
		if ( $product->get_date_on_sale_to() ) {
			$price_data['metadata']['wc_sale_end'] = $product->get_date_on_sale_to()->format( 'c' );
		}

		$prices[] = apply_filters( 'surecart/woocommerce_sync/price', $price_data, $product );

		return $prices;
	}

	/**
	 * Map subscription prices.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapSubscriptionPrices( $product ) {
		if ( ! class_exists( 'WC_Subscriptions_Product' ) ) {
			return [];
		}

		$price_data = [
			'amount'                             => $this->convertPriceToInteger( $product->get_price() ),
			'currency'                           => strtolower( $this->getCurrency() ),
			// translators: %s: Product name.
			'name'                               => sprintf( __( '%s Subscription', 'surecart' ), $product->get_name() ),
			'position'                           => 0,
			'archived'                           => false,

			// Recurring fields.
			'recurring_interval'                 => \WC_Subscriptions_Product::get_period( $product ),
			'recurring_interval_count'           => (int) \WC_Subscriptions_Product::get_interval( $product ),
			'recurring_period_count'             => ! empty( \WC_Subscriptions_Product::get_length( $product ) ) ? (int) \WC_Subscriptions_Product::get_length( $product ) : null,

			// Trial.
			'trial_duration_days'                => $this->getTrialDays( $product ),

			// Setup fee.
			'setup_fee_enabled'                  => \WC_Subscriptions_Product::get_sign_up_fee( $product ) > 0,
			'setup_fee_amount'                   => $this->convertPriceToInteger( \WC_Subscriptions_Product::get_sign_up_fee( $product ) ),
			'setup_fee_name'                     => __( 'Sign-up Fee', 'surecart' ),
			'setup_fee_trial_enabled'            => false,

			// Portal.
			'portal_subscription_update_enabled' => true,

			// Metadata.
			'metadata'                           => [
				'wc_subscription_product' => true,
				'wc_product_id'           => $product->get_id(),
			],
		];

		// Sale price.
		if ( $product->is_on_sale() && $product->get_sale_price() ) {
			$price_data['scratch_amount'] = $this->convertPriceToInteger( $product->get_regular_price() );
		}

		return [ $price_data ];
	}

	/**
	 * Calculate trial period in days.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return int|null
	 */
	public function getTrialDays( $product ) {
		if ( ! class_exists( 'WC_Subscriptions_Product' ) ) {
			return null;
		}

		$trial_length = \WC_Subscriptions_Product::get_trial_length( $product );
		$trial_period = \WC_Subscriptions_Product::get_trial_period( $product );

		if ( ! $trial_length || ! $trial_period ) {
			return null;
		}

		$days_map = [
			'day'   => 1,
			'week'  => 7,
			'month' => 30,
			'year'  => 365,
		];

		return (int) ( $trial_length * ( $days_map[ $trial_period ] ?? 1 ) );
	}

	/**
	 * Convert price to integer (cents).
	 *
	 * @param string|float $price Price.
	 * @return int
	 */
	public function convertPriceToInteger( $price ) {
		if ( empty( $price ) ) {
			return 0;
		}

		$currency = $this->getCurrency();

		// Zero-decimal currencies (no cents).
		$zero_decimal = in_array(
			$currency,
			[ 'JPY', 'KRW', 'VND', 'CLP', 'PYG', 'BIF', 'DJF', 'GNF', 'ISK', 'KMF', 'XAF', 'XOF', 'XPF' ],
			true
		);

		return $zero_decimal ? (int) $price : (int) round( (float) $price * 100 );
	}

	/**
	 * Get cached WooCommerce currency.
	 *
	 * @return string
	 */
	private function getCurrency() {
		if ( null === $this->currency_cache ) {
			$this->currency_cache = \get_woocommerce_currency();
		}
		return $this->currency_cache;
	}

	/**
	 * Map WooCommerce weight unit to SureCart accepted value.
	 *
	 * @param string $wc_unit WooCommerce weight unit.
	 * @return string
	 */
	public function mapWeightUnit( $wc_unit ) {
		$map = [
			'lbs' => 'lb',
			'oz'  => 'oz',
			'kg'  => 'kg',
			'g'   => 'g',
		];
		return $map[ $wc_unit ] ?? 'lb';
	}

	/**
	 * Map WooCommerce dimension unit to SureCart accepted value.
	 *
	 * @param string $wc_unit WooCommerce dimension unit.
	 * @return string
	 */
	public function mapDimensionUnit( $wc_unit ) {
		$map = [
			'cm' => 'cm',
			'mm' => 'mm',
			'm'  => 'm',
			'in' => 'in',
			'ft' => 'ft',
			'yd' => 'ft',
		];
		return $map[ $wc_unit ] ?? 'in';
	}

	/**
	 * Get or create ProductCollections from WooCommerce taxonomy terms using API.
	 *
	 * @param array $terms_data Array of term data with 'term' and 'source' keys.
	 * @return array Array of ProductCollection objects from API.
	 */
	public function getOrCreateCollections( $terms_data ) {
		$collections = [];

		foreach ( $terms_data as $slug => $data ) {
			$wc_term         = $data['term'];
			$taxonomy_source = $data['source'];

			// Normalize slug for cache key (lowercase, trim).
			$cache_key = strtolower( trim( $slug ) );

			try {
				// Check cache first to avoid duplicate API calls.
				if ( isset( $this->collections_cache[ $cache_key ] ) ) {
					$collections[] = $this->collections_cache[ $cache_key ];
					continue;
				}

				// Find existing ProductCollection by slug using API.
				$collection = \SureCart\Models\ProductCollection::where( [ 'query' => $cache_key ] )->first();

				// If collection exists on API, cache and use it.
				if ( ! empty( $collection->id ) && ! is_wp_error( $collection ) ) {
					$this->collections_cache[ $cache_key ] = $collection;
					$collections[]                         = $collection;
					continue;
				}

				// Collection doesn't exist - create it via API.
				$collection = \SureCart\Models\ProductCollection::create(
					[
						'name'        => $wc_term->name,
						'slug'        => $cache_key,
						'description' => $wc_term->description ?? '',
						'metadata'    => [
							'wc_source'  => $taxonomy_source,
							'wc_term_id' => $wc_term->term_id,
						],
					]
				);

				// Check for errors.
				if ( is_wp_error( $collection ) ) {
					continue;
				}

				$this->collections_cache[ $cache_key ] = $collection;
				$collections[]                         = $collection;
			} catch ( \Exception $e ) {
				error_log( sprintf( 'SureCart WooCommerce Sync: Failed to get/create collection for slug "%s" - %s', $cache_key, $e->getMessage() ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			}
		}

		return $collections;
	}

	/**
	 * Map categories to product collections.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapCategories( $product ) {
		$category_ids = $product->get_category_ids();
		$tag_ids      = $product->get_tag_ids();
		$all_terms    = [];

		// Collect categories.
		foreach ( $category_ids as $cat_id ) {
			$category = get_term( $cat_id, 'product_cat' );
			if ( $category && ! is_wp_error( $category ) ) {
				// Normalize slug for deduplication (lowercase, trim).
				$normalized_slug               = strtolower( trim( $category->slug ) );
				$all_terms[ $normalized_slug ] = [
					'term'   => $category,
					'source' => 'product_cat',
				];
			}
		}

		// Collect tags.
		foreach ( $tag_ids as $tag_id ) {
			$tag = get_term( $tag_id, 'product_tag' );
			if ( $tag && ! is_wp_error( $tag ) ) {
				// Normalize slug for deduplication - if slug exists from category, keep the first source.
				$normalized_slug = strtolower( trim( $tag->slug ) );
				if ( ! isset( $all_terms[ $normalized_slug ] ) ) {
					$all_terms[ $normalized_slug ] = [
						'term'   => $tag,
						'source' => 'product_tag',
					];
				}
			}
		}

		// Collect brands (if WC Brands is active).
		if ( taxonomy_exists( 'product_brand' ) ) {
			$brand_ids = wp_get_post_terms( $product->get_id(), 'product_brand', [ 'fields' => 'ids' ] );
			if ( ! is_wp_error( $brand_ids ) ) {
				foreach ( $brand_ids as $brand_id ) {
					$brand = get_term( $brand_id, 'product_brand' );
					if ( $brand && ! is_wp_error( $brand ) ) {
						$normalized_slug = strtolower( trim( $brand->slug ) );
						if ( ! isset( $all_terms[ $normalized_slug ] ) ) {
							$all_terms[ $normalized_slug ] = [
								'term'   => $brand,
								'source' => 'product_brand',
							];
						}
					}
				}
			}
		}

		// Get or create collections for all unique terms.
		$all_collections = $this->getOrCreateCollections( $all_terms );

		// Return just the collection IDs if we have any.
		if ( empty( $all_collections ) ) {
			return [];
		}

		// Extract just the IDs from the ProductCollection objects and deduplicate.
		// Deduplication is needed because fuzzy API queries can match the same collection
		// for different WooCommerce terms (e.g., category "Digital Products" and tag "digital").
		$collection_ids = array_unique(
			array_map(
				function ( $collection ) {
					return $collection->id;
				},
				$all_collections
			)
		);

		return [
			'product_collections' => array_values( $collection_ids ),
		];
	}

	/**
	 * Map variants for variable products.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @param bool        $any_variation_manages_own_stock Whether any variation manages its own stock.
	 * @return array
	 */
	public function mapVariants( $product, $any_variation_manages_own_stock = false ) {
		if ( ! $product->is_type( 'variable' ) ) {
			return [];
		}

		$variant_options = [];
		$variants        = [];

		// Extract variant_options from attributes and build ordered keys for mapping.
		$attributes      = $product->get_attributes();
		$option_position = 0;
		$option_keys     = [];

		foreach ( $attributes as $attribute ) {
			if ( ! $attribute->get_variation() ) {
				continue;
			}

			// Track the attribute key for ordered variant mapping.
			$option_keys[] = 'attribute_' . sanitize_title( $attribute->get_name() );

			// Extract values array (CRITICAL).
			$values = [];
			if ( $attribute->is_taxonomy() ) {
				$term_ids = $attribute->get_options();
				foreach ( $term_ids as $term_id ) {
					$term = get_term( $term_id );
					if ( $term && ! is_wp_error( $term ) ) {
						$values[] = $term->name;
					}
				}
			} else {
				$values = $attribute->get_options();
			}

			$variant_options[] = [
				'name'         => wc_attribute_label( $attribute->get_name() ),
				'values'       => $values,
				'display_type' => 'dropdown',
				'position'     => $option_position++,
			];
		}

		// Map variations to variants.
		// Use get_children() instead of get_available_variations() to include ALL variations,
		// even those without prices or marked out of stock (which WooCommerce filters out).
		$variation_ids    = $product->get_children();
		$variant_position = 0;

		// Cache WC unit options before the loop to avoid repeated DB queries.
		$wc_weight_unit = get_option( 'woocommerce_weight_unit' );
		$wc_dim_unit    = get_option( 'woocommerce_dimension_unit' );
		$dim_multiplier = 'yd' === $wc_dim_unit ? 3 : 1;

		foreach ( $variation_ids as $variation_id ) {
			$variation = wc_get_product( $variation_id );
			if ( ! $variation ) {
				continue;
			}

			// Determine stock mode for this variation.
			$variation_stock_mode = $variation->managing_stock();

			$variant = [
				'sku'                          => $variation->get_sku(),
				'position'                     => $variant_position++,

				// Pricing.
				'amount'                       => $this->convertPriceToInteger( $variation->get_price() ),

				// Stock — determined after array init based on variation stock mode.

				// Backorders.
				'allow_out_of_stock_purchases' => $variation->backorders_allowed(),

				// Shipping.
				'auto_fulfill_enabled'         => $variation->is_virtual(),
				'shipping_enabled'             => ! $variation->is_virtual(),

				// Tax.
				'tax_enabled'                  => $variation->is_taxable(),
				'tax_category'                 => $variation->is_virtual() ? 'digital' : 'tangible',

				// Metadata.
				'metadata'                     => [
					'wc_variation_id'  => $variation->get_id(),
					'wc_parent_id'     => $product->get_id(),
					'wc_regular_price' => $variation->get_regular_price(),
					'wc_sale_price'    => $variation->get_sale_price(),
				],
			];

			// Set stock fields based on the variation's stock mode and product-wide context.
			// SureCart requires stock at either product-level or variant-level, not both.
			if ( true === $variation_stock_mode ) {
				// Variation has its own dedicated stock pool.
				$variant['stock_enabled']    = true;
				$variant['stock_adjustment'] = (int) $variation->get_stock_quantity();
			} elseif ( 'parent' === $variation_stock_mode && $any_variation_manages_own_stock ) {
				// Mixed case: this variant inherits parent stock, but other variants have
				// own stock, so product-level stock is suppressed. Set as out of stock.
				$variant['stock_enabled']    = true;
				$variant['stock_adjustment'] = 0;
			} else {
				// No stock management, or pure parent-only (product-level handles it).
				$variant['stock_enabled']    = false;
				$variant['stock_adjustment'] = 0;
			}

			// Only include weight if it's set and greater than 0.
			$variant_weight = (float) $variation->get_weight();
			if ( $variant_weight > 0 ) {
				$variant['weight']      = $variant_weight;
				$variant['weight_unit'] = $this->mapWeightUnit( $wc_weight_unit );
			}

			// Only include dimensions if at least one dimension is set and greater than 0.
			$variant_length = (float) $variation->get_length() * $dim_multiplier;
			$variant_width  = (float) $variation->get_width() * $dim_multiplier;
			$variant_height = (float) $variation->get_height() * $dim_multiplier;

			if ( $variant_length > 0 || $variant_width > 0 || $variant_height > 0 ) {
				$variant['dimensions'] = [
					'length' => $variant_length,
					'width'  => $variant_width,
					'height' => $variant_height,
					'unit'   => $this->mapDimensionUnit( $wc_dim_unit ),
				];
			}

			// Map attribute values to option_1, option_2, option_3 using parent attribute order.
			$attributes_map = $variation->get_variation_attributes();

			foreach ( $option_keys as $index => $key ) {
				$option_num = $index + 1;
				if ( $option_num > 3 ) {
					break;
				}
				if ( isset( $attributes_map[ $key ] ) && ! empty( $attributes_map[ $key ] ) ) {
					$variant[ "option_$option_num" ] = $attributes_map[ $key ];
				}
			}

			// Variation image.
			$image_id = $variation->get_image_id();
			if ( $image_id ) {
				$variant['metadata']['wp_image_id'] = $image_id;
			}

			$variants[] = $variant;
		}

		return [
			'variant_options' => $variant_options,
			'variants'        => apply_filters( 'surecart/woocommerce_sync/variants', $variants, $product ),
		];
	}

	/**
	 * Determine whether any variation on a variable product manages its own stock.
	 *
	 * Returns true if at least one variation has managing_stock() === true (strict),
	 * meaning it has a dedicated stock quantity separate from the parent product.
	 *
	 * @param \WC_Product $product WooCommerce variable product.
	 * @return bool
	 */
	private function anyVariationManagesOwnStock( $product ) {
		foreach ( $product->get_children() as $variation_id ) {
			$variation = wc_get_product( $variation_id );
			if ( ! $variation ) {
				continue;
			}
			if ( true === $variation->managing_stock() ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Map stock fields.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @param bool        $is_variable_with_variant_stock Whether this is a variable product where variants own the stock.
	 * @return array
	 */
	public function mapStockFields( $product, $is_variable_with_variant_stock = false ) {
		// For variable products where variants own the stock, enable the product-level
		// master toggle (required for variant stock tracking to work in SureCart)
		// but do NOT set stock_adjustment to avoid double-counting.
		if ( $is_variable_with_variant_stock ) {
			return [
				'stock_enabled' => true,
			];
		}

		$managing_stock = $product->managing_stock();

		if ( ! $managing_stock ) {
			return [];
		}

		return [
			'stock_enabled'                => true,
			'allow_out_of_stock_purchases' => $product->backorders_allowed(),
			'stock_adjustment'             => (int) $product->get_stock_quantity(),
		];
	}

	/**
	 * Map shipping fields.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapShippingFields( $product ) {
		$is_digital = $product->is_virtual() || $product->is_downloadable();

		if ( $is_digital ) {
			return [
				'shipping_enabled'     => false,
				'auto_fulfill_enabled' => true,
			];
		}

		$shipping_fields = [
			'shipping_enabled'     => true,
			'auto_fulfill_enabled' => false,
		];

		// Only include weight if it's set and greater than 0.
		$weight = (float) $product->get_weight();
		if ( $weight > 0 ) {
			$shipping_fields['weight']      = $weight;
			$shipping_fields['weight_unit'] = $this->mapWeightUnit( get_option( 'woocommerce_weight_unit' ) );
		}

		// Only include dimensions if at least one dimension is set and greater than 0.
		$wc_dim_unit    = get_option( 'woocommerce_dimension_unit' );
		$dim_multiplier = 'yd' === $wc_dim_unit ? 3 : 1;
		$length         = (float) $product->get_length() * $dim_multiplier;
		$width          = (float) $product->get_width() * $dim_multiplier;
		$height         = (float) $product->get_height() * $dim_multiplier;

		if ( $length > 0 || $width > 0 || $height > 0 ) {
			$shipping_fields['dimensions'] = [
				'length' => $length,
				'width'  => $width,
				'height' => $height,
				'unit'   => $this->mapDimensionUnit( $wc_dim_unit ),
			];
		}

		return $shipping_fields;
	}

	/**
	 * Map tax fields.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapTaxFields( $product ) {
		$taxable    = $product->is_taxable();
		$is_digital = $product->is_virtual() || $product->is_downloadable();

		// Determine tax category.
		$tax_category = $is_digital ? 'digital' : 'tangible';
		if ( $this->isSubscriptionProduct( $product ) ) {
			$tax_category = 'saas';
		}

		return [
			'tax_enabled'  => $taxable,
			'tax_category' => $tax_category,
		];
	}

	/**
	 * Map reviews fields (settings).
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapReviewsFields( $product ) {
		$comments_open = comments_open( $product->get_id() );
		return [
			'reviews_enabled' => $comments_open,
			'solicit_reviews' => $comments_open,
		];
	}

	/**
	 * Map individual reviews.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapReviews( $product ) {
		$reviews = [];

		// Get product reviews from WordPress comments.
		$comments = get_comments(
			[
				'post_id' => $product->get_id(),
				'type'    => 'review',
				'status'  => 'approve',
				'orderby' => 'comment_date',
				'order'   => 'DESC',
			]
		);

		foreach ( $comments as $comment ) {
			$rating = get_comment_meta( $comment->comment_ID, 'rating', true );

			$reviews[] = [
				'title'    => get_comment_meta( $comment->comment_ID, 'review_title', true ),
				'body'     => $comment->comment_content,
				'stars'    => $rating ? (float) $rating : null,
				'metadata' => [
					'wc_comment_id'     => (int) $comment->comment_ID,
					'customer_name'     => $comment->comment_author,
					'customer_email'    => $comment->comment_author_email,
					'review_date'       => $comment->comment_date,
					'verified_purchase' => wc_review_is_from_verified_owner( $comment->comment_ID ),
				],
			];
		}

		return $reviews;
	}

	/**
	 * Map media (with bug fix).
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapMedia( $product ) {
		$media = [];

		// Featured image.
		$featured_image_id = $product->get_image_id();
		if ( $featured_image_id ) {
			$image_url = wp_get_attachment_url( $featured_image_id );
			if ( $image_url ) {
				$media[] = [ 'url' => $image_url ];
			}
		}

		// Gallery images.
		foreach ( $product->get_gallery_image_ids() as $id ) {
			$image_url = wp_get_attachment_url( $id );
			if ( $image_url ) {
				$media[] = [ 'url' => $image_url ];
			}
		}

		return $media;
	}

	/**
	 * Map comprehensive metadata.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapMetadata( $product ) {
		$metadata = [
			// Traceability (Critical).
			'wc_product_id'          => $product->get_id(),
			'wc_product_type'        => $product->get_type(),
			'wc_synced_at'           => current_time( 'c' ),
			'wc_permalink'           => get_permalink( $product->get_id() ),

			// Product Analytics.
			'wc_total_sales'         => (int) $product->get_total_sales(),
			'wc_average_rating'      => (float) $product->get_average_rating(),
			'wc_rating_counts'       => wp_json_encode( $product->get_rating_counts() ),
			'wc_review_count'        => (int) $product->get_review_count(),

			// Product Flags.
			'is_virtual'             => $product->is_virtual(),
			'is_downloadable'        => $product->is_downloadable(),
			'catalog_visibility'     => $product->get_catalog_visibility(),

			// Relationships (Marketing Value).
			'wc_upsell_ids'          => wp_json_encode( $product->get_upsell_ids() ),
			'wc_cross_sell_ids'      => wp_json_encode( $product->get_cross_sell_ids() ),

			// SEO & Content.
			'short_description'      => $product->get_short_description(),
			'purchase_note'          => $product->get_purchase_note(),

			// Dates.
			'wc_date_created'        => $product->get_date_created() ? $product->get_date_created()->format( 'c' ) : null,
			'wc_date_modified'       => $product->get_date_modified() ? $product->get_date_modified()->format( 'c' ) : null,

			// Advanced Stock.
			'wc_low_stock_threshold' => $product->get_low_stock_amount(),
			'wc_stock_status'        => $product->get_stock_status(),

			// Tax.
			'wc_tax_class'           => $product->get_tax_class(),
		];

		// Downloadable files (Critical for digital products).
		if ( $product->is_downloadable() ) {
			$downloads = [];
			foreach ( $product->get_downloads() as $download ) {
				$downloads[] = [
					'name' => $download->get_name(),
					'file' => $download->get_file(),
					'id'   => $download->get_id(),
				];
			}
			$metadata['download_files']  = wp_json_encode( $downloads );
			$metadata['download_limit']  = $product->get_download_limit();
			$metadata['download_expiry'] = $product->get_download_expiry();
		}

		// Shipping class.
		$shipping_class_id = $product->get_shipping_class_id();
		if ( $shipping_class_id ) {
			$shipping_class = get_term( $shipping_class_id, 'product_shipping_class' );
			if ( $shipping_class && ! is_wp_error( $shipping_class ) ) {
				$metadata['wc_shipping_class'] = $shipping_class->slug;
			}
		}

		return apply_filters( 'surecart/woocommerce_sync/product_metadata', $metadata, $product );
	}
}
