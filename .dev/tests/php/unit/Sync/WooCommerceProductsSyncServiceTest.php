<?php
/**
 * WooCommerce function stubs for testing.
 * These must be in the global namespace so the mapper can call them.
 */

namespace {
	if ( ! class_exists( 'WooCommerce' ) ) {
		class WooCommerce {}
	}

	if ( ! class_exists( 'WC_Product' ) ) {
		class WC_Product {}
	}

	if ( ! class_exists( 'WC_DateTime' ) ) {
		class WC_DateTime extends \DateTime {}
	}

	if ( ! class_exists( 'WC_Subscriptions_Product' ) ) {
		class WC_Subscriptions_Product {
			public static $mock_is_subscription  = false;
			public static $mock_period            = 'month';
			public static $mock_interval          = 1;
			public static $mock_length            = 0;
			public static $mock_trial_length      = 0;
			public static $mock_trial_period      = '';
			public static $mock_sign_up_fee       = 0;

			public static function is_subscription( $product ) {
				return static::$mock_is_subscription;
			}
			public static function get_period( $product ) {
				return static::$mock_period;
			}
			public static function get_interval( $product ) {
				return static::$mock_interval;
			}
			public static function get_length( $product ) {
				return static::$mock_length;
			}
			public static function get_trial_length( $product ) {
				return static::$mock_trial_length;
			}
			public static function get_trial_period( $product ) {
				return static::$mock_trial_period;
			}
			public static function get_sign_up_fee( $product ) {
				return static::$mock_sign_up_fee;
			}

			public static function reset() {
				static::$mock_is_subscription = false;
				static::$mock_period          = 'month';
				static::$mock_interval        = 1;
				static::$mock_length          = 0;
				static::$mock_trial_length    = 0;
				static::$mock_trial_period    = '';
				static::$mock_sign_up_fee     = 0;
			}
		}
	}

	if ( ! function_exists( 'wc_get_products' ) ) {
		function wc_get_products( $args = [] ) {
			global $test_wc_products_result;
			return $test_wc_products_result ?? (object) [
				'products'      => [],
				'max_num_pages' => 0,
			];
		}
	}

	if ( ! function_exists( 'wc_get_product' ) ) {
		function wc_get_product( $id = 0 ) {
			global $test_wc_get_product_result;
			return $test_wc_get_product_result ?? null;
		}
	}

	if ( ! function_exists( 'get_woocommerce_currency' ) ) {
		function get_woocommerce_currency() {
			global $test_woocommerce_currency;
			return $test_woocommerce_currency ?? 'USD';
		}
	}

	if ( ! function_exists( 'wc_attribute_label' ) ) {
		function wc_attribute_label( $name, $product = null ) {
			return $name;
		}
	}

	if ( ! function_exists( 'wc_review_is_from_verified_owner' ) ) {
		function wc_review_is_from_verified_owner( $comment_id ) {
			global $test_wc_verified_owner;
			return $test_wc_verified_owner ?? false;
		}
	}

}

namespace SureCart\Tests\Sync {

	use SureCart\Sync\WooCommerce\WooCommerceProductMapper;
	use SureCart\Tests\SureCartUnitTestCase;

	/**
	 * Tests for WooCommerceProductMapper.
	 *
	 * @group woo_import
	 */
	class WooCommerceProductMapperTest extends SureCartUnitTestCase {
		use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

		/**
		 * The mapper instance.
		 *
		 * @var WooCommerceProductMapper
		 */
		protected $mapper;

		/**
		 * Set up the test environment.
		 */
		public function setUp(): void {
			parent::setUp();

			\SureCart::make()->bootstrap(
				[
					'providers' => [
						\SureCart\WordPress\PluginServiceProvider::class,
					],
				],
				false
			);

			$this->mapper = new WooCommerceProductMapper();

			// Mock the account alias to prevent BadMethodCallException from CollectionTaxonomyService.
			\SureCart::alias(
				'account',
				function () {
					return (object) [ 'id' => 'test-account-id' ];
				}
			);

			// Reset globals.
			$GLOBALS['test_woocommerce_currency']     = 'USD';
			$GLOBALS['test_wc_products_result']        = null;
			$GLOBALS['test_wc_get_product_result']     = null;
			$GLOBALS['test_wc_verified_owner']         = false;

			// Reset WC_Subscriptions_Product mock values.
			\WC_Subscriptions_Product::reset();
		}

		/**
		 * Tear down the test environment.
		 */
		public function tearDown(): void {
			unset(
				$GLOBALS['test_woocommerce_currency'],
				$GLOBALS['test_wc_products_result'],
				$GLOBALS['test_wc_get_product_result'],
				$GLOBALS['test_wc_verified_owner']
			);
			parent::tearDown();
		}

		/**
		 * Helper: Create a mock WC_Product with configurable methods.
		 *
		 * @param array $overrides Method return value overrides.
		 * @return \Mockery\MockInterface
		 */
		private function createMockProduct( $overrides = [] ) {
			$defaults = [
				'get_id'                    => 123,
				'get_name'                  => 'Test Product',
				'get_slug'                  => 'test-product',
				'get_type'                  => 'simple',
				'get_status'                => 'publish',
				'get_description'           => 'Test description',
				'get_sku'                   => 'TEST-SKU',
				'get_price'                 => '19.99',
				'get_regular_price'         => '29.99',
				'get_sale_price'            => '',
				'get_menu_order'            => 0,
				'get_catalog_visibility'    => 'visible',
				'get_tax_class'             => '',
				'is_featured'               => false,
				'is_on_sale'                => false,
				'is_virtual'                => false,
				'is_downloadable'           => false,
				'is_taxable'                => true,
				'get_sold_individually'     => false,
				'managing_stock'            => false,
				'get_stock_quantity'         => null,
				'backorders_allowed'        => false,
				'get_weight'                => '',
				'get_length'                => '',
				'get_width'                 => '',
				'get_height'                => '',
				'get_date_created'          => null,
				'get_date_modified'         => null,
				'get_date_on_sale_from'     => null,
				'get_date_on_sale_to'       => null,
				'get_image_id'              => 0,
				'get_gallery_image_ids'     => [],
				'get_category_ids'          => [],
				'get_tag_ids'               => [],
				'get_total_sales'           => 0,
				'get_average_rating'        => '0',
				'get_rating_counts'         => [],
				'get_review_count'          => 0,
				'get_upsell_ids'            => [],
				'get_cross_sell_ids'        => [],
				'get_short_description'     => '',
				'get_purchase_note'         => '',
				'get_low_stock_amount'      => '',
				'get_stock_status'          => 'instock',
				'get_downloads'             => [],
				'get_download_limit'        => -1,
				'get_download_expiry'       => -1,
				'get_shipping_class_id'     => 0,
				'get_attributes'            => [],
				'get_available_variations'   => [],
				'get_children'              => [],
			];

			$config  = array_merge( $defaults, $overrides );
			$product = \Mockery::mock( 'WC_Product' );

			foreach ( $config as $method => $return_value ) {
				if ( 'is_type' === $method ) {
					continue;
				}
				$product->shouldReceive( $method )->andReturn( $return_value )->byDefault();
			}

			// Handle is_type dynamically based on get_type.
			$type = $config['get_type'];
			$product->shouldReceive( 'is_type' )
				->andReturnUsing(
					function ( $check_type ) use ( $type ) {
						return $check_type === $type;
					}
				)->byDefault();

			return $product;
		}

		// =========================================================================
		// Group 7: mapWooCommerceProductToSureCart() — 4 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_woo_product_returns_product_data() {
			$product = $this->createMockProduct();
			$data = $this->mapper->mapWooCommerceProductToSureCart( $product );

			$this->assertIsArray( $data );
			$this->assertArrayHasKey( 'name', $data );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_woo_product_includes_all_sections_for_simple_product() {
			$product = $this->createMockProduct();
			$data = $this->mapper->mapWooCommerceProductToSureCart( $product );

			$this->assertArrayHasKey( 'name', $data );
			$this->assertArrayHasKey( 'slug', $data );
			$this->assertArrayHasKey( 'prices', $data );
			$this->assertArrayHasKey( 'product_medias', $data );
			$this->assertArrayHasKey( 'metadata', $data );
			$this->assertArrayHasKey( 'reviews', $data );
			$this->assertArrayHasKey( 'tax_enabled', $data );
			$this->assertArrayHasKey( 'reviews_enabled', $data );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_woo_product_includes_variants_for_variable_product() {
			$attribute = \Mockery::mock( 'WC_Product_Attribute' );
			$attribute->shouldReceive( 'get_variation' )->andReturn( true );
			$attribute->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attribute->shouldReceive( 'get_name' )->andReturn( 'Color' );
			$attribute->shouldReceive( 'get_options' )->andReturn( [ 'Red', 'Blue' ] );

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_attributes'            => [ $attribute ],
					'get_available_variations'  => [],
				]
			);

			$data = $this->mapper->mapWooCommerceProductToSureCart( $product );

			$this->assertArrayHasKey( 'variant_options', $data );
			$this->assertArrayHasKey( 'variants', $data );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_woo_product_applies_product_data_filter() {
			add_filter(
				'surecart/woocommerce_sync/product_data',
				function ( $data ) {
					$data['custom_field'] = 'filtered_value';
					return $data;
				}
			);

			$product = $this->createMockProduct();
			$data = $this->mapper->mapWooCommerceProductToSureCart( $product );

			$this->assertSame( 'filtered_value', $data['custom_field'] );
		}

