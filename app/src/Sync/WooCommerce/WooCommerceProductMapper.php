<?php

namespace SureCart\Sync\WooCommerce;

/**
 * Maps WooCommerce products to SureCart import data.
 *
 * Caching mapper that converts WC product objects into the array format
 * expected by the SureCart product import API. Caches collections and
 * currency lookups per batch to avoid duplicate API/DB calls.
 *
 * @package SureCart
 */
class WooCommerceProductMapper {

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
	 * Cached WooCommerce weight unit.
	 *
	 * @var string|null
	 */
	private $weight_unit_cache = null;

	/**
	 * Cached WooCommerce dimension unit.
	 *
	 * @var string|null
	 */
	private $dimension_unit_cache = null;

	/**
	 * Reset all caches.
	 *
	 * @return void
	 */
	public function resetCaches() {
		$this->currency_cache        = null;
		$this->weight_unit_cache     = null;
		$this->dimension_unit_cache  = null;
		$this->collections_cache     = [];
	}

	/**
	 * Map the WooCommerce Product to SureCart.
	 *
	 * @param \WC_Product $product WooCommerce Product.
	 * @return array
	 */
	public function mapWooCommerceProductToSureCart( $product ) {
		// Build product data using helper methods.
		$product_import_data = $this->mapCoreFields( $product );

		// Prices (CRITICAL).
		$product_import_data['prices'] = $this->mapPrices( $product );

		// Categories to collections (CRITICAL).
		$product_import_data = array_merge( $product_import_data, $this->mapCategories( $product ) );

		// Variants (for variable products).
		// Pre-load all variations once to avoid duplicate DB queries across methods.
		$any_variation_manages_own_stock = false;
		if ( $product->is_type( 'variable' ) ) {
			$variations                      = array_filter( array_map( 'wc_get_product', $product->get_children() ) );
			$any_variation_manages_own_stock = $this->anyVariationManagesOwnStock( $variations );
			$product_import_data             = array_merge( $product_import_data, $this->mapVariants( $product, $any_variation_manages_own_stock, $variations ) );
		}

		// Stock, shipping, tax.
		// When any variation owns its stock, product-level stock is suppressed.
		$product_import_data = array_merge( $product_import_data, $this->mapStockFields( $product, $any_variation_manages_own_stock ) );
		$product_import_data = array_merge( $product_import_data, $this->mapShippingFields( $product ) );
		$product_import_data = array_merge( $product_import_data, $this->mapTaxFields( $product ) );

		// Reviews.
		$product_import_data            = array_merge( $product_import_data, $this->mapReviewsFields( $product ) );
		$product_import_data['reviews'] = $this->mapReviews( $product );

		// Media.
		$product_import_data['product_medias'] = $this->mapMedia( $product );

		// Metadata (comprehensive WooCommerce data).
		$product_import_data['metadata'] = $this->mapMetadata( $product );

		// Allow filtering.
		$product_import_data = apply_filters( 'surecart/woocommerce_sync/product_data', $product_import_data, $product );

		return $product_import_data;
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
			'description'  => wp_kses_post( $product->get_description() ),
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

		// Sale price — scratch_amount uses get_regular_price() (full price shown struck-through)
		// while amount above uses get_price() which WC resolves to the active sale price.
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

		// Intentional approximations: month=30d, year=365d. SureCart trial_duration_days
		// only accepts whole days, so exact calendar precision isn't possible.
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

		// Zero-decimal currencies (no cents). This must be a currency-based check,
		// not wc_get_price_decimals(), because that function reads the store's display
		// setting (woocommerce_price_num_decimals option) which a store owner can
		// misconfigure independently of the actual currency.
		$zero_decimal = in_array(
			$currency,
			[ 'BIF', 'CLP', 'DJF', 'GNF', 'HUF', 'ISK', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'TWD', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF' ],
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
			if ( ! function_exists( 'get_woocommerce_currency' ) ) {
				return 'USD';
			}
			$this->currency_cache = \get_woocommerce_currency();
		}
		return $this->currency_cache;
	}

	/**
	 * Get cached WooCommerce weight unit.
	 *
	 * @return string
	 */
	private function getWeightUnit() {
		if ( null === $this->weight_unit_cache ) {
			$this->weight_unit_cache = get_option( 'woocommerce_weight_unit', 'lbs' );
		}
		return $this->weight_unit_cache;
	}

	/**
	 * Get cached WooCommerce dimension unit.
	 *
	 * @return string
	 */
	private function getDimensionUnit() {
		if ( null === $this->dimension_unit_cache ) {
			$this->dimension_unit_cache = get_option( 'woocommerce_dimension_unit', 'in' );
		}
		return $this->dimension_unit_cache;
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
			'yd' => 'ft', // Intentional: SureCart has no yard unit, so we map to feet and multiply values by 3 (see $dim_multiplier).
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
		$uncached    = [];

		// Step 1: Resolve from cache, collect uncached slugs.
		foreach ( $terms_data as $slug => $data ) {
			$cache_key = strtolower( trim( $slug ) );

			if ( isset( $this->collections_cache[ $cache_key ] ) ) {
				$collections[] = $this->collections_cache[ $cache_key ];
			} else {
				$uncached[ $cache_key ] = $data;
			}
		}

		if ( empty( $uncached ) ) {
			return $collections;
		}

		// Step 2: Batch-fetch existing collections from API (single request).
		$uncached_slugs = array_keys( $uncached );
		try {
			// API doesn't support reliable slug filtering, so check each collection individually
			foreach ( $uncached as $cache_key => $data ) {
				$wc_term = $data['term'];

				// Try to find existing collection by name using query search
				$search_results = \SureCart\Models\ProductCollection::where(
					[
						'query' => $wc_term->name,
						'limit' => 10,
					]
				)->get();

				if ( ! is_wp_error( $search_results ) && is_array( $search_results ) ) {
					foreach ( $search_results as $result ) {
						// Check for exact name match (case-insensitive)
						if ( ! empty( $result->name ) && ! empty( $result->id ) ) {
							if ( strtolower( trim( $result->name ) ) === strtolower( trim( $wc_term->name ) ) ) {
								$this->collections_cache[ $cache_key ] = $result;
								break; // Found exact match, stop looking
							}
						}
					}
				}
			}
		} catch ( \Exception $e ) {
			error_log( sprintf( 'SureCart WooCommerce Sync: Batch fetch collections failed - %s', $e->getMessage() ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}

		// Step 3: Resolve newly cached or create missing collections.
		foreach ( $uncached as $cache_key => $data ) {
			try {
				if ( isset( $this->collections_cache[ $cache_key ] ) ) {
					$collections[] = $this->collections_cache[ $cache_key ];
					continue;
				}

				// Collection not found in batch results — create it via API.
				$wc_term    = $data['term'];
				$collection = \SureCart\Models\ProductCollection::create(
					[
						'name'        => $wc_term->name,
						'slug'        => $cache_key,
						'description' => $wc_term->description ?? '',
						'metadata'    => [
							'wc_source'  => $data['source'],
							'wc_term_id' => $wc_term->term_id,
						],
					]
				);

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

		// Batch-fetch categories to avoid N+1 get_term() calls.
		if ( ! empty( $category_ids ) ) {
			$categories = get_terms(
				[
					'taxonomy'   => 'product_cat',
					'include'    => $category_ids,
					'hide_empty' => false,
				]
			);
			if ( ! is_wp_error( $categories ) ) {
				foreach ( $categories as $category ) {
					$normalized_slug               = strtolower( trim( $category->slug ) );
					$all_terms[ $normalized_slug ] = [
						'term'   => $category,
						'source' => 'product_cat',
					];
				}
			}
		}

		// Batch-fetch tags to avoid N+1 get_term() calls.
		if ( ! empty( $tag_ids ) ) {
			$tags = get_terms(
				[
					'taxonomy'   => 'product_tag',
					'include'    => $tag_ids,
					'hide_empty' => false,
				]
			);
			if ( ! is_wp_error( $tags ) ) {
				foreach ( $tags as $tag ) {
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
		}

		// Batch-fetch brands (if WC Brands is active).
		if ( taxonomy_exists( 'product_brand' ) ) {
			$brand_ids = wp_get_post_terms( $product->get_id(), 'product_brand', [ 'fields' => 'ids' ] );
			if ( ! is_wp_error( $brand_ids ) && ! empty( $brand_ids ) ) {
				$brands = get_terms(
					[
						'taxonomy'   => 'product_brand',
						'include'    => $brand_ids,
						'hide_empty' => false,
					]
				);
				if ( ! is_wp_error( $brands ) ) {
					foreach ( $brands as $brand ) {
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
	 * @param array       $variations Pre-loaded variation objects.
	 * @return array
	 */
	public function mapVariants( $product, $any_variation_manages_own_stock = false, $variations = [] ) {
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
					$term = get_term( $term_id, $attribute->get_taxonomy() );
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
		// Use pre-loaded variations if available, otherwise load from get_children().
		if ( empty( $variations ) ) {
			$children   = $product->get_children();
			$variations = ! empty( $children ) ? array_filter( array_map( 'wc_get_product', $children ) ) : [];
		}

		$variant_position = 0;

		// Pre-load taxonomy terms to avoid N+1 get_term_by() calls inside the variation loop.
		$term_name_cache = [];
		foreach ( $variations as $variation ) {
			$attrs = $variation->get_variation_attributes();
			foreach ( $option_keys as $key ) {
				if ( isset( $attrs[ $key ] ) && ! empty( $attrs[ $key ] ) ) {
					$taxonomy = str_replace( 'attribute_', '', $key );
					if ( taxonomy_exists( $taxonomy ) ) {
						$term_name_cache[ $taxonomy ][] = $attrs[ $key ];
					}
				}
			}
		}
		foreach ( $term_name_cache as $taxonomy => $slugs ) {
			$terms = get_terms(
				[
					'taxonomy'   => $taxonomy,
					'slug'       => array_unique( $slugs ),
					'hide_empty' => false,
				]
			);
			$resolved = [];
			if ( ! is_wp_error( $terms ) ) {
				foreach ( $terms as $t ) {
					$resolved[ $t->slug ] = $t->name;
				}
			}
			$term_name_cache[ $taxonomy ] = $resolved;
		}

		// Use cached WC unit options to avoid repeated DB queries.
		$wc_weight_unit = $this->getWeightUnit();
		$wc_dim_unit    = $this->getDimensionUnit();
		$dim_multiplier = 'yd' === $wc_dim_unit ? 3 : 1;

		foreach ( $variations as $variation ) {

			// Determine stock mode for this variation.
			$variation_stock_mode = $variation->managing_stock();

			$variant = [
				'sku'                          => $variation->get_sku(),
				'position'                     => $variant_position++,

				// Pricing.
				'amount'                       => $this->convertPriceToInteger( $variation->get_price() ),

				// Stock -- determined after array init based on variation stock mode.

				// Backorders.
				'allow_out_of_stock_purchases' => $variation->backorders_allowed(),

				// Shipping.
				'auto_fulfill_enabled'         => $variation->is_virtual(),
				'shipping_enabled'             => ! $variation->is_virtual(),

				// Tax.
				'tax_enabled'                  => $variation->is_taxable(),
				'tax_category'                 => $this->isSubscriptionProduct( $product ) ? 'digital' : ( $variation->is_virtual() ? 'digital' : 'tangible' ),

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
					$value = $attributes_map[ $key ];

					// For taxonomy attributes, WooCommerce stores slugs in variation attributes
					// but we use term names in variant_options.values -- convert slug to name.
					// Uses pre-loaded $term_name_cache to avoid N+1 get_term_by() queries.
					$taxonomy = str_replace( 'attribute_', '', $key );
					if ( isset( $term_name_cache[ $taxonomy ][ $value ] ) ) {
						$value = $term_name_cache[ $taxonomy ][ $value ];
					}

					$variant[ "option_$option_num" ] = $value;
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
	 * @param \WC_Product_Variation[] $variations Pre-loaded variation objects.
	 * @return bool
	 */
	private function anyVariationManagesOwnStock( $variations ) {
		foreach ( $variations as $variation ) {
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
			$shipping_fields['weight_unit'] = $this->mapWeightUnit( $this->getWeightUnit() );
		}

		// Only include dimensions if at least one dimension is set and greater than 0.
		$wc_dim_unit    = $this->getDimensionUnit();
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
			$tax_category = 'digital';
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
				'number'  => 100,
			]
		);

		foreach ( $comments as $comment ) {
			$rating = get_comment_meta( $comment->comment_ID, 'rating', true );

			$reviews[] = [
				'title'    => get_comment_meta( $comment->comment_ID, 'review_title', true ),
				'body'     => wp_kses_post( $comment->comment_content ),
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
	 * Map media.
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
			'wc_synced_at'           => gmdate( 'c' ),
			'wc_permalink'           => get_permalink( $product->get_id() ),

			// Product Analytics.
			'wc_total_sales'         => (int) $product->get_total_sales(),
			'wc_average_rating'      => (float) $product->get_average_rating(),
			'wc_rating_counts'       => wp_json_encode( $product->get_rating_counts() ),
			'wc_review_count'        => (int) $product->get_review_count(),

			// Products Flags.
			'is_virtual'             => $product->is_virtual(),
			'is_downloadable'        => $product->is_downloadable(),
			'catalog_visibility'     => $product->get_catalog_visibility(),

			// Relationships (Marketing Value).
			'wc_upsell_ids'          => wp_json_encode( $product->get_upsell_ids() ),
			'wc_cross_sell_ids'      => wp_json_encode( $product->get_cross_sell_ids() ),

			// SEO & Content.
			'short_description'      => wp_kses_post( $product->get_short_description() ),
			'purchase_note'          => wp_kses_post( $product->get_purchase_note() ),

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
					'file' => esc_url_raw( $download->get_file() ),
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
