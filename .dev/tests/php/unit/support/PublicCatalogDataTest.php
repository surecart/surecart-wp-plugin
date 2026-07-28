<?php

namespace SureCart\Tests\Support;

use SureCart\Models\Product;
use SureCart\Request\RequestService;
use SureCart\Support\PublicCatalogData;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Private catalog fields must never be serialized into public page HTML.
 *
 * Covers PublicCatalogData — the choke point every public catalog
 * serialization (component data scripts, `#sc-store-data` initial state)
 * goes through — plus the bundle_items recursion added to
 * StripsPrivateCatalogFields, the storefront-preserved field allowances,
 * and the REST default (no preservation).
 */
class PublicCatalogDataTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Canary planted in metadata.download_files — a tokened download URL like
	 * the WooCommerce importer stores. It must never survive serialization.
	 */
	const DOWNLOAD_CANARY = 'https://example.com/wc-downloads/file.zip?token=canary_download_token_123';

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Support\Errors\ErrorsServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
				],
			],
			false
		);

		$this->registerSerializationFakes();

		parent::setUp();
	}

	/**
	 * Alias lightweight fakes for the services full product serialization
	 * touches, so model accessors can run without heavy providers.
	 *
	 * @return void
	 */
	private function registerSerializationFakes() {
		// account currency + protocol reads during serialization and form render.
		\SureCart::alias(
			'account',
			function () {
				return (object) [
					'currency'        => 'usd',
					'claimed'         => true,
					'review_protocol' => (object) [ 'reviews_enabled' => false ],
					'order_protocol'  => (object) [ 'capture_geo_address_enabled' => false ],
					'tax_protocol'    => (object) [],
				];
			}
		);

		// product post lookups during serialization.
		\SureCart::alias(
			'sync',
			function () {
				return new class() {
					public function product() {
						return $this;
					}
					public function post() {
						return $this;
					}
					public function withNotice( $notice = false ) {
						return $this;
					}
					public function queue( $model = null ) {
						return $this;
					}
					public function findByModelId( $id ) {
						return null;
					}
					public function primeByModelIds( $model_ids ) {}
				};
			}
		);

		// buy link permalink base + currency locale.
		\SureCart::alias(
			'settings',
			function () {
				return new class() {
					public function permalinks() {
						return $this;
					}
					public function getBase( $key ) {
						return 'buy';
					}
					public function get( $key, $default = null ) {
						return $default;
					}
				};
			}
		);

		// line item image placeholder fallback.
		\SureCart::alias(
			'core',
			function () {
				return new class() {
					public function assets() {
						return $this;
					}
					public function getUrl() {
						return '';
					}
				};
			}
		);

		// default form for page state and form render.
		\SureCart::alias(
			'forms',
			function () {
				return new class() {
					public function getDefault() {
						return (object) [ 'ID' => 0 ];
					}
					public function getDefaultId() {
						return 0;
					}
				};
			}
		);

		// checkout page url for page state.
		\SureCart::alias(
			'pages',
			function () {
				return new class() {
					public function url( $key ) {
						return 'https://example.com/checkout/';
					}
				};
			}
		);
	}

	/**
	 * Mock the platform request tolerantly and return the given fixture for
	 * the one catalog call. Display-currency fetches during amount formatting
	 * are tolerated, not captured.
	 *
	 * @param mixed $return Value to return for the catalog request.
	 *
	 * @return void
	 */
	private function mockCatalogRequest( $return ) {
		$requests = $this->mockDisplayCurrencyRequestsOnly();

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->andReturn( $return );
	}

	/**
	 * Mock the platform request so only display-currency fetches (fired by
	 * amount-formatting accessors during serialization) are tolerated.
	 *
	 * @return \Mockery\MockInterface
	 */
	private function mockDisplayCurrencyRequestsOnly() {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->withSomeOfArgs( 'display_currencies' )
			->zeroOrMoreTimes()
			->andReturn( (object) [ 'data' => [] ] );

		return $requests;
	}

	/**
	 * A product array carrying every private field under test, with a
	 * tokened download URL canary in metadata (the reported leak).
	 *
	 * @return array
	 */
	private function privateProductFixture() {
		return [
			'id'                       => 'prod_123',
			'object'                   => 'product',
			'name'                     => 'Test Product',
			'slug'                     => 'test-product',
			'description'              => 'A public description.',
			'status'                   => 'published',
			'archived'                 => false,
			'sku'                      => 'sk_product_secret_123',
			'stock_enabled'            => true,
			'stock'                    => 5,
			'available_stock'          => 4,
			'held_stock'               => 1,
			'tax_category'             => 'digital_goods',
			'tax_enabled'              => true,
			'purchase_limit'           => 3,
			'cataloged_at'             => 1700000000,
			'dimensions'               => [ 'length' => 10 ],
			'weight'                   => 1.5,
			'weight_unit'              => 'kg',
			'metadata'                 => [
				'download_files' => self::DOWNLOAD_CANARY,
				'purchase_note'  => 'purchase_note_secret_123',
			],
			'metrics'                  => [
				'currency'         => 'usd',
				'min_price_amount' => 1500,
				'max_price_amount' => 1500,
			],
			'commission_structure'     => [ 'id' => 'comm_secret_123' ],
			'downloads'                => [ 'data' => [ [ 'url' => 'https://example.com/files/secret-download.zip' ] ] ],
			'current_release_download' => [ 'id' => 'rel_dl_secret_123' ],
			'files'                    => [ 'data' => [ [ 'id' => 'file_secret_123' ] ] ],
			'shipping_profile'         => [ 'id' => 'sp_secret_123' ],
			'variant_options'          => [
				'data' => [
					[
						'id'       => 'vo_product_123',
						'object'   => 'variant_option',
						'name'     => 'Size',
						'values'   => [ 'Small' ],
						'metadata' => [ 'internal_note' => 'variant_option_meta_secret_123' ],
					],
				],
			],
			'variants'                 => [
				'data' => [
					[
						'id'              => 'variant_123',
						'object'          => 'variant',
						'option_1'        => 'Small',
						'amount'          => 1500,
						'currency'        => 'usd',
						'sku'             => 'sk_variant_secret_123',
						'stock'           => 3,
						'available_stock' => 2,
						'held_stock'      => 1,
						'metadata'        => [ 'internal_note' => 'variant_meta_secret_123' ],
					],
				],
			],
			'prices'                   => [
				'data' => [
					[
						'id'             => 'price_123',
						'object'         => 'price',
						'amount'         => 1500,
						'currency'       => 'usd',
						'archived'       => false,
						'position'       => 1,
						'scratch_amount' => 2000,
						'metadata'       => [ 'internal_note' => 'price_meta_secret_123' ],
						'archived_at'    => 1700000001,
						'discarded_at'   => 1700000002,
					],
				],
			],
		];
	}

	/**
	 * A bundle product whose component product and variants carry the same
	 * private fields — the nesting the reporter exploited.
	 *
	 * @return array
	 */
	private function bundleProductFixture() {
		$product = $this->privateProductFixture();

		$product['bundle']       = true;
		$product['bundle_items'] = [
			'data' => [
				[
					'id'                        => 'bundle_item_123',
					'object'                    => 'bundle_item',
					'quantity'                  => 1,
					'metadata'                  => [ 'internal_note' => 'bundle_item_meta_secret_123' ],
					'component_product'         => [
						'id'              => 'prod_component_123',
						'object'          => 'product',
						'name'            => 'Component Product',
						'sku'             => 'sk_component_secret_123',
						'metadata'        => [ 'download_files' => self::DOWNLOAD_CANARY ],
						'variant_options' => [
							'data' => [
								[
									'id'       => 'vo_component_product_123',
									'object'   => 'variant_option',
									'name'     => 'Color',
									'values'   => [ 'Red' ],
									'metadata' => [ 'internal_note' => 'component_product_variant_option_meta_secret_123' ],
								],
							],
						],
					],
					'component_variants'        => [
						'data' => [
							[
								'id'              => 'variant_component_123',
								'object'          => 'variant',
								'option_1'        => 'Red',
								'available_stock' => 7,
								'sku'             => 'sk_component_variant_secret_123',
								'metadata'        => [ 'internal_note' => 'component_variant_meta_secret_123' ],
							],
						],
					],
					'component_variant_options' => [
						'data' => [
							[
								'id'       => 'vo_123',
								'name'     => 'Color',
								'metadata' => [ 'internal_note' => 'component_variant_option_meta_secret_123' ],
							],
						],
					],
				],
			],
		];

		return $product;
	}

	/**
	 * Sentinel values that must never appear in a public serialization.
	 *
	 * @return array
	 */
	private function privateSentinels() {
		return [
			'canary_download_token_123',
			'purchase_note_secret_123',
			'sk_product_secret_123',
			'sk_variant_secret_123',
			'sk_component_secret_123',
			'sk_component_variant_secret_123',
			'product_meta_secret_123',
			'variant_meta_secret_123',
			'price_meta_secret_123',
			'bundle_item_meta_secret_123',
			'component_variant_meta_secret_123',
			'variant_option_meta_secret_123',
			'component_variant_option_meta_secret_123',
			'component_product_variant_option_meta_secret_123',
			'comm_secret_123',
			'secret-download.zip',
			'rel_dl_secret_123',
			'file_secret_123',
			'sp_secret_123',
		];
	}

	/**
	 * Assert none of the private sentinels survive in a payload.
	 *
	 * @param mixed $payload The stripped payload.
	 *
	 * @return void
	 */
	private function assertNoPrivateSentinels( $payload ) {
		$json = wp_json_encode( $payload );
		foreach ( $this->privateSentinels() as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $json );
		}
	}

	/**
	 * @group public-catalog-serialization
	 */
	public function test_product_serialization_omits_private_fields() {
		$product = ( new PublicCatalogData() )->product( $this->privateProductFixture() );

		foreach ( [ 'metadata', 'sku', 'stock', 'held_stock', 'status', 'cataloged_at', 'dimensions', 'weight', 'weight_unit', 'tax_category', 'tax_enabled', 'commission_structure', 'downloads', 'current_release_download', 'files', 'shipping_profile' ] as $field ) {
			$this->assertArrayNotHasKey( $field, $product, "product.$field should be stripped" );
		}

		foreach ( [ 'metadata', 'sku', 'stock', 'held_stock' ] as $field ) {
			$this->assertArrayNotHasKey( $field, $product['variants']['data'][0], "variant.$field should be stripped" );
		}

		foreach ( [ 'metadata', 'archived_at', 'discarded_at' ] as $field ) {
			$this->assertArrayNotHasKey( $field, $product['prices']['data'][0], "price.$field should be stripped" );
		}

		$this->assertArrayNotHasKey( 'metadata', $product['variant_options']['data'][0], 'variant_option.metadata should be stripped' );

		$this->assertNoPrivateSentinels( $product );
	}

	/**
	 * A strip that removes too much is its own outage — the fields the
	 * storefront renders from must survive.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_product_serialization_keeps_public_and_storefront_fields() {
		$product = ( new PublicCatalogData() )->product( $this->privateProductFixture() );

		// public catalog fields.
		$this->assertSame( 'Test Product', $product['name'] );
		$this->assertSame( 'test-product', $product['slug'] );
		$this->assertSame( 'A public description.', $product['description'] );
		$this->assertSame( 1500, $product['prices']['data'][0]['amount'] );
		$this->assertSame( 2000, $product['prices']['data'][0]['scratch_amount'] );
		$this->assertSame( 'Small', $product['variants']['data'][0]['option_1'] );
		$this->assertSame( 1500, $product['metrics']['min_price_amount'] );

		// storefront-preserved fields (stock UX, quantity caps, render gates).
		$this->assertSame( 4, $product['available_stock'] );
		$this->assertSame( 3, $product['purchase_limit'] );
		$this->assertFalse( $product['archived'] );
		$this->assertTrue( $product['stock_enabled'] );
		$this->assertSame( 2, $product['variants']['data'][0]['available_stock'] );
	}

	/**
	 * The bundle checkout serializes bundle_items.data[*].component_product —
	 * the nested product must be stripped like a top-level one.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_bundle_component_product_is_stripped() {
		$product = ( new PublicCatalogData() )->product( $this->bundleProductFixture() );

		$item = $product['bundle_items']['data'][0];

		$this->assertArrayNotHasKey( 'metadata', $item );
		$this->assertArrayNotHasKey( 'metadata', $item['component_product'] );
		$this->assertArrayNotHasKey( 'sku', $item['component_product'] );
		$this->assertArrayNotHasKey( 'metadata', $item['component_product']['variant_options']['data'][0] );
		$this->assertArrayNotHasKey( 'metadata', $item['component_variants']['data'][0] );
		$this->assertArrayNotHasKey( 'sku', $item['component_variants']['data'][0] );
		$this->assertArrayNotHasKey( 'metadata', $item['component_variant_options']['data'][0] );

		// the picker still renders from these.
		$this->assertSame( 'Component Product', $item['component_product']['name'] );
		$this->assertSame( 'Red', $item['component_variants']['data'][0]['option_1'] );
		$this->assertSame( 7, $item['component_variants']['data'][0]['available_stock'] );
		$this->assertSame( 'Color', $item['component_variant_options']['data'][0]['name'] );

		$this->assertNoPrivateSentinels( $product );
	}

	/**
	 * @group public-catalog-serialization
	 */
	public function test_price_serialization_strips_price_and_expanded_product() {
		$price = ( new PublicCatalogData() )->price(
			[
				'id'           => 'price_123',
				'object'       => 'price',
				'amount'       => 1500,
				'currency'     => 'usd',
				'archived'     => false,
				'metadata'     => [ 'internal_note' => 'price_meta_secret_123' ],
				'archived_at'  => 1700000001,
				'discarded_at' => 1700000002,
				'product'      => $this->privateProductFixture(),
			]
		);

		$this->assertArrayNotHasKey( 'metadata', $price );
		$this->assertArrayNotHasKey( 'archived_at', $price );
		$this->assertArrayNotHasKey( 'metadata', $price['product'] );
		$this->assertSame( 1500, $price['amount'] );
		$this->assertFalse( $price['archived'] );
		$this->assertSame( 'Test Product', $price['product']['name'] );

		$this->assertNoPrivateSentinels( $price );
	}

	/**
	 * @group public-catalog-serialization
	 */
	public function test_variant_serialization_keeps_available_stock() {
		$variant = ( new PublicCatalogData() )->variant(
			[
				'id'              => 'variant_123',
				'object'          => 'variant',
				'option_1'        => 'Small',
				'available_stock' => 2,
				'stock'           => 3,
				'sku'             => 'sk_variant_secret_123',
				'metadata'        => [ 'internal_note' => 'variant_meta_secret_123' ],
			]
		);

		$this->assertArrayNotHasKey( 'sku', $variant );
		$this->assertArrayNotHasKey( 'metadata', $variant );
		$this->assertArrayNotHasKey( 'stock', $variant );
		$this->assertSame( 2, $variant['available_stock'] );
	}

	/**
	 * Null and non-array inputs pass through untouched.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_non_array_input_passes_through() {
		$service = new PublicCatalogData();

		$this->assertNull( $service->product( null ) );
		$this->assertNull( $service->price( null ) );
		$this->assertNull( $service->variant( null ) );
		$this->assertSame( 'price_123', $service->price( 'price_123' ) );
	}

	/**
	 * The REST providers use the trait without preserved fields — the
	 * storefront allowances must not weaken the anonymous REST strip, and
	 * the bundle recursion must apply there too.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_rest_default_still_strips_storefront_fields() {
		$rest_stripper = new class() {
			use \SureCart\Concerns\StripsPrivateCatalogFields;

			/**
			 * Expose the protected strip for the test.
			 *
			 * @param array $product Product data.
			 *
			 * @return array
			 */
			public function strip( $product ) {
				return $this->stripPrivateProductFields( $product );
			}
		};

		$product = $rest_stripper->strip( $this->bundleProductFixture() );

		// no preservation on the REST path.
		$this->assertArrayNotHasKey( 'available_stock', $product );
		$this->assertArrayNotHasKey( 'purchase_limit', $product );
		$this->assertArrayNotHasKey( 'archived', $product );
		$this->assertArrayNotHasKey( 'available_stock', $product['variants']['data'][0] );

		// bundle recursion applies to REST too.
		$item = $product['bundle_items']['data'][0];
		$this->assertArrayNotHasKey( 'metadata', $item['component_product'] );
		$this->assertArrayNotHasKey( 'available_stock', $item['component_variants']['data'][0] );

		$this->assertNoPrivateSentinels( $product );
	}

	/**
	 * The helpers accept full models — the shape every view/block passes.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_helper_strips_product_model() {
		$this->mockDisplayCurrencyRequestsOnly();

		$product = sc_public_product_data( new Product( json_decode( wp_json_encode( $this->bundleProductFixture() ) ) ) );

		$this->assertIsArray( $product );
		$this->assertArrayNotHasKey( 'metadata', $product );
		$this->assertArrayNotHasKey( 'metadata', $product['bundle_items']['data'][0]['component_product'] );
		$this->assertSame( 'Test Product', $product['name'] );
		$this->assertNoPrivateSentinels( $product );
	}

	/**
	 * The product page / upsell page initial state is serialized into
	 * `#sc-store-data` — every catalog object in it must be stripped.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_initial_page_state_is_stripped() {
		$this->mockDisplayCurrencyRequestsOnly();

		$model = new Product( json_decode( wp_json_encode( $this->privateProductFixture() ) ) );
		$state = $model->getInitialPageState();

		$this->assertArrayNotHasKey( 'metadata', $state['product'] );
		$this->assertArrayNotHasKey( 'sku', $state['product'] );
		$this->assertArrayNotHasKey( 'metadata', $state['prices'][0] );
		$this->assertArrayNotHasKey( 'sku', $state['variants'][0] );
		$this->assertArrayNotHasKey( 'metadata', $state['variant_options'][0] );
		$this->assertArrayNotHasKey( 'metadata', $state['selectedPrice'] );
		$this->assertArrayNotHasKey( 'sku', $state['selectedVariant'] );

		// the page still renders from these.
		$this->assertSame( 'Test Product', $state['product']['name'] );
		$this->assertSame( 1500, $state['prices'][0]['amount'] );
		$this->assertSame( 2, $state['variants'][0]['available_stock'] );

		$this->assertNoPrivateSentinels( $state );
	}

	/**
	 * Block boundary: the price choice block serializes a price and its
	 * expanded product into component data on public checkout pages.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_price_choice_block_component_data_is_stripped() {
		$assets = new class() {
			public $captured = [];

			public function addComponentData( $tag, $selector, $data = array() ) {
				$this->captured[] = compact( 'tag', 'selector', 'data' );
			}
		};
		\SureCart::alias(
			'assets',
			function () use ( $assets ) {
				return $assets;
			}
		);

		$price_fixture          = json_decode( wp_json_encode( $this->privateProductFixture()['prices']['data'][0] ) );
		$price_fixture->product = json_decode( wp_json_encode( $this->privateProductFixture() ) );
		$this->mockCatalogRequest( $price_fixture );

		// WordPress merges block.json defaults into attributes at render —
		// mirror the rendered shape (show_price has no ?? fallback in the block).
		$html = ( new \SureCartBlocks\Blocks\PriceChoice\Block() )->render(
			[
				'price_id'     => 'price_123',
				'show_label'   => true,
				'show_price'   => true,
				'show_control' => false,
			],
			''
		);

		$this->assertStringContainsString( 'sc-price-choice', $html );
		$this->assertCount( 1, $assets->captured );

		$data = $assets->captured[0]['data'];
		$this->assertArrayNotHasKey( 'metadata', $data['price'] );
		$this->assertArrayNotHasKey( 'metadata', $data['product'] );
		$this->assertArrayNotHasKey( 'sku', $data['product'] );
		$this->assertSame( 'Test Product', $data['product']['name'] );

		$this->assertNoPrivateSentinels( $data );
	}

	/**
	 * The buy page renders the checkout form block with the full product
	 * model, which lands in the `#sc-store-data` initial state script — a
	 * separate serialization channel from component data. Asserts on the
	 * rendered script itself so a new unrouted seed of this channel fails
	 * here, not in production.
	 *
	 * @group public-catalog-serialization
	 */
	public function test_checkout_form_block_initial_state_channel_is_stripped() {
		$requests = $this->mockDisplayCurrencyRequestsOnly();

		// processors + manual payment methods fetched during form render.
		$requests->shouldReceive( 'makeRequest' )
			->zeroOrMoreTimes()
			->andReturn( (object) [ 'data' => [] ] );

		// the form view renderer — html output is not under test.
		\SureCart::alias(
			'block',
			function () {
				return new class() {
					public function render( $view, $data = [] ) {
						return '';
					}
				};
			}
		);

		( new \SureCartBlocks\Blocks\Form\Block() )->render(
			[
				'product'     => new Product( json_decode( wp_json_encode( $this->bundleProductFixture() ) ) ),
				'mode'        => 'live',
				'success_url' => '',
			],
			''
		);

		// the exact payload StateService::render serializes into the page.
		ob_start();
		\SureCart::state()->render();
		$html = ob_get_clean();

		preg_match( '/<script id="sc-store-data" type="application\/json">(.*)<\/script>/s', $html, $matches );
		$state = json_decode( $matches[1] ?? '', true );

		$product = $state['checkout']['product'] ?? null;
		$this->assertNotEmpty( $product );
		$this->assertSame( 'prod_123', $product['id'] );

		$this->assertArrayNotHasKey( 'metadata', $product );
		$this->assertArrayNotHasKey( 'sku', $product );
		$this->assertArrayNotHasKey( 'commission_structure', $product );

		$item = $product['bundle_items']['data'][0];
		$this->assertArrayNotHasKey( 'metadata', $item );
		$this->assertArrayNotHasKey( 'metadata', $item['component_product'] );
		$this->assertArrayNotHasKey( 'sku', $item['component_product'] );
		$this->assertArrayNotHasKey( 'metadata', $item['component_product']['variant_options']['data'][0] );
		$this->assertArrayNotHasKey( 'sku', $item['component_variants']['data'][0] );
		$this->assertArrayNotHasKey( 'metadata', $item['component_variant_options']['data'][0] );

		$this->assertNoPrivateSentinels( $state );
	}
}