		// =========================================================================
		// Group 8: mapCoreFields() — 12 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_returns_correct_name() {
			$product = $this->createMockProduct( [ 'get_name' => 'My Product' ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertSame( 'My Product', $result['name'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_returns_correct_slug() {
			$product = $this->createMockProduct( [ 'get_slug' => 'my-product' ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertSame( 'my-product', $result['slug'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_maps_featured_status() {
			$product = $this->createMockProduct( [ 'is_featured' => true ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertTrue( $result['featured'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_maps_description_and_sku() {
			$product = $this->createMockProduct(
				[
					'get_description' => 'A great product',
					'get_sku'         => 'SKU-001',
				]
			);
			$result = $this->mapper->mapCoreFields( $product );
			$this->assertSame( 'A great product', $result['description'] );
			$this->assertSame( 'SKU-001', $result['sku'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_sets_archived_for_trash_status() {
			$product = $this->createMockProduct( [ 'get_status' => 'trash' ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertTrue( $result['archived'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_sets_archived_false_for_non_trash() {
			$product = $this->createMockProduct( [ 'get_status' => 'publish' ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertFalse( $result['archived'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_maps_cataloged_at_from_date_created() {
			$date    = new \WC_DateTime( '2024-01-15 10:00:00' );
			$product = $this->createMockProduct( [ 'get_date_created' => $date ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertNotNull( $result['cataloged_at'] );
			$this->assertIsInt( $result['cataloged_at'] );
			$this->assertSame( $date->getTimestamp(), $result['cataloged_at'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_maps_cataloged_at_null_when_no_date() {
			$product = $this->createMockProduct( [ 'get_date_created' => null ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertNull( $result['cataloged_at'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_omits_position_field() {
			$product = $this->createMockProduct( [ 'get_menu_order' => 5 ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertArrayNotHasKey( 'position', $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_sets_purchase_limit_when_sold_individually() {
			$product = $this->createMockProduct( [ 'get_sold_individually' => true ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertSame( 1, $result['purchase_limit'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_omits_purchase_limit_when_not_sold_individually() {
			$product = $this->createMockProduct( [ 'get_sold_individually' => false ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertArrayNotHasKey( 'purchase_limit', $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_maps_licensing_when_enabled() {
			$post_id = self::factory()->post->create();
			update_post_meta( $post_id, '_has_license', 'yes' );
			update_post_meta( $post_id, '_license_activation_limit', '5' );

			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$result  = $this->mapper->mapCoreFields( $product );

			$this->assertTrue( $result['licensing_enabled'] );
			$this->assertSame( 5, $result['license_activation_limit'] );
		}

		// =========================================================================
		// Group 9: mapStatus() — 5 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_status_returns_published_for_publish() {
			$product = $this->createMockProduct(
				[
					'get_status'             => 'publish',
					'get_catalog_visibility' => 'visible',
				]
			);
			$this->assertSame( 'published', $this->mapper->mapStatus( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_status_returns_draft_for_hidden() {
			$product = $this->createMockProduct(
				[
					'get_status'             => 'publish',
					'get_catalog_visibility' => 'hidden',
				]
			);
			$this->assertSame( 'draft', $this->mapper->mapStatus( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_status_returns_draft_for_private() {
			$product = $this->createMockProduct( [ 'get_status' => 'private' ] );
			$this->assertSame( 'draft', $this->mapper->mapStatus( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_status_returns_draft_for_draft() {
			$product = $this->createMockProduct( [ 'get_status' => 'draft' ] );
			$this->assertSame( 'draft', $this->mapper->mapStatus( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_status_returns_draft_for_pending() {
			$product = $this->createMockProduct( [ 'get_status' => 'pending' ] );
			$this->assertSame( 'draft', $this->mapper->mapStatus( $product ) );
		}

		// =========================================================================
		// Group 10: isSubscriptionProduct() — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_is_subscription_returns_true_when_active() {
			\WC_Subscriptions_Product::$mock_is_subscription = true;
			$product = $this->createMockProduct();
			$this->assertTrue( $this->mapper->isSubscriptionProduct( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_is_subscription_returns_false_when_not_subscription() {
			\WC_Subscriptions_Product::$mock_is_subscription = false;
			$product = $this->createMockProduct();
			$this->assertFalse( $this->mapper->isSubscriptionProduct( $product ) );
		}

		// =========================================================================
		// Group 11: hasLicensing() + getLicenseActivationLimit() — 4 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_has_licensing_returns_true_when_meta_is_yes() {
			$post_id = self::factory()->post->create();
			update_post_meta( $post_id, '_has_license', 'yes' );
			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$this->assertTrue( $this->mapper->hasLicensing( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_has_licensing_returns_false_when_meta_is_not_yes() {
			$post_id = self::factory()->post->create();
			update_post_meta( $post_id, '_has_license', 'no' );
			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$this->assertFalse( $this->mapper->hasLicensing( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_license_activation_limit_returns_integer() {
			$post_id = self::factory()->post->create();
			update_post_meta( $post_id, '_license_activation_limit', '5' );
			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$this->assertSame( 5, $this->mapper->getLicenseActivationLimit( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_license_activation_limit_returns_null_when_empty() {
			$post_id = self::factory()->post->create();
			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$this->assertNull( $this->mapper->getLicenseActivationLimit( $product ) );
		}

		// =========================================================================
		// Group 12: mapPrices() — simple products — 8 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_prices_returns_single_price_for_simple_product() {
			$product = $this->createMockProduct();
			$result  = $this->mapper->mapPrices( $product );
			$this->assertCount( 1, $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_prices_converts_amount_to_cents() {
			$product = $this->createMockProduct( [ 'get_price' => '20.00' ] );
			$result  = $this->mapper->mapPrices( $product );
			$this->assertSame( 2000, $result[0]['amount'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_prices_includes_currency() {
			$product = $this->createMockProduct();
			$result  = $this->mapper->mapPrices( $product );
			$this->assertSame( 'usd', $result[0]['currency'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_prices_includes_name_with_product_name() {
			$product = $this->createMockProduct( [ 'get_name' => 'Fancy Shoes' ] );
			$result  = $this->mapper->mapPrices( $product );
			$this->assertStringContainsString( 'Fancy Shoes', $result[0]['name'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_prices_maps_sale_price_as_scratch_amount() {
			$product = $this->createMockProduct(
				[
					'is_on_sale'        => true,
					'get_sale_price'    => '14.99',
					'get_regular_price' => '29.99',
					'get_price'         => '14.99',
				]
			);
			$result = $this->mapper->mapPrices( $product );
			$this->assertSame( 2999, $result[0]['scratch_amount'] );
			$this->assertSame( 1499, $result[0]['amount'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_prices_omits_scratch_amount_when_not_on_sale() {
			$product = $this->createMockProduct( [ 'is_on_sale' => false ] );
			$result  = $this->mapper->mapPrices( $product );
			$this->assertArrayNotHasKey( 'scratch_amount', $result[0] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_prices_includes_metadata() {
			$product = $this->createMockProduct(
				[
					'get_id'        => 456,
					'get_tax_class' => 'standard',
				]
			);
			$result = $this->mapper->mapPrices( $product );
			$this->assertSame( 456, $result[0]['metadata']['wc_product_id'] );
			$this->assertSame( 'regular', $result[0]['metadata']['wc_price_type'] );
			$this->assertSame( 'standard', $result[0]['metadata']['wc_tax_class'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_prices_includes_sale_dates_in_metadata() {
			$sale_from = new \DateTime( '2024-06-01' );
			$sale_to   = new \DateTime( '2024-06-30' );

			// Create mock objects that respond to format().
			$mock_from = \Mockery::mock( 'stdClass' );
			$mock_from->shouldReceive( 'format' )->with( 'c' )->andReturn( $sale_from->format( 'c' ) );

			$mock_to = \Mockery::mock( 'stdClass' );
			$mock_to->shouldReceive( 'format' )->with( 'c' )->andReturn( $sale_to->format( 'c' ) );

			$product = $this->createMockProduct(
				[
					'get_date_on_sale_from' => $mock_from,
					'get_date_on_sale_to'   => $mock_to,
				]
			);
			$result = $this->mapper->mapPrices( $product );

			$this->assertArrayHasKey( 'wc_sale_start', $result[0]['metadata'] );
			$this->assertArrayHasKey( 'wc_sale_end', $result[0]['metadata'] );
		}

		// =========================================================================
		// Group 13: mapSubscriptionPrices() — 7 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_includes_recurring_fields() {
			\WC_Subscriptions_Product::$mock_period   = 'month';
			\WC_Subscriptions_Product::$mock_interval  = 2;
			\WC_Subscriptions_Product::$mock_length    = 12;

			$product = $this->createMockProduct( [ 'get_price' => '9.99', 'get_name' => 'Sub Product' ] );
			$result  = $this->mapper->mapSubscriptionPrices( $product );

			$this->assertCount( 1, $result );
			$this->assertSame( 'month', $result[0]['recurring_interval'] );
			$this->assertSame( 2, $result[0]['recurring_interval_count'] );
			$this->assertSame( 12, $result[0]['recurring_period_count'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_includes_trial_duration_days() {
			\WC_Subscriptions_Product::$mock_trial_length = 2;
			\WC_Subscriptions_Product::$mock_trial_period  = 'week';

			$product = $this->createMockProduct();
			$result  = $this->mapper->mapSubscriptionPrices( $product );
			$this->assertSame( 14, $result[0]['trial_duration_days'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_includes_setup_fee() {
			\WC_Subscriptions_Product::$mock_sign_up_fee = 25.00;

			$product = $this->createMockProduct();
			$result  = $this->mapper->mapSubscriptionPrices( $product );

			$this->assertTrue( $result[0]['setup_fee_enabled'] );
			$this->assertSame( 2500, $result[0]['setup_fee_amount'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_disables_setup_fee_when_zero() {
			\WC_Subscriptions_Product::$mock_sign_up_fee = 0;

			$product = $this->createMockProduct();
			$result  = $this->mapper->mapSubscriptionPrices( $product );

			$this->assertFalse( $result[0]['setup_fee_enabled'] );
			$this->assertSame( 0, $result[0]['setup_fee_amount'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_includes_sale_scratch_amount() {
			$product = $this->createMockProduct(
				[
					'is_on_sale'        => true,
					'get_sale_price'    => '7.99',
					'get_regular_price' => '14.99',
					'get_price'         => '7.99',
				]
			);

			$result = $this->mapper->mapSubscriptionPrices( $product );
			$this->assertSame( 1499, $result[0]['scratch_amount'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_omits_scratch_when_not_on_sale() {
			$product = $this->createMockProduct(
				[
					'is_on_sale'     => false,
					'get_sale_price' => '',
				]
			);

			$result = $this->mapper->mapSubscriptionPrices( $product );
			$this->assertArrayNotHasKey( 'scratch_amount', $result[0] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_includes_metadata() {
			$product = $this->createMockProduct( [ 'get_id' => 789 ] );
			$result  = $this->mapper->mapSubscriptionPrices( $product );

			$this->assertTrue( $result[0]['metadata']['wc_subscription_product'] );
			$this->assertSame( 789, $result[0]['metadata']['wc_product_id'] );
		}

		// =========================================================================
		// Group 14: getTrialDays() — 6 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_get_trial_days_returns_null_when_no_trial_length() {
			\WC_Subscriptions_Product::$mock_trial_length = 0;
			\WC_Subscriptions_Product::$mock_trial_period  = 'day';

			$product = $this->createMockProduct();
			$this->assertNull( $this->mapper->getTrialDays( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_trial_days_returns_null_when_no_trial_period() {
			\WC_Subscriptions_Product::$mock_trial_length = 5;
			\WC_Subscriptions_Product::$mock_trial_period  = '';

			$product = $this->createMockProduct();
			$this->assertNull( $this->mapper->getTrialDays( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_trial_days_converts_days_correctly() {
			\WC_Subscriptions_Product::$mock_trial_length = 3;
			\WC_Subscriptions_Product::$mock_trial_period  = 'day';

			$product = $this->createMockProduct();
			$this->assertSame( 3, $this->mapper->getTrialDays( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_trial_days_converts_weeks_correctly() {
			\WC_Subscriptions_Product::$mock_trial_length = 2;
			\WC_Subscriptions_Product::$mock_trial_period  = 'week';

			$product = $this->createMockProduct();
			$this->assertSame( 14, $this->mapper->getTrialDays( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_trial_days_converts_months_correctly() {
			\WC_Subscriptions_Product::$mock_trial_length = 1;
			\WC_Subscriptions_Product::$mock_trial_period  = 'month';

			$product = $this->createMockProduct();
			$this->assertSame( 30, $this->mapper->getTrialDays( $product ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_trial_days_converts_years_correctly() {
			\WC_Subscriptions_Product::$mock_trial_length = 1;
			\WC_Subscriptions_Product::$mock_trial_period  = 'year';

			$product = $this->createMockProduct();
			$this->assertSame( 365, $this->mapper->getTrialDays( $product ) );
		}

		// =========================================================================
		// Group 15: convertPriceToInteger() — 7 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_convert_price_returns_zero_for_empty_value() {
			$this->assertSame( 0, $this->mapper->convertPriceToInteger( '' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_returns_zero_for_null_value() {
			$this->assertSame( 0, $this->mapper->convertPriceToInteger( null ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_converts_to_cents_for_usd() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			$this->assertSame( 2000, $this->mapper->convertPriceToInteger( '20.00' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_converts_to_cents_for_eur() {
			$GLOBALS['test_woocommerce_currency'] = 'EUR';
			$this->assertSame( 1050, $this->mapper->convertPriceToInteger( '10.50' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_returns_integer_for_jpy_zero_decimal() {
			$GLOBALS['test_woocommerce_currency'] = 'JPY';
			$this->assertSame( 1000, $this->mapper->convertPriceToInteger( '1000' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_returns_integer_for_krw_zero_decimal() {
			$GLOBALS['test_woocommerce_currency'] = 'KRW';
			$this->assertSame( 5000, $this->mapper->convertPriceToInteger( '5000' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_handles_whole_dollar_amount() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			$this->assertSame( 2000, $this->mapper->convertPriceToInteger( '20' ) );
		}

		// =========================================================================
		// Group 16: getOrCreateCollections() — 6 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_get_or_create_collections_returns_empty_for_empty_input() {
			$result = $this->mapper->getOrCreateCollections( [] );
			$this->assertEmpty( $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_or_create_collections_finds_existing_collection() {
			$term         = (object) [ 'name' => 'Shoes', 'slug' => 'shoes', 'description' => '', 'term_id' => 1 ];
			$collection   = (object) [ 'id' => 'coll_123', 'slug' => 'shoes' ];

			// Mock the static calls on ProductCollection.
			$mock = \Mockery::mock( 'alias:SureCart\Models\ProductCollection' );
			$mock->shouldReceive( 'where' )->andReturnSelf();
			$mock->shouldReceive( 'get' )->andReturn( [ $collection ] );

			$service = new WooCommerceProductMapper();
			$result  = $service->getOrCreateCollections(
				[
					'shoes' => [ 'term' => $term, 'source' => 'product_cat' ],
				]
			);

			$this->assertCount( 1, $result );
			$this->assertSame( 'coll_123', $result[0]->id );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_or_create_collections_creates_new_when_not_found() {
			$term       = (object) [ 'name' => 'Hats', 'slug' => 'hats', 'description' => 'Hat collection', 'term_id' => 2 ];
			$new_coll   = (object) [ 'id' => 'coll_456' ];

			$mock = \Mockery::mock( 'alias:SureCart\Models\ProductCollection' );
			$mock->shouldReceive( 'where' )->andReturnSelf();
			$mock->shouldReceive( 'get' )->andReturn( [] ); // Empty array = not found.
			$mock->shouldReceive( 'create' )->andReturn( $new_coll );

			$service = new WooCommerceProductMapper();
			$result  = $service->getOrCreateCollections(
				[
					'hats' => [ 'term' => $term, 'source' => 'product_cat' ],
				]
			);

			$this->assertCount( 1, $result );
			$this->assertSame( 'coll_456', $result[0]->id );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_or_create_collections_uses_cache_on_second_call() {
			$term       = (object) [ 'name' => 'Boots', 'slug' => 'boots', 'description' => '', 'term_id' => 3 ];
			$collection = (object) [ 'id' => 'coll_789', 'slug' => 'boots' ];

			$mock = \Mockery::mock( 'alias:SureCart\Models\ProductCollection' );
			$mock->shouldReceive( 'where' )->once()->andReturnSelf(); // Called only once!
			$mock->shouldReceive( 'get' )->once()->andReturn( [ $collection ] );

			$service = new WooCommerceProductMapper();

			// First call.
			$result1 = $service->getOrCreateCollections(
				[ 'boots' => [ 'term' => $term, 'source' => 'product_cat' ] ]
			);
			// Second call with same slug should use cache.
			$result2 = $service->getOrCreateCollections(
				[ 'boots' => [ 'term' => $term, 'source' => 'product_cat' ] ]
			);

			$this->assertCount( 1, $result1 );
			$this->assertCount( 1, $result2 );
			$this->assertSame( 'coll_789', $result2[0]->id );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_or_create_collections_normalizes_slug_to_lowercase() {
			$term       = (object) [ 'name' => 'Summer Sale', 'slug' => 'Summer-Sale', 'description' => '', 'term_id' => 4 ];
			$collection = (object) [ 'id' => 'coll_norm', 'slug' => 'summer-sale' ];

			$mock = \Mockery::mock( 'alias:SureCart\Models\ProductCollection' );
			$mock->shouldReceive( 'where' )->andReturnSelf();
			$mock->shouldReceive( 'get' )->andReturn( [ $collection ] );

			$service = new WooCommerceProductMapper();
			$result  = $service->getOrCreateCollections(
				[ 'Summer-Sale' => [ 'term' => $term, 'source' => 'product_tag' ] ]
			);

			$this->assertCount( 1, $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_get_or_create_collections_handles_wp_error_from_create() {
			$term = (object) [ 'name' => 'Error Cat', 'slug' => 'error-cat', 'description' => '', 'term_id' => 5 ];

			$mock = \Mockery::mock( 'alias:SureCart\Models\ProductCollection' );
			$mock->shouldReceive( 'where' )->andReturnSelf();
			$mock->shouldReceive( 'get' )->andReturn( [] ); // Empty array = not found.
			$mock->shouldReceive( 'create' )->andReturn( new \WP_Error( 'error', 'Creation failed' ) );

			$service = new WooCommerceProductMapper();
			$result  = $service->getOrCreateCollections(
				[ 'error-cat' => [ 'term' => $term, 'source' => 'product_cat' ] ]
			);

			$this->assertEmpty( $result );
		}

		// =========================================================================
		// Group 17: mapCategories() — 6 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_categories_returns_empty_when_no_categories_or_tags() {
			$product = $this->createMockProduct(
				[
					'get_category_ids' => [],
					'get_tag_ids'      => [],
				]
			);
			$result = $this->mapper->mapCategories( $product );
			$this->assertEmpty( $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_categories_maps_product_categories() {
			// Register taxonomy and create term.
			if ( ! taxonomy_exists( 'product_cat' ) ) {
				register_taxonomy( 'product_cat', 'post' );
			}
			$term = wp_insert_term( 'Clothing', 'product_cat', [ 'slug' => 'clothing' ] );

			$product = $this->createMockProduct(
				[
					'get_category_ids' => [ $term['term_id'] ],
					'get_tag_ids'      => [],
				]
			);

			// Mock collections API.
			$service = \Mockery::mock( WooCommerceProductMapper::class )->makePartial();
			$service->shouldReceive( 'getOrCreateCollections' )
				->once()
				->andReturn( [ (object) [ 'id' => 'coll_clothing' ] ] );

			$result = $service->mapCategories( $product );
			$this->assertArrayHasKey( 'product_collections', $result );
			$this->assertContains( 'coll_clothing', $result['product_collections'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_categories_maps_product_tags() {
			if ( ! taxonomy_exists( 'product_tag' ) ) {
				register_taxonomy( 'product_tag', 'post' );
			}
			$term = wp_insert_term( 'Sale', 'product_tag', [ 'slug' => 'sale' ] );

			$product = $this->createMockProduct(
				[
					'get_category_ids' => [],
					'get_tag_ids'      => [ $term['term_id'] ],
				]
			);

			$service = \Mockery::mock( WooCommerceProductMapper::class )->makePartial();
			$service->shouldReceive( 'getOrCreateCollections' )
				->once()
				->andReturn( [ (object) [ 'id' => 'coll_sale' ] ] );

			$result = $service->mapCategories( $product );
			$this->assertArrayHasKey( 'product_collections', $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_categories_deduplicates_same_slug_across_category_and_tag() {
			if ( ! taxonomy_exists( 'product_cat' ) ) {
				register_taxonomy( 'product_cat', 'post' );
			}
			if ( ! taxonomy_exists( 'product_tag' ) ) {
				register_taxonomy( 'product_tag', 'post' );
			}

			$cat_term = wp_insert_term( 'Promo', 'product_cat', [ 'slug' => 'promo' ] );
			$tag_term = wp_insert_term( 'Promo', 'product_tag', [ 'slug' => 'promo' ] );

			$product = $this->createMockProduct(
				[
					'get_category_ids' => [ $cat_term['term_id'] ],
					'get_tag_ids'      => [ $tag_term['term_id'] ],
				]
			);

			$service = \Mockery::mock( WooCommerceProductMapper::class )->makePartial();
			$service->shouldReceive( 'getOrCreateCollections' )
				->once()
				->withArgs(
					function ( $terms ) {
						// Should only have one entry (deduplicated).
						return count( $terms ) === 1;
					}
				)
				->andReturn( [ (object) [ 'id' => 'coll_promo' ] ] );

			$result = $service->mapCategories( $product );
			$this->assertCount( 1, $result['product_collections'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_categories_includes_brands_when_taxonomy_exists() {
			if ( ! taxonomy_exists( 'product_cat' ) ) {
				register_taxonomy( 'product_cat', 'post' );
			}
			if ( ! taxonomy_exists( 'product_brand' ) ) {
				register_taxonomy( 'product_brand', 'post' );
			}

			$post_id    = self::factory()->post->create();
			$brand_term = wp_insert_term( 'Nike', 'product_brand', [ 'slug' => 'nike' ] );
			wp_set_object_terms( $post_id, [ $brand_term['term_id'] ], 'product_brand' );

			$product = $this->createMockProduct(
				[
					'get_id'           => $post_id,
					'get_category_ids' => [],
					'get_tag_ids'      => [],
				]
			);

			$service = \Mockery::mock( WooCommerceProductMapper::class )->makePartial();
			$service->shouldReceive( 'getOrCreateCollections' )
				->once()
				->andReturn( [ (object) [ 'id' => 'coll_nike' ] ] );

			$result = $service->mapCategories( $product );
			$this->assertArrayHasKey( 'product_collections', $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_categories_returns_empty_when_collections_empty() {
			if ( ! taxonomy_exists( 'product_cat' ) ) {
				register_taxonomy( 'product_cat', 'post' );
			}
			$term = wp_insert_term( 'Empty', 'product_cat', [ 'slug' => 'empty' ] );

			$product = $this->createMockProduct(
				[
					'get_category_ids' => [ $term['term_id'] ],
					'get_tag_ids'      => [],
				]
			);

			$service = \Mockery::mock( WooCommerceProductMapper::class )->makePartial();
			$service->shouldReceive( 'getOrCreateCollections' )->once()->andReturn( [] );

			$result = $service->mapCategories( $product );
			$this->assertEmpty( $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_categories_deduplicates_collection_ids_from_fuzzy_api_match() {
			if ( ! taxonomy_exists( 'product_cat' ) ) {
				register_taxonomy( 'product_cat', 'post' );
			}
			if ( ! taxonomy_exists( 'product_tag' ) ) {
				register_taxonomy( 'product_tag', 'post' );
			}

			$cat_term = wp_insert_term( 'Digital Products', 'product_cat', [ 'slug' => 'digital-products' ] );
			$tag_term = wp_insert_term( 'digital', 'product_tag', [ 'slug' => 'digital' ] );

			$product = $this->createMockProduct(
				[
					'get_category_ids' => [ $cat_term['term_id'] ],
					'get_tag_ids'      => [ $tag_term['term_id'] ],
				]
			);

			// Simulate the API returning the same collection for both terms (fuzzy match).
			$same_collection = (object) [ 'id' => 'coll_digital_123' ];
			$service         = \Mockery::mock( WooCommerceProductMapper::class )->makePartial();
			$service->shouldReceive( 'getOrCreateCollections' )
				->once()
				->andReturn( [ $same_collection, $same_collection ] );

			$result = $service->mapCategories( $product );
			$this->assertCount( 1, $result['product_collections'] );
			$this->assertSame( 'coll_digital_123', $result['product_collections'][0] );
		}

		// =========================================================================
		// Group 18: mapVariants() — 9 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_variants_returns_empty_for_non_variable_product() {
			$product = $this->createMockProduct( [ 'get_type' => 'simple' ] );
			$result  = $this->mapper->mapVariants( $product );
			$this->assertEmpty( $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_extracts_variant_options_from_attributes() {
			$attribute = \Mockery::mock( 'WC_Product_Attribute' );
			$attribute->shouldReceive( 'get_variation' )->andReturn( true );
			$attribute->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attribute->shouldReceive( 'get_name' )->andReturn( 'Size' );
			$attribute->shouldReceive( 'get_options' )->andReturn( [ 'Small', 'Medium', 'Large' ] );

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_attributes'            => [ $attribute ],
					'get_available_variations'  => [],
				]
			);

			$result = $this->mapper->mapVariants( $product );

			$this->assertCount( 1, $result['variant_options'] );
			$this->assertSame( 'Size', $result['variant_options'][0]['name'] );
			$this->assertSame( [ 'Small', 'Medium', 'Large' ], $result['variant_options'][0]['values'] );
			$this->assertSame( 'dropdown', $result['variant_options'][0]['display_type'] );
			$this->assertSame( 0, $result['variant_options'][0]['position'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_skips_non_variation_attributes() {
			$attr_variation = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_variation->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_variation->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_variation->shouldReceive( 'get_name' )->andReturn( 'Color' );
			$attr_variation->shouldReceive( 'get_options' )->andReturn( [ 'Red', 'Blue' ] );

			$attr_non_variation = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_non_variation->shouldReceive( 'get_variation' )->andReturn( false );

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_attributes'            => [ $attr_variation, $attr_non_variation ],
					'get_available_variations'  => [],
				]
			);

			$result = $this->mapper->mapVariants( $product );
			$this->assertCount( 1, $result['variant_options'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_maps_variation_prices_and_stock() {
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( 'VAR-001' );
			$variation->shouldReceive( 'get_price' )->andReturn( '24.99' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '24.99' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( true );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( 50 );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 456 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn( [ 'attribute_color' => 'Red' ] );
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_id'                    => 123,
					'get_attributes'            => [],
					'get_children'              => [ 456 ],
					'get_available_variations'  => [
						[ 'variation_id' => 456 ],
					],
				]
			);

			$result = $this->mapper->mapVariants( $product );

			$this->assertCount( 1, $result['variants'] );
			$variant = $result['variants'][0];
			$this->assertSame( 'VAR-001', $variant['sku'] );
			$this->assertSame( 2499, $variant['amount'] );
			$this->assertTrue( $variant['stock_enabled'] );
			$this->assertSame( 50, $variant['stock_adjustment'] );
			$this->assertFalse( $variant['allow_out_of_stock_purchases'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_skips_stock_when_parent_manages_stock() {
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( 'VAR-PARENT-STOCK' );
			$variation->shouldReceive( 'get_price' )->andReturn( '19.99' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '19.99' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			// Returns 'parent' when stock is managed at the parent level.
			$variation->shouldReceive( 'managing_stock' )->andReturn( 'parent' );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( 11 );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 456 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn( [ 'attribute_color' => 'Red' ] );
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                 => 'variable',
					'get_id'                   => 123,
					'get_attributes'           => [],
					'get_children'             => [ 456 ],
					'get_available_variations' => [
						[ 'variation_id' => 456 ],
					],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];

			// When parent manages stock, variant should NOT have stock enabled.
			$this->assertFalse( $variant['stock_enabled'] );
			$this->assertSame( 0, $variant['stock_adjustment'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_does_not_include_scratch_amount_on_variant() {
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( 'VAR-SALE' );
			$variation->shouldReceive( 'get_price' )->andReturn( '14.99' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '29.99' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '14.99' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( true );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 789 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn( [] );
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_id'                    => 100,
					'get_attributes'            => [],
					'get_children'              => [ 789 ],
					'get_available_variations'  => [
						[ 'variation_id' => 789 ],
					],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];
			$this->assertArrayNotHasKey( 'scratch_amount', $variant );
			$this->assertArrayNotHasKey( 'currency', $variant );
			$this->assertSame( 1499, $variant['amount'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_maps_option_attributes() {
			$attr_color = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_color->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_color->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_color->shouldReceive( 'get_name' )->andReturn( 'Color' );
			$attr_color->shouldReceive( 'get_options' )->andReturn( [ 'Red', 'Blue' ] );

			$attr_size = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_size->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_size->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_size->shouldReceive( 'get_name' )->andReturn( 'Size' );
			$attr_size->shouldReceive( 'get_options' )->andReturn( [ 'Small', 'Large' ] );

			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( '' );
			$variation->shouldReceive( 'get_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 500 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn(
				[
					'attribute_color' => 'Red',
					'attribute_size'  => 'Large',
				]
			);
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_id'                    => 100,
					'get_attributes'            => [ $attr_color, $attr_size ],
					'get_children'              => [ 500 ],
					'get_available_variations'  => [
						[ 'variation_id' => 500 ],
					],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];
			$this->assertSame( 'Red', $variant['option_1'] );
			$this->assertSame( 'Large', $variant['option_2'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_includes_weight_and_dimensions_when_set() {
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( '' );
			$variation->shouldReceive( 'get_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 600 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '2.5' );
			$variation->shouldReceive( 'get_length' )->andReturn( '10' );
			$variation->shouldReceive( 'get_width' )->andReturn( '5' );
			$variation->shouldReceive( 'get_height' )->andReturn( '3' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn( [] );
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			// Set WooCommerce options.
			update_option( 'woocommerce_weight_unit', 'kg' );
			update_option( 'woocommerce_dimension_unit', 'cm' );

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_id'                    => 100,
					'get_attributes'            => [],
					'get_children'              => [ 600 ],
					'get_available_variations'  => [
						[ 'variation_id' => 600 ],
					],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];

			$this->assertSame( 2.5, $variant['weight'] );
			$this->assertSame( 'kg', $variant['weight_unit'] );
			$this->assertArrayHasKey( 'dimensions', $variant );
			$this->assertSame( 10.0, $variant['dimensions']['length'] );
			$this->assertSame( 5.0, $variant['dimensions']['width'] );
			$this->assertSame( 3.0, $variant['dimensions']['height'] );
			$this->assertSame( 'cm', $variant['dimensions']['unit'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_omits_weight_and_dimensions_when_zero() {
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( '' );
			$variation->shouldReceive( 'get_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 700 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn( [] );
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_id'                    => 100,
					'get_attributes'            => [],
					'get_children'              => [ 700 ],
					'get_available_variations'  => [
						[ 'variation_id' => 700 ],
					],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];

			$this->assertArrayNotHasKey( 'weight', $variant );
			$this->assertArrayNotHasKey( 'dimensions', $variant );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_applies_variants_filter() {
			add_filter(
				'surecart/woocommerce_sync/variants',
				function ( $variants ) {
					$variants[] = [ 'custom' => true ];
					return $variants;
				}
			);

			$product = $this->createMockProduct(
				[
					'get_type'                  => 'variable',
					'get_attributes'            => [],
					'get_available_variations'  => [],
				]
			);

			$result = $this->mapper->mapVariants( $product );
			$this->assertCount( 1, $result['variants'] );
			$this->assertTrue( $result['variants'][0]['custom'] );
		}

		// =========================================================================
		// Group 19: mapStockFields() — 3 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_stock_fields_returns_empty_when_not_managing_stock() {
			$product = $this->createMockProduct( [ 'managing_stock' => false ] );
			$result  = $this->mapper->mapStockFields( $product );
			$this->assertEmpty( $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_stock_fields_returns_stock_data_when_managing() {
			$product = $this->createMockProduct(
				[
					'managing_stock'     => true,
					'get_stock_quantity'  => 25,
					'backorders_allowed' => false,
				]
			);
			$result = $this->mapper->mapStockFields( $product );
			$this->assertTrue( $result['stock_enabled'] );
			$this->assertSame( 25, $result['stock_adjustment'] );
			$this->assertFalse( $result['allow_out_of_stock_purchases'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_stock_fields_allows_out_of_stock_when_backorders_allowed() {
			$product = $this->createMockProduct(
				[
					'managing_stock'     => true,
					'get_stock_quantity'  => 0,
					'backorders_allowed' => true,
				]
			);
			$result = $this->mapper->mapStockFields( $product );
			$this->assertTrue( $result['allow_out_of_stock_purchases'] );
		}

		// =========================================================================
		// Group 20: mapShippingFields() — 5 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_returns_digital_for_virtual_product() {
			$product = $this->createMockProduct( [ 'is_virtual' => true ] );
			$result  = $this->mapper->mapShippingFields( $product );
			$this->assertFalse( $result['shipping_enabled'] );
			$this->assertTrue( $result['auto_fulfill_enabled'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_returns_digital_for_downloadable_product() {
			$product = $this->createMockProduct( [ 'is_downloadable' => true ] );
			$result  = $this->mapper->mapShippingFields( $product );
			$this->assertFalse( $result['shipping_enabled'] );
			$this->assertTrue( $result['auto_fulfill_enabled'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_returns_physical_with_no_dimensions() {
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_weight'      => '',
					'get_length'      => '',
					'get_width'       => '',
					'get_height'      => '',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertTrue( $result['shipping_enabled'] );
			$this->assertFalse( $result['auto_fulfill_enabled'] );
			$this->assertArrayNotHasKey( 'weight', $result );
			$this->assertArrayNotHasKey( 'dimensions', $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_includes_weight_when_set() {
			update_option( 'woocommerce_weight_unit', 'lbs' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_weight'      => '3.5',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertSame( 3.5, $result['weight'] );
			$this->assertSame( 'lb', $result['weight_unit'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_includes_dimensions_when_set() {
			update_option( 'woocommerce_dimension_unit', 'in' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_length'      => '12',
					'get_width'       => '8',
					'get_height'      => '4',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertArrayHasKey( 'dimensions', $result );
			$this->assertSame( 12.0, $result['dimensions']['length'] );
			$this->assertSame( 8.0, $result['dimensions']['width'] );
			$this->assertSame( 4.0, $result['dimensions']['height'] );
			$this->assertSame( 'in', $result['dimensions']['unit'] );
		}

		// =========================================================================
		// Group 21: mapTaxFields() — 4 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_tax_fields_returns_enabled_for_taxable_physical() {
			$product = $this->createMockProduct(
				[
					'is_taxable'      => true,
					'is_virtual'      => false,
					'is_downloadable' => false,
				]
			);
			$result = $this->mapper->mapTaxFields( $product );
			$this->assertTrue( $result['tax_enabled'] );
			$this->assertSame( 'tangible', $result['tax_category'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_tax_fields_returns_digital_category_for_virtual() {
			$product = $this->createMockProduct(
				[
					'is_taxable' => true,
					'is_virtual' => true,
				]
			);
			$result = $this->mapper->mapTaxFields( $product );
			$this->assertSame( 'digital', $result['tax_category'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_tax_fields_returns_digital_category_for_downloadable() {
			$product = $this->createMockProduct(
				[
					'is_taxable'      => true,
					'is_downloadable' => true,
				]
			);
			$result = $this->mapper->mapTaxFields( $product );
			$this->assertSame( 'digital', $result['tax_category'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_tax_fields_returns_disabled_for_non_taxable() {
			$product = $this->createMockProduct( [ 'is_taxable' => false ] );
			$result  = $this->mapper->mapTaxFields( $product );
			$this->assertFalse( $result['tax_enabled'] );
		}

		// =========================================================================
		// Group 22: mapReviewsFields() — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_reviews_fields_enabled_when_comments_open() {
			$post_id = self::factory()->post->create( [ 'comment_status' => 'open' ] );
			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$result  = $this->mapper->mapReviewsFields( $product );
			$this->assertTrue( $result['reviews_enabled'] );
			$this->assertTrue( $result['solicit_reviews'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_reviews_fields_disabled_when_comments_closed() {
			$post_id = self::factory()->post->create( [ 'comment_status' => 'closed' ] );
			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$result  = $this->mapper->mapReviewsFields( $product );
			$this->assertFalse( $result['reviews_enabled'] );
			$this->assertFalse( $result['solicit_reviews'] );
		}

		// =========================================================================
		// Group 23: mapReviews() — 4 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_reviews_returns_empty_when_no_comments() {
			$post_id = self::factory()->post->create();
			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$result  = $this->mapper->mapReviews( $product );
			$this->assertEmpty( $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_reviews_maps_comment_to_review_structure() {
			$post_id    = self::factory()->post->create();
			$comment_id = self::factory()->comment->create(
				[
					'comment_post_ID'  => $post_id,
					'comment_type'     => 'review',
					'comment_approved' => 1,
					'comment_content'  => 'Great product!',
					'comment_author'   => 'John Doe',
					'comment_author_email' => 'john@example.com',
				]
			);
			update_comment_meta( $comment_id, 'rating', '5' );

			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$result  = $this->mapper->mapReviews( $product );

			$this->assertCount( 1, $result );
			$this->assertSame( 'Great product!', $result[0]['body'] );
			$this->assertSame( 5.0, $result[0]['stars'] );
			$this->assertSame( 'John Doe', $result[0]['metadata']['customer_name'] );
			$this->assertSame( 'john@example.com', $result[0]['metadata']['customer_email'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_reviews_maps_rating_from_comment_meta() {
			$post_id    = self::factory()->post->create();
			$comment_id = self::factory()->comment->create(
				[
					'comment_post_ID'  => $post_id,
					'comment_type'     => 'review',
					'comment_approved' => 1,
					'comment_content'  => 'OK product',
				]
			);
			update_comment_meta( $comment_id, 'rating', '3' );

			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$result  = $this->mapper->mapReviews( $product );

			$this->assertSame( 3.0, $result[0]['stars'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_reviews_maps_null_stars_when_no_rating() {
			$post_id    = self::factory()->post->create();
			$comment_id = self::factory()->comment->create(
				[
					'comment_post_ID'  => $post_id,
					'comment_type'     => 'review',
					'comment_approved' => 1,
					'comment_content'  => 'No rating review',
				]
			);

			$product = $this->createMockProduct( [ 'get_id' => $post_id ] );
			$result  = $this->mapper->mapReviews( $product );

			$this->assertNull( $result[0]['stars'] );
		}

		// =========================================================================
		// Group 24: mapMedia() — 5 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_media_returns_empty_when_no_images() {
			$product = $this->createMockProduct(
				[
					'get_image_id'          => 0,
					'get_gallery_image_ids' => [],
				]
			);
			$result = $this->mapper->mapMedia( $product );
			$this->assertEmpty( $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_media_maps_featured_image() {
			$attachment_id = self::factory()->attachment->create_upload_object(
				ABSPATH . 'wp-includes/images/w-logo-blue-white-bg.png'
			);

			$product = $this->createMockProduct(
				[
					'get_image_id'          => $attachment_id,
					'get_gallery_image_ids' => [],
				]
			);
			$result = $this->mapper->mapMedia( $product );

			$this->assertCount( 1, $result );
			$this->assertArrayHasKey( 'url', $result[0] );
			$this->assertArrayNotHasKey( 'type', $result[0] );
			$this->assertArrayNotHasKey( 'position', $result[0] );
			$this->assertNotEmpty( $result[0]['url'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_media_maps_gallery_images() {
			$attachment1 = self::factory()->attachment->create_upload_object(
				ABSPATH . 'wp-includes/images/w-logo-blue-white-bg.png'
			);
			$attachment2 = self::factory()->attachment->create_upload_object(
				ABSPATH . 'wp-includes/images/w-logo-blue-white-bg.png'
			);

			$product = $this->createMockProduct(
				[
					'get_image_id'          => 0,
					'get_gallery_image_ids' => [ $attachment1, $attachment2 ],
				]
			);
			$result = $this->mapper->mapMedia( $product );

			$this->assertCount( 2, $result );
			$this->assertArrayHasKey( 'url', $result[0] );
			$this->assertArrayHasKey( 'url', $result[1] );
			$this->assertArrayNotHasKey( 'position', $result[0] );
			$this->assertArrayNotHasKey( 'position', $result[1] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_media_featured_image_comes_first_in_array() {
			$featured  = self::factory()->attachment->create_upload_object(
				ABSPATH . 'wp-includes/images/w-logo-blue-white-bg.png'
			);
			$gallery   = self::factory()->attachment->create_upload_object(
				ABSPATH . 'wp-includes/images/w-logo-blue-white-bg.png'
			);

			$product = $this->createMockProduct(
				[
					'get_image_id'          => $featured,
					'get_gallery_image_ids' => [ $gallery ],
				]
			);
			$result = $this->mapper->mapMedia( $product );

			$this->assertCount( 2, $result );
			// Featured image is at index 0, gallery at index 1.
			$this->assertSame( wp_get_attachment_url( $featured ), $result[0]['url'] );
			$this->assertSame( wp_get_attachment_url( $gallery ), $result[1]['url'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_media_skips_images_with_no_url() {
			// Non-existent attachment ID.
			$product = $this->createMockProduct(
				[
					'get_image_id'          => 99999,
					'get_gallery_image_ids' => [ 99998 ],
				]
			);
			$result = $this->mapper->mapMedia( $product );
			$this->assertEmpty( $result );
		}

		// =========================================================================
		// Group 25: mapMetadata() — 9 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_includes_traceability_fields() {
			$post_id = self::factory()->post->create();
			$product = $this->createMockProduct(
				[
					'get_id'   => $post_id,
					'get_type' => 'simple',
				]
			);
			$result = $this->mapper->mapMetadata( $product );

			$this->assertSame( $post_id, $result['wc_product_id'] );
			$this->assertSame( 'simple', $result['wc_product_type'] );
			$this->assertArrayHasKey( 'wc_synced_at', $result );
			$this->assertArrayHasKey( 'wc_permalink', $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_includes_analytics_fields() {
			$product = $this->createMockProduct(
				[
					'get_total_sales'    => 150,
					'get_average_rating' => '4.5',
					'get_rating_counts'  => [ 5 => 10, 4 => 5 ],
					'get_review_count'   => 15,
				]
			);
			$result = $this->mapper->mapMetadata( $product );

			$this->assertSame( 150, $result['wc_total_sales'] );
			$this->assertSame( 4.5, $result['wc_average_rating'] );
			$this->assertSame( wp_json_encode( [ 5 => 10, 4 => 5 ] ), $result['wc_rating_counts'] );
			$this->assertSame( 15, $result['wc_review_count'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_includes_product_flags() {
			$product = $this->createMockProduct(
				[
					'is_virtual'             => true,
					'is_downloadable'        => true,
					'get_catalog_visibility' => 'search',
				]
			);
			$result = $this->mapper->mapMetadata( $product );

			$this->assertTrue( $result['is_virtual'] );
			$this->assertTrue( $result['is_downloadable'] );
			$this->assertSame( 'search', $result['catalog_visibility'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_includes_relationship_ids() {
			$product = $this->createMockProduct(
				[
					'get_upsell_ids'     => [ 10, 20 ],
					'get_cross_sell_ids' => [ 30, 40 ],
				]
			);
			$result = $this->mapper->mapMetadata( $product );

			$this->assertSame( wp_json_encode( [ 10, 20 ] ), $result['wc_upsell_ids'] );
			$this->assertSame( wp_json_encode( [ 30, 40 ] ), $result['wc_cross_sell_ids'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_includes_dates() {
			$created  = \Mockery::mock( 'stdClass' );
			$created->shouldReceive( 'format' )->with( 'c' )->andReturn( '2024-01-01T00:00:00+00:00' );

			$modified = \Mockery::mock( 'stdClass' );
			$modified->shouldReceive( 'format' )->with( 'c' )->andReturn( '2024-06-01T00:00:00+00:00' );

			$product = $this->createMockProduct(
				[
					'get_date_created'  => $created,
					'get_date_modified' => $modified,
				]
			);
			$result = $this->mapper->mapMetadata( $product );

			$this->assertSame( '2024-01-01T00:00:00+00:00', $result['wc_date_created'] );
			$this->assertSame( '2024-06-01T00:00:00+00:00', $result['wc_date_modified'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_includes_download_files_for_downloadable_product() {
			$download = \Mockery::mock( 'stdClass' );
			$download->shouldReceive( 'get_name' )->andReturn( 'ebook.pdf' );
			$download->shouldReceive( 'get_file' )->andReturn( 'https://example.com/ebook.pdf' );
			$download->shouldReceive( 'get_id' )->andReturn( 'dl_001' );

			$product = $this->createMockProduct(
				[
					'is_downloadable'    => true,
					'get_downloads'      => [ $download ],
					'get_download_limit' => 3,
					'get_download_expiry' => 30,
				]
			);
			$result = $this->mapper->mapMetadata( $product );

			$decoded_files = json_decode( $result['download_files'], true );
			$this->assertCount( 1, $decoded_files );
			$this->assertSame( 'ebook.pdf', $decoded_files[0]['name'] );
			$this->assertSame( 3, $result['download_limit'] );
			$this->assertSame( 30, $result['download_expiry'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_omits_download_files_for_non_downloadable() {
			$product = $this->createMockProduct( [ 'is_downloadable' => false ] );
			$result  = $this->mapper->mapMetadata( $product );

			$this->assertArrayNotHasKey( 'download_files', $result );
			$this->assertArrayNotHasKey( 'download_limit', $result );
			$this->assertArrayNotHasKey( 'download_expiry', $result );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_includes_shipping_class_when_set() {
			if ( ! taxonomy_exists( 'product_shipping_class' ) ) {
				register_taxonomy( 'product_shipping_class', 'post' );
			}
			$term = wp_insert_term( 'Express', 'product_shipping_class', [ 'slug' => 'express' ] );

			$product = $this->createMockProduct( [ 'get_shipping_class_id' => $term['term_id'] ] );
			$result  = $this->mapper->mapMetadata( $product );

			$this->assertSame( 'express', $result['wc_shipping_class'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_applies_product_metadata_filter() {
			add_filter(
				'surecart/woocommerce_sync/product_metadata',
				function ( $metadata ) {
					$metadata['custom_meta'] = 'custom_value';
					return $metadata;
				}
			);

			$product = $this->createMockProduct();
			$result  = $this->mapper->mapMetadata( $product );

			$this->assertSame( 'custom_value', $result['custom_meta'] );
		}

		// =========================================================================
		// Group 26: Integration/Edge Cases — 5 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_full_simple_product_mapping_integration() {
			$post_id = self::factory()->post->create( [ 'comment_status' => 'open' ] );

			$product = $this->createMockProduct(
				[
					'get_id'                    => $post_id,
					'get_name'                  => 'Integration Product',
					'get_slug'                  => 'integration-product',
					'get_type'                  => 'simple',
					'get_status'                => 'publish',
					'get_description'           => 'Full test',
					'get_sku'                   => 'INT-001',
					'get_price'                 => '49.99',
					'get_regular_price'         => '49.99',
					'is_featured'               => true,
					'is_virtual'                => false,
					'is_downloadable'           => false,
					'is_taxable'                => true,
					'get_catalog_visibility'    => 'visible',
					'get_image_id'              => 0,
					'get_gallery_image_ids'     => [],
					'get_category_ids'          => [],
					'get_tag_ids'               => [],
				]
			);

			$data = $this->mapper->mapWooCommerceProductToSureCart( $product );

			// Core fields.
			$this->assertSame( 'Integration Product', $data['name'] );
			$this->assertSame( 'integration-product', $data['slug'] );
			$this->assertTrue( $data['featured'] );
			$this->assertSame( 'published', $data['status'] );

			// Prices.
			$this->assertCount( 1, $data['prices'] );
			$this->assertSame( 4999, $data['prices'][0]['amount'] );

			// Tax.
			$this->assertTrue( $data['tax_enabled'] );
			$this->assertSame( 'tangible', $data['tax_category'] );

			// Shipping.
			$this->assertTrue( $data['shipping_enabled'] );
			$this->assertFalse( $data['auto_fulfill_enabled'] );

			// Metadata.
			$this->assertSame( $post_id, $data['metadata']['wc_product_id'] );
			$this->assertSame( 'simple', $data['metadata']['wc_product_type'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_full_variable_product_mapping_integration() {
			$attribute = \Mockery::mock( 'WC_Product_Attribute' );
			$attribute->shouldReceive( 'get_variation' )->andReturn( true );
			$attribute->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attribute->shouldReceive( 'get_name' )->andReturn( 'Size' );
			$attribute->shouldReceive( 'get_options' )->andReturn( [ 'S', 'M', 'L' ] );

			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( 'VAR-S' );
			$variation->shouldReceive( 'get_price' )->andReturn( '25.00' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '25.00' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 201 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn( [ 'attribute_size' => 'S' ] );
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$post_id = self::factory()->post->create();
			$product = $this->createMockProduct(
				[
					'get_id'                    => $post_id,
					'get_type'                  => 'variable',
					'get_attributes'            => [ $attribute ],
					'get_children'              => [ 201 ],
					'get_available_variations'  => [ [ 'variation_id' => 201 ] ],
					'get_category_ids'          => [],
					'get_tag_ids'               => [],
					'get_image_id'              => 0,
					'get_gallery_image_ids'     => [],
				]
			);

			$data = $this->mapper->mapWooCommerceProductToSureCart( $product );

			$this->assertArrayHasKey( 'variant_options', $data );
			$this->assertArrayHasKey( 'variants', $data );
			$this->assertCount( 1, $data['variant_options'] );
			$this->assertSame( 'Size', $data['variant_options'][0]['name'] );
			$this->assertSame( [ 'S', 'M', 'L' ], $data['variant_options'][0]['values'] );
			$this->assertCount( 1, $data['variants'] );
			$this->assertSame( 'S', $data['variants'][0]['option_1'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_multiple_products_each_return_data() {
			$product1 = $this->createMockProduct( [ 'get_name' => 'Product 1' ] );
			$product2 = $this->createMockProduct( [ 'get_name' => 'Product 2' ] );
			$product3 = $this->createMockProduct( [ 'get_name' => 'Product 3' ] );

			$data1 = $this->mapper->mapWooCommerceProductToSureCart( $product1 );
			$data2 = $this->mapper->mapWooCommerceProductToSureCart( $product2 );
			$data3 = $this->mapper->mapWooCommerceProductToSureCart( $product3 );

			$this->assertIsArray( $data1 );
			$this->assertIsArray( $data2 );
			$this->assertIsArray( $data3 );
			$this->assertSame( 'Product 1', $data1['name'] );
			$this->assertSame( 'Product 2', $data2['name'] );
			$this->assertSame( 'Product 3', $data3['name'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_subscription_product_full_mapping() {
			\WC_Subscriptions_Product::$mock_is_subscription = true;
			\WC_Subscriptions_Product::$mock_period          = 'month';
			\WC_Subscriptions_Product::$mock_interval         = 1;
			\WC_Subscriptions_Product::$mock_length           = 12;
			\WC_Subscriptions_Product::$mock_trial_length     = 1;
			\WC_Subscriptions_Product::$mock_trial_period     = 'week';
			\WC_Subscriptions_Product::$mock_sign_up_fee      = 10.00;

			$product = $this->createMockProduct(
				[
					'get_name'          => 'Monthly Sub',
					'get_price'         => '29.99',
					'get_regular_price' => '29.99',
					'is_on_sale'        => false,
					'get_sale_price'    => '',
				]
			);

			$result = $this->mapper->mapPrices( $product );

			$this->assertCount( 1, $result );
			$this->assertSame( 2999, $result[0]['amount'] );
			$this->assertSame( 'month', $result[0]['recurring_interval'] );
			$this->assertSame( 1, $result[0]['recurring_interval_count'] );
			$this->assertSame( 12, $result[0]['recurring_period_count'] );
			$this->assertSame( 7, $result[0]['trial_duration_days'] );
			$this->assertTrue( $result[0]['setup_fee_enabled'] );
			$this->assertSame( 1000, $result[0]['setup_fee_amount'] );
			$this->assertTrue( $result[0]['metadata']['wc_subscription_product'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_zero_decimal_currency_full_pricing() {
			$GLOBALS['test_woocommerce_currency'] = 'JPY';

			$product = $this->createMockProduct(
				[
					'get_price'         => '1500',
					'get_regular_price' => '2000',
					'get_sale_price'    => '1500',
					'is_on_sale'        => true,
				]
			);

			$result = $this->mapper->mapPrices( $product );

			$this->assertSame( 1500, $result[0]['amount'] );
			$this->assertSame( 2000, $result[0]['scratch_amount'] );
			$this->assertSame( 'jpy', $result[0]['currency'] );
		}

		// =========================================================================
		// Group 27: Floating-Point Precision (Fix #1) — 4 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_convert_price_handles_floating_point_precision_1999() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			$this->assertSame( 1999, $this->mapper->convertPriceToInteger( '19.99' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_handles_floating_point_precision_995() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			$this->assertSame( 995, $this->mapper->convertPriceToInteger( '9.95' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_handles_floating_point_precision_001() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			$this->assertSame( 1, $this->mapper->convertPriceToInteger( '0.01' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_convert_price_handles_floating_point_precision_3333() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			$this->assertSame( 3333, $this->mapper->convertPriceToInteger( '33.33' ) );
		}

		// =========================================================================
		// Group 28: cataloged_at Unix Timestamp (Fix #2) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_cataloged_at_is_unix_timestamp() {
			$date    = new \WC_DateTime( '2024-01-15 10:00:00' );
			$product = $this->createMockProduct( [ 'get_date_created' => $date ] );
			$result  = $this->mapper->mapCoreFields( $product );

			$this->assertIsInt( $result['cataloged_at'] );
			$this->assertSame( $date->getTimestamp(), $result['cataloged_at'] );
		}

		// =========================================================================
		// Group 29: Empty SKU and Description (Fix #8, #12) — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_maps_empty_sku_to_null() {
			$product = $this->createMockProduct( [ 'get_sku' => '' ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertEmpty( $result['sku'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_core_fields_maps_empty_description_to_null() {
			$product = $this->createMockProduct( [ 'get_description' => '' ] );
			$result  = $this->mapper->mapCoreFields( $product );
			$this->assertEmpty( $result['description'] );
		}

		// =========================================================================
		// Group 30: Currency Lowercase (Fix #3) — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_prices_currency_is_lowercase() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			$product = $this->createMockProduct();
			$result  = $this->mapper->mapPrices( $product );
			$this->assertSame( 'usd', $result[0]['currency'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_currency_is_lowercase() {
			$GLOBALS['test_woocommerce_currency'] = 'USD';
			\WC_Subscriptions_Product::$mock_is_subscription = true;

			$product = $this->createMockProduct( [ 'get_price' => '9.99' ] );
			$result  = $this->mapper->mapPrices( $product );
			$this->assertSame( 'usd', $result[0]['currency'] );
		}

		// =========================================================================
		// Group 31: Weight Unit Mapping (Fix #4) — 3 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_maps_lbs_to_lb() {
			update_option( 'woocommerce_weight_unit', 'lbs' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_weight'      => '3.5',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertSame( 'lb', $result['weight_unit'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_maps_oz_stays_oz() {
			update_option( 'woocommerce_weight_unit', 'oz' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_weight'      => '16',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertSame( 'oz', $result['weight_unit'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_maps_kg_stays_kg() {
			update_option( 'woocommerce_weight_unit', 'kg' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_weight'      => '2',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertSame( 'kg', $result['weight_unit'] );
		}

		// =========================================================================
		// Group 32: Dimension Unit Mapping (Fix #5) — 3 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_maps_yd_to_ft() {
			update_option( 'woocommerce_dimension_unit', 'yd' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_length'      => '2',
					'get_width'       => '1',
					'get_height'      => '0.5',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertSame( 'ft', $result['dimensions']['unit'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_converts_yd_values_to_ft() {
			update_option( 'woocommerce_dimension_unit', 'yd' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_length'      => '2',
					'get_width'       => '1',
					'get_height'      => '0.5',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			// Yards to feet: multiply by 3.
			$this->assertSame( 6.0, $result['dimensions']['length'] );
			$this->assertSame( 3.0, $result['dimensions']['width'] );
			$this->assertSame( 1.5, $result['dimensions']['height'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_shipping_fields_keeps_cm_unit_unchanged() {
			update_option( 'woocommerce_dimension_unit', 'cm' );
			$product = $this->createMockProduct(
				[
					'is_virtual'      => false,
					'is_downloadable' => false,
					'get_length'      => '10',
					'get_width'       => '5',
					'get_height'      => '3',
				]
			);
			$result = $this->mapper->mapShippingFields( $product );
			$this->assertSame( 'cm', $result['dimensions']['unit'] );
			$this->assertSame( 10.0, $result['dimensions']['length'] );
			$this->assertSame( 5.0, $result['dimensions']['width'] );
			$this->assertSame( 3.0, $result['dimensions']['height'] );
		}

		// =========================================================================
		// Group 33: recurring_period_count (Fix #6) — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_recurring_period_count_null_when_length_zero() {
			\WC_Subscriptions_Product::$mock_is_subscription = true;
			\WC_Subscriptions_Product::$mock_length          = 0;

			$product = $this->createMockProduct( [ 'get_price' => '9.99' ] );
			$result  = $this->mapper->mapSubscriptionPrices( $product );
			$this->assertNull( $result[0]['recurring_period_count'] );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_subscription_prices_recurring_period_count_null_when_length_empty() {
			\WC_Subscriptions_Product::$mock_is_subscription = true;
			\WC_Subscriptions_Product::$mock_length          = '';

			$product = $this->createMockProduct( [ 'get_price' => '9.99' ] );
			$result  = $this->mapper->mapSubscriptionPrices( $product );
			$this->assertNull( $result[0]['recurring_period_count'] );
		}

		// =========================================================================
		// Group 34: Variant "Any" Attribute Index (Fix #7) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_variants_preserves_option_index_for_any_attribute() {
			// Create 3 variation attributes: Color, Size, Material.
			$attr_color = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_color->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_color->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_color->shouldReceive( 'get_name' )->andReturn( 'Color' );
			$attr_color->shouldReceive( 'get_options' )->andReturn( [ 'Red', 'Blue' ] );

			$attr_size = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_size->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_size->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_size->shouldReceive( 'get_name' )->andReturn( 'Size' );
			$attr_size->shouldReceive( 'get_options' )->andReturn( [ 'Small', 'Large' ] );

			$attr_material = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_material->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_material->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_material->shouldReceive( 'get_name' )->andReturn( 'Material' );
			$attr_material->shouldReceive( 'get_options' )->andReturn( [ 'Cotton', 'Polyester' ] );

			// Variation with "Any" color (empty string), specific size and material.
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( '' );
			$variation->shouldReceive( 'get_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 900 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn(
				[
					'attribute_color'    => '',       // "Any" color.
					'attribute_size'     => 'Large',
					'attribute_material' => 'Cotton',
				]
			);
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                 => 'variable',
					'get_id'                   => 100,
					'get_attributes'           => [ $attr_color, $attr_size, $attr_material ],
					'get_children'             => [ 900 ],
					'get_available_variations' => [ [ 'variation_id' => 900 ] ],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];

			// option_1 (Color) should NOT be set (it's "Any").
			$this->assertArrayNotHasKey( 'option_1', $variant );
			// option_2 (Size) should be 'Large'.
			$this->assertSame( 'Large', $variant['option_2'] );
			// option_3 (Material) should be 'Cotton'.
			$this->assertSame( 'Cotton', $variant['option_3'] );
		}

		// =========================================================================
		// Group 35: Media URL-Only (Fix #9) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_media_only_includes_url_field() {
			$attachment_id = self::factory()->attachment->create_upload_object(
				ABSPATH . 'wp-includes/images/w-logo-blue-white-bg.png'
			);

			$product = $this->createMockProduct(
				[
					'get_image_id'          => $attachment_id,
					'get_gallery_image_ids' => [],
				]
			);
			$result = $this->mapper->mapMedia( $product );

			$this->assertCount( 1, $result );
			$this->assertCount( 1, $result[0] ); // Only one key: 'url'.
			$this->assertArrayHasKey( 'url', $result[0] );
		}

		// =========================================================================
		// Group 37: Taxonomy Attribute Terms (Fix #11) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_variants_uses_product_attribute_options_for_taxonomy() {
			// Register a taxonomy with 4 terms, but only use 2 on the product.
			if ( ! taxonomy_exists( 'pa_color' ) ) {
				register_taxonomy( 'pa_color', 'post' );
			}
			$red   = wp_insert_term( 'Red', 'pa_color' );
			$blue  = wp_insert_term( 'Blue', 'pa_color' );
			wp_insert_term( 'Green', 'pa_color' );
			wp_insert_term( 'Yellow', 'pa_color' );

			$attribute = \Mockery::mock( 'WC_Product_Attribute' );
			$attribute->shouldReceive( 'get_variation' )->andReturn( true );
			$attribute->shouldReceive( 'is_taxonomy' )->andReturn( true );
			$attribute->shouldReceive( 'get_name' )->andReturn( 'pa_color' );
			$attribute->shouldReceive( 'get_taxonomy' )->andReturn( 'pa_color' );
			// Only return 2 term IDs (product only uses Red and Blue).
			$attribute->shouldReceive( 'get_options' )->andReturn( [ $red['term_id'], $blue['term_id'] ] );

			$product = $this->createMockProduct(
				[
					'get_type'                 => 'variable',
					'get_attributes'           => [ $attribute ],
					'get_available_variations' => [],
				]
			);

			$result = $this->mapper->mapVariants( $product );

			// Should only have 2 values (Red, Blue), not all 4 taxonomy terms.
			$this->assertCount( 2, $result['variant_options'][0]['values'] );
			$this->assertContains( 'Red', $result['variant_options'][0]['values'] );
			$this->assertContains( 'Blue', $result['variant_options'][0]['values'] );
		}

		// =========================================================================
		// Group 38: Variant No Currency (Fix #13) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_variants_does_not_include_currency_on_variant() {
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( 'VAR-001' );
			$variation->shouldReceive( 'get_price' )->andReturn( '24.99' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '24.99' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 456 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn( [] );
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                 => 'variable',
					'get_id'                   => 123,
					'get_attributes'           => [],
					'get_children'             => [ 456 ],
					'get_available_variations' => [ [ 'variation_id' => 456 ] ],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];
			$this->assertArrayNotHasKey( 'currency', $variant );
		}

		// =========================================================================
		// Group 39: Attribute Order Match (Fix #14) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_variants_maps_options_in_correct_order_with_parent_attributes() {
			// Create 2 attributes: Color (position 0), Size (position 1).
			$attr_color = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_color->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_color->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_color->shouldReceive( 'get_name' )->andReturn( 'Color' );
			$attr_color->shouldReceive( 'get_options' )->andReturn( [ 'Red', 'Blue' ] );

			$attr_size = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_size->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_size->shouldReceive( 'is_taxonomy' )->andReturn( false );
			$attr_size->shouldReceive( 'get_name' )->andReturn( 'Size' );
			$attr_size->shouldReceive( 'get_options' )->andReturn( [ 'S', 'L' ] );

			// Variation attributes may come in different order.
			$variation = \Mockery::mock( 'WC_Product_Variation' );
			$variation->shouldReceive( 'get_sku' )->andReturn( '' );
			$variation->shouldReceive( 'get_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_regular_price' )->andReturn( '10' );
			$variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$variation->shouldReceive( 'is_on_sale' )->andReturn( false );
			$variation->shouldReceive( 'managing_stock' )->andReturn( false );
			$variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$variation->shouldReceive( 'backorders_allowed' )->andReturn( false );
			$variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$variation->shouldReceive( 'get_id' )->andReturn( 800 );
			$variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$variation->shouldReceive( 'get_length' )->andReturn( '' );
			$variation->shouldReceive( 'get_width' )->andReturn( '' );
			$variation->shouldReceive( 'get_height' )->andReturn( '' );
			$variation->shouldReceive( 'get_variation_attributes' )->andReturn(
				[
					'attribute_size'  => 'L',
					'attribute_color' => 'Red',
				]
			);
			$variation->shouldReceive( 'get_image_id' )->andReturn( 0 );

			$GLOBALS['test_wc_get_product_result'] = $variation;

			$product = $this->createMockProduct(
				[
					'get_type'                 => 'variable',
					'get_id'                   => 100,
					'get_attributes'           => [ $attr_color, $attr_size ],
					'get_children'             => [ 800 ],
					'get_available_variations' => [ [ 'variation_id' => 800 ] ],
				]
			);

			$result  = $this->mapper->mapVariants( $product );
			$variant = $result['variants'][0];

			// option_1 should match Color (first parent attribute), option_2 should match Size.
			$this->assertSame( 'Red', $variant['option_1'] );
			$this->assertSame( 'L', $variant['option_2'] );
		}

		// =========================================================================
		// Group 41: Tax Category for Subscriptions (Fix #19) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_tax_fields_maps_subscription_to_digital() {
			\WC_Subscriptions_Product::$mock_is_subscription = true;

			$product = $this->createMockProduct(
				[
					'is_taxable'      => true,
					'is_virtual'      => true,
					'is_downloadable' => false,
				]
			);
			$result = $this->mapper->mapTaxFields( $product );
			$this->assertSame( 'digital', $result['tax_category'] );
		}

		// =========================================================================
		// Group 42: Metadata JSON Encoding (Fix #17) — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_metadata_json_encodes_array_values() {
			$product = $this->createMockProduct(
				[
					'get_rating_counts'  => [ 5 => 10, 4 => 5 ],
					'get_upsell_ids'     => [ 10, 20 ],
					'get_cross_sell_ids' => [ 30, 40 ],
				]
			);
			$result = $this->mapper->mapMetadata( $product );

			$this->assertIsString( $result['wc_rating_counts'] );
			$this->assertIsString( $result['wc_upsell_ids'] );
			$this->assertIsString( $result['wc_cross_sell_ids'] );

			// Verify they can be decoded back.
			$this->assertSame( [ 10, 20 ], json_decode( $result['wc_upsell_ids'], true ) );
			$this->assertSame( [ 30, 40 ], json_decode( $result['wc_cross_sell_ids'], true ) );
		}

		// =========================================================================
		// Group 43: Weight/Dimension Unit Helpers — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_weight_unit_maps_lbs_to_lb() {
			$this->assertSame( 'lb', $this->mapper->mapWeightUnit( 'lbs' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_dimension_unit_maps_yd_to_ft() {
			$this->assertSame( 'ft', $this->mapper->mapDimensionUnit( 'yd' ) );
		}

		// =========================================================================
		// Group 46: mapWeightUnit/mapDimensionUnit edge cases — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_weight_unit_returns_lb_for_unknown_unit() {
			$this->assertSame( 'lb', $this->mapper->mapWeightUnit( 'unknown' ) );
		}

		/**
		 * @group woo_import
		 */
		public function test_map_dimension_unit_returns_in_for_unknown_unit() {
			$this->assertSame( 'in', $this->mapper->mapDimensionUnit( 'unknown' ) );
		}

		// =========================================================================
		// Group 47: Subscription Variant Tax Category (Fix) — 2 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_map_variants_uses_digital_tax_category_for_subscription_variants() {
			\WC_Subscriptions_Product::$mock_is_subscription = true;

			$virtual_variation = \Mockery::mock( 'WC_Product_Variation' );
			$virtual_variation->shouldReceive( 'get_sku' )->andReturn( 'SUB-VAR-001' );
			$virtual_variation->shouldReceive( 'get_price' )->andReturn( '29.99' );
			$virtual_variation->shouldReceive( 'get_regular_price' )->andReturn( '29.99' );
			$virtual_variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'is_virtual' )->andReturn( true );
			$virtual_variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$virtual_variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$virtual_variation->shouldReceive( 'get_manage_stock' )->andReturn( false );
			$virtual_variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_length' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_width' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_height' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_id' )->andReturn( 101 );
			$virtual_variation->shouldReceive( 'get_attributes' )->andReturn( [ 'pa_plan' => 'premium' ] );

			$physical_variation = \Mockery::mock( 'WC_Product_Variation' );
			$physical_variation->shouldReceive( 'get_sku' )->andReturn( 'SUB-VAR-002' );
			$physical_variation->shouldReceive( 'get_price' )->andReturn( '39.99' );
			$physical_variation->shouldReceive( 'get_regular_price' )->andReturn( '39.99' );
			$physical_variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$physical_variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$physical_variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$physical_variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$physical_variation->shouldReceive( 'get_manage_stock' )->andReturn( false );
			$physical_variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_length' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_width' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_height' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_id' )->andReturn( 102 );
			$physical_variation->shouldReceive( 'get_attributes' )->andReturn( [ 'pa_plan' => 'enterprise' ] );

			$attr_plan = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_plan->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_plan->shouldReceive( 'is_taxonomy' )->andReturn( true );
			$attr_plan->shouldReceive( 'get_name' )->andReturn( 'pa_plan' );
			$attr_plan->shouldReceive( 'get_options' )->andReturn( [ 'premium', 'enterprise' ] );

			$product = $this->createMockProduct(
				[
					'get_type'       => 'variable',
					'get_attributes' => [ 'pa_plan' => $attr_plan ],
					'get_children'   => [ 101, 102 ],
					'get_manage_stock' => false,
				]
			);

			// Mock WooCommerce global function to return our variation objects.
			\WP_Mock::userFunction( 'wc_get_product' )
				->with( 101 )
				->andReturn( $virtual_variation );
			\WP_Mock::userFunction( 'wc_get_product' )
				->with( 102 )
				->andReturn( $physical_variation );

			$result = $this->mapper->mapVariants( $product );

			$this->assertCount( 2, $result );

			// Both variants should have 'digital' tax_category regardless of virtual status.
			$this->assertSame( 'digital', $result[0]['tax_category'] );
			$this->assertSame( 'digital', $result[1]['tax_category'] );

			\WC_Subscriptions_Product::$mock_is_subscription = false;
		}

		/**
		 * @group woo_import
		 */
		public function test_map_variants_preserves_digital_tangible_for_non_subscription() {
			\WC_Subscriptions_Product::$mock_is_subscription = false;

			$virtual_variation = \Mockery::mock( 'WC_Product_Variation' );
			$virtual_variation->shouldReceive( 'get_sku' )->andReturn( 'REG-VAR-001' );
			$virtual_variation->shouldReceive( 'get_price' )->andReturn( '19.99' );
			$virtual_variation->shouldReceive( 'get_regular_price' )->andReturn( '19.99' );
			$virtual_variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'is_virtual' )->andReturn( true );
			$virtual_variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$virtual_variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$virtual_variation->shouldReceive( 'get_manage_stock' )->andReturn( false );
			$virtual_variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_length' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_width' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_height' )->andReturn( '' );
			$virtual_variation->shouldReceive( 'get_id' )->andReturn( 201 );
			$virtual_variation->shouldReceive( 'get_attributes' )->andReturn( [ 'pa_size' => 'small' ] );

			$physical_variation = \Mockery::mock( 'WC_Product_Variation' );
			$physical_variation->shouldReceive( 'get_sku' )->andReturn( 'REG-VAR-002' );
			$physical_variation->shouldReceive( 'get_price' )->andReturn( '24.99' );
			$physical_variation->shouldReceive( 'get_regular_price' )->andReturn( '24.99' );
			$physical_variation->shouldReceive( 'get_sale_price' )->andReturn( '' );
			$physical_variation->shouldReceive( 'is_virtual' )->andReturn( false );
			$physical_variation->shouldReceive( 'is_taxable' )->andReturn( true );
			$physical_variation->shouldReceive( 'get_stock_quantity' )->andReturn( null );
			$physical_variation->shouldReceive( 'get_manage_stock' )->andReturn( false );
			$physical_variation->shouldReceive( 'get_weight' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_length' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_width' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_height' )->andReturn( '' );
			$physical_variation->shouldReceive( 'get_id' )->andReturn( 202 );
			$physical_variation->shouldReceive( 'get_attributes' )->andReturn( [ 'pa_size' => 'large' ] );

			$attr_size = \Mockery::mock( 'WC_Product_Attribute' );
			$attr_size->shouldReceive( 'get_variation' )->andReturn( true );
			$attr_size->shouldReceive( 'is_taxonomy' )->andReturn( true );
			$attr_size->shouldReceive( 'get_name' )->andReturn( 'pa_size' );
			$attr_size->shouldReceive( 'get_options' )->andReturn( [ 'small', 'large' ] );

			$product = $this->createMockProduct(
				[
					'get_type'       => 'variable',
					'get_attributes' => [ 'pa_size' => $attr_size ],
					'get_children'   => [ 201, 202 ],
					'get_manage_stock' => false,
				]
			);

			// Mock WooCommerce global function to return our variation objects.
			\WP_Mock::userFunction( 'wc_get_product' )
				->with( 201 )
				->andReturn( $virtual_variation );
			\WP_Mock::userFunction( 'wc_get_product' )
				->with( 202 )
				->andReturn( $physical_variation );

			$result = $this->mapper->mapVariants( $product );

			$this->assertCount( 2, $result );

			// Non-subscription variants should preserve original logic.
			$this->assertSame( 'digital', $result[0]['tax_category'] );  // Virtual variant
			$this->assertSame( 'tangible', $result[1]['tax_category'] ); // Physical variant
		}

		// =========================================================================
		// Group 48: Collection Deduplication Fix — 1 test
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_resolve_collections_queries_by_name_to_avoid_duplicates() {
			// Mock a WooCommerce category term
			$category_term = \Mockery::mock( 'WP_Term' );
			$category_term->term_id = 70;
			$category_term->name = 'Tshirts';
			$category_term->slug = 'tshirts';
			$category_term->description = 'T-shirt products';

			// Mock the ProductCollection model to track API calls
			$existing_collection = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$existing_collection->id = 'sc_12345';
			$existing_collection->slug = 'tshirts';
			$existing_collection->name = 'Tshirts';

			// Mock the where() query to return existing collection
			\SureCart\Models\ProductCollection::shouldReceive( 'where' )
				->with( [
					'query' => 'Tshirts',
					'limit' => 10,
				] )
				->once()
				->andReturnSelf();

			\SureCart\Models\ProductCollection::shouldReceive( 'get' )
				->once()
				->andReturn( [ $existing_collection ] );

			// ProductCollection::create should NOT be called since collection exists
			\SureCart\Models\ProductCollection::shouldReceive( 'create' )
				->never();

			// Call the method that resolves collections
			$collections_input = [
				[
					'term'   => $category_term,
					'source' => 'product_cat',
				],
			];

			$result = $this->mapper->resolveCollections( $collections_input );

			// Should return the existing collection, not create a new one
			$this->assertCount( 1, $result );
			$this->assertSame( 'sc_12345', $result[0]->id );
			$this->assertSame( 'tshirts', $result[0]->slug );
		}

		// =========================================================================
		// Group 49: Collection Deduplication Edge Cases — 5 tests
		// =========================================================================

		/**
		 * @group woo_import
		 */
		public function test_resolve_collections_handles_duplicate_collection_names() {
			// Mock two WooCommerce terms with the same name but different sources
			$category_term = (object) [
				'term_id' => 80,
				'name' => 'Electronics',
				'slug' => 'electronics-cat',
				'description' => 'Electronics category'
			];

			$tag_term = (object) [
				'term_id' => 90,
				'name' => 'Electronics',  // Same name
				'slug' => 'electronics-tag',
				'description' => 'Electronics tag'
			];

			// Mock collection that matches both names
			$existing_collection = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$existing_collection->id = 'sc_electronics';
			$existing_collection->slug = 'electronics';
			$existing_collection->name = 'Electronics';

			// Mock API response for both queries (same collection returned)
			\SureCart\Models\ProductCollection::shouldReceive( 'where' )
				->with( [
					'query' => 'Electronics',
					'limit' => 10,
				] )
				->twice()
				->andReturnSelf();

			\SureCart\Models\ProductCollection::shouldReceive( 'get' )
				->twice()
				->andReturn( [ $existing_collection ] );

			// Should not create any new collections
			\SureCart\Models\ProductCollection::shouldReceive( 'create' )
				->never();

			$collections_input = [
				[
					'term'   => $category_term,
					'source' => 'product_cat',
				],
				[
					'term'   => $tag_term,
					'source' => 'product_tag',
				],
			];

			$result = $this->mapper->resolveCollections( $collections_input );

			// Should deduplicate and return only one collection
			$this->assertCount( 1, $result );
			$this->assertSame( 'sc_electronics', $result[0]->id );
		}

		/**
		 * @group woo_import
		 */
		public function test_resolve_collections_handles_empty_collection_results() {
			// Mock WooCommerce term
			$category_term = (object) [
				'term_id' => 100,
				'name' => 'Nonexistent Category',
				'slug' => 'nonexistent',
				'description' => 'Does not exist'
			];

			// Mock empty API response
			\SureCart\Models\ProductCollection::shouldReceive( 'where' )
				->with( [
					'query' => 'Nonexistent Category',
					'limit' => 10,
				] )
				->once()
				->andReturnSelf();

			\SureCart\Models\ProductCollection::shouldReceive( 'get' )
				->once()
				->andReturn( [] );  // Empty result

			// Mock collection creation
			$new_collection = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$new_collection->id = 'sc_new_123';
			$new_collection->slug = 'nonexistent-category';
			$new_collection->name = 'Nonexistent Category';

			\SureCart\Models\ProductCollection::shouldReceive( 'create' )
				->once()
				->with( [
					'name' => 'Nonexistent Category',
					'slug' => 'nonexistent',
					'description' => 'Does not exist',
				] )
				->andReturn( $new_collection );

			$collections_input = [
				[
					'term'   => $category_term,
					'source' => 'product_cat',
				],
			];

			$result = $this->mapper->resolveCollections( $collections_input );

			// Should create new collection when not found
			$this->assertCount( 1, $result );
			$this->assertSame( 'sc_new_123', $result[0]->id );
		}

		/**
		 * @group woo_import
		 */
		public function test_resolve_collections_handles_api_error_gracefully() {
			// Mock WooCommerce term
			$category_term = (object) [
				'term_id' => 110,
				'name' => 'Error Category',
				'slug' => 'error-cat',
				'description' => 'Causes API error'
			];

			// Mock API error response
			$api_error = new \WP_Error( 'api_error', 'Service unavailable' );
			\SureCart\Models\ProductCollection::shouldReceive( 'where' )
				->with( [
					'query' => 'Error Category',
					'limit' => 10,
				] )
				->once()
				->andReturnSelf();

			\SureCart\Models\ProductCollection::shouldReceive( 'get' )
				->once()
				->andReturn( $api_error );

			// Should still attempt to create collection despite search error
			$new_collection = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$new_collection->id = 'sc_error_recovery';
			$new_collection->slug = 'error-category';
			$new_collection->name = 'Error Category';

			\SureCart\Models\ProductCollection::shouldReceive( 'create' )
				->once()
				->andReturn( $new_collection );

			$collections_input = [
				[
					'term'   => $category_term,
					'source' => 'product_cat',
				],
			];

			$result = $this->mapper->resolveCollections( $collections_input );

			// Should recover from API error by creating collection
			$this->assertCount( 1, $result );
			$this->assertSame( 'sc_error_recovery', $result[0]->id );
		}

		/**
		 * @group woo_import
		 */
		public function test_resolve_collections_handles_cache_miss_scenarios() {
			// Mock WooCommerce term
			$category_term = (object) [
				'term_id' => 120,
				'name' => 'Cache Test',
				'slug' => 'cache-test',
				'description' => 'Tests cache behavior'
			];

			// Mock collection
			$existing_collection = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$existing_collection->id = 'sc_cache_test';
			$existing_collection->slug = 'cache-test';
			$existing_collection->name = 'Cache Test';

			// First call (cache miss) - API is called
			\SureCart\Models\ProductCollection::shouldReceive( 'where' )
				->with( [
					'query' => 'Cache Test',
					'limit' => 10,
				] )
				->once()
				->andReturnSelf();

			\SureCart\Models\ProductCollection::shouldReceive( 'get' )
				->once()
				->andReturn( [ $existing_collection ] );

			$collections_input = [
				[
					'term'   => $category_term,
					'source' => 'product_cat',
				],
			];

			// First call should make API request
			$result1 = $this->mapper->resolveCollections( $collections_input );
			$this->assertCount( 1, $result1 );
			$this->assertSame( 'sc_cache_test', $result1[0]->id );

			// Second call with same term should use cache (no additional API calls)
			$result2 = $this->mapper->resolveCollections( $collections_input );
			$this->assertCount( 1, $result2 );
			$this->assertSame( 'sc_cache_test', $result2[0]->id );
		}

		/**
		 * @group woo_import
		 */
		public function test_resolve_collections_handles_fuzzy_search_results() {
			// Mock WooCommerce term
			$category_term = (object) [
				'term_id' => 130,
				'name' => 'T-Shirts',
				'slug' => 't-shirts',
				'description' => 'T-shirt products'
			];

			// Mock fuzzy search results - API returns multiple similar matches
			$fuzzy_match1 = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$fuzzy_match1->id = 'sc_fuzzy1';
			$fuzzy_match1->slug = 'shirts';
			$fuzzy_match1->name = 'Shirts';  // Similar but not exact

			$exact_match = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$exact_match->id = 'sc_exact';
			$exact_match->slug = 't-shirts';
			$exact_match->name = 'T-Shirts';  // Exact match

			$fuzzy_match2 = \Mockery::mock( 'SureCart\Models\ProductCollection' );
			$fuzzy_match2->id = 'sc_fuzzy2';
			$fuzzy_match2->slug = 'tshirts';
			$fuzzy_match2->name = 'Tshirts';  // Similar but not exact

			// Mock API response with fuzzy results
			\SureCart\Models\ProductCollection::shouldReceive( 'where' )
				->with( [
					'query' => 'T-Shirts',
					'limit' => 10,
				] )
				->once()
				->andReturnSelf();

			\SureCart\Models\ProductCollection::shouldReceive( 'get' )
				->once()
				->andReturn( [ $fuzzy_match1, $exact_match, $fuzzy_match2 ] );

			// Should not create new collection since exact match found
			\SureCart\Models\ProductCollection::shouldReceive( 'create' )
				->never();

			$collections_input = [
				[
					'term'   => $category_term,
					'source' => 'product_cat',
				],
			];

			$result = $this->mapper->resolveCollections( $collections_input );

			// Should return only the exact match, not fuzzy matches
			$this->assertCount( 1, $result );
			$this->assertSame( 'sc_exact', $result[0]->id );
			$this->assertSame( 'T-Shirts', $result[0]->name );
		}

	}
}
