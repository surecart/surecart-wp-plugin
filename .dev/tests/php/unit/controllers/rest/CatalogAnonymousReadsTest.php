<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Request\RequestService;
use SureCart\Tests\MocksRequestService;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

/**
 * SUR-5503: anonymous catalog REST endpoints must not over-expose private
 * platform data (stock, skus, metadata, offer internals, customer PII).
 *
 * Covers the RestrictsAnonymousReads controller trait (forced query scope,
 * expand allow-list, find hiding), the StripsPrivateCatalogFields provider
 * trait (expanded sub-objects and accessor copies) and the per-item index
 * filtering in RestServiceProvider::callback().
 */
class CatalogAnonymousReadsTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	use MocksRequestService;

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
					\SureCart\Rest\ProductsRestServiceProvider::class,
					\SureCart\Rest\PriceRestServiceProvider::class,
					\SureCart\Rest\VariantsRestServiceProvider::class,
					\SureCart\Rest\BumpRestServiceProvider::class,
					\SureCart\Rest\UpsellRestServiceProvider::class,
					\SureCart\Rest\BrandRestServiceProvider::class,
				],
			],
			false
		);

		$this->registerCatalogServiceFakes();

		parent::setUp();
	}

	/**
	 * Alias lightweight fakes for the services product serialization touches,
	 * so full REST dispatch works without bootstrapping heavy providers.
	 *
	 * @return void
	 */
	private function registerCatalogServiceFakes() {
		// account currency + review protocol reads during serialization.
		\SureCart::alias(
			'account',
			function () {
				return (object) [
					'currency'        => 'usd',
					'review_protocol' => (object) [ 'reviews_enabled' => false ],
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
	}

	/**
	 * Mock the platform request and capture the args of the catalog call.
	 *
	 * Amount-formatting accessors fetch display currencies during
	 * serialization — those calls are tolerated, not captured.
	 *
	 * @param mixed $return   Value to return for the catalog request.
	 * @param array $captured Reference filled with the catalog request args.
	 *
	 * @return void
	 */
	private function mockCatalogRequest( $return, &$captured ) {
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

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->andReturnUsing(
				function ( ...$args ) use ( $return, &$captured ) {
					$captured = $args;
					return $return;
				}
			);
	}

	/**
	 * Log in a fresh user holding the given capability.
	 *
	 * @param string $cap Capability to grant.
	 *
	 * @return void
	 */
	private function actAsEditor( $cap ) {
		$user = self::factory()->user->create_and_get();
		$user->add_cap( $cap );
		wp_set_current_user( $user->ID );
	}

	/**
	 * Dispatch a request through the REST server.
	 *
	 * @param string $method HTTP method.
	 * @param string $path   Route path.
	 * @param array  $query  Query params.
	 *
	 * @return \WP_REST_Response
	 */
	private function dispatch( $method, $path, $query = [] ) {
		$request = new WP_REST_Request( $method, $path );
		if ( ! empty( $query ) ) {
			$request->set_query_params( $query );
		}
		return rest_do_request( $request );
	}

	/**
	 * An empty platform list response.
	 *
	 * @return object
	 */
	private function emptyListFixture() {
		return (object) [
			'data'       => [],
			'pagination' => (object) [
				'count' => 0,
				'limit' => 20,
			],
		];
	}

	/**
	 * A product carrying every private field and expansion under test.
	 *
	 * @return object
	 */
	private function privateProductFixture() {
		return (object) [
			'id'                       => 'prod_123',
			'object'                   => 'product',
			'name'                     => 'Test Product',
			'slug'                     => 'test-product',
			'status'                   => 'published',
			'archived'                 => false,
			'sku'                      => 'sk_product_secret_123',
			'stock_enabled'            => false,
			'stock'                    => 5,
			'available_stock'          => 4,
			'held_stock'               => 1,
			'tax_category'             => 'digital_goods',
			'tax_enabled'              => true,
			'purchase_limit'           => 3,
			'cataloged_at'             => 1700000000,
			'dimensions'               => (object) [
				'length' => 10,
				'width'  => 5,
				'height' => 2,
			],
			'weight'                   => 1.5,
			'weight_unit'              => 'kg',
			'metadata'                 => (object) [
				'internal_note' => 'product_meta_secret_123',
				'wp_created_by' => 5,
			],
			'metrics'                  => (object) [
				'currency'         => 'usd',
				'min_price_amount' => 1500,
				'max_price_amount' => 1500,
				'prices_count'     => 1,
			],
			'commission_structure'     => (object) [
				'id'     => 'comm_secret_123',
				'object' => 'commission_structure',
			],
			'downloads'                => (object) [
				'data' => [
					(object) [
						'id'  => 'dl_1',
						'url' => 'https://example.com/files/secret-download.zip',
					],
				],
			],
			'current_release_download' => (object) [ 'id' => 'rel_dl_secret_123' ],
			'files'                    => (object) [
				'data' => [ (object) [ 'id' => 'file_secret_123' ] ],
			],
			'shipping_profile'         => (object) [ 'id' => 'sp_secret_123' ],
			'variants'                 => (object) [
				'data' => [
					(object) [
						'id'              => 'variant_123',
						'object'          => 'variant',
						'option_1'        => 'Small',
						'amount'          => 1500,
						'currency'        => 'usd',
						'sku'             => 'sk_variant_secret_123',
						'stock'           => 3,
						'available_stock' => 2,
						'held_stock'      => 1,
						'metadata'        => (object) [ 'internal_note' => 'variant_meta_secret_123' ],
						'dimensions'      => (object) [ 'length' => 1 ],
						'weight'          => 0.5,
						'weight_unit'     => 'kg',
					],
				],
			],
			'prices'                   => (object) [
				'data' => [
					(object) [
						'id'             => 'price_123',
						'object'         => 'price',
						'amount'         => 1500,
						'currency'       => 'usd',
						'archived'       => false,
						'position'       => 1,
						'scratch_amount' => 2000,
						'metadata'       => (object) [ 'internal_note' => 'price_meta_secret_123' ],
						'archived_at'    => 1700000001,
						'discarded_at'   => 1700000002,
					],
				],
			],
			'reviews'                  => (object) [
				'data' => [
					(object) [
						'id'       => 'review_123',
						'object'   => 'product_review',
						'rating'   => 5,
						'customer' => (object) [
							'id'    => 'cust_123',
							'email' => 'private.reviewer@example.com',
						],
						'purchase' => (object) [ 'id' => 'purch_private_123' ],
					],
				],
			],
			'product_medias'           => (object) [
				'data' => [
					(object) [
						'id'     => 'product_media_123',
						'object' => 'product_media',
						'media'  => (object) [
							'id'     => 'media_123',
							'object' => 'media',
							'url'    => 'https://example.com/images/public-image.jpg',
							'width'  => 800,
							'height' => 600,
						],
					],
				],
			],
			'product_collections'      => (object) [
				'data' => [
					(object) [
						'id'          => 'pcol_123',
						'object'      => 'product_collection',
						'name'        => 'Public Collection',
						'slug'        => 'public-collection',
						'metadata'    => (object) [ 'internal_note' => 'collection_meta_secret_123' ],
						'archived_at' => 1700000004,
					],
				],
			],
		];
	}

	/**
	 * Sentinel values that must never appear in an anonymous product payload.
	 *
	 * @return array
	 */
	private function privateProductSentinels() {
		return [
			'sk_product_secret_123',
			'sk_variant_secret_123',
			'product_meta_secret_123',
			'variant_meta_secret_123',
			'price_meta_secret_123',
			'private.reviewer@example.com',
			'purch_private_123',
			'collection_meta_secret_123',
			'comm_secret_123',
			'secret-download.zip',
			'sp_secret_123',
			'file_secret_123',
			'rel_dl_secret_123',
		];
	}

	/**
	 * A price carrying private fields plus an expanded archived-but-published
	 * product (a grandfathered plan on a customer dashboard).
	 *
	 * @return object
	 */
	private function privatePriceFixture() {
		return (object) [
			'id'             => 'price_123',
			'object'         => 'price',
			'amount'         => 1500,
			'currency'       => 'usd',
			'scratch_amount' => 2000,
			'archived'       => false,
			'position'       => 1,
			'metadata'       => (object) [ 'internal_note' => 'price_meta_secret_123' ],
			'archived_at'    => 1700000001,
			'discarded_at'   => 1700000002,
			'product'        => (object) [
				'id'                   => 'prod_123',
				'object'               => 'product',
				'name'                 => 'Test Product',
				'sku'                  => 'sk_product_secret_123',
				'status'               => 'published',
				'archived'             => true,
				'metadata'             => (object) [ 'internal_note' => 'product_meta_secret_123' ],
				'commission_structure' => (object) [ 'id' => 'comm_secret_123' ],
			],
		];
	}

	/**
	 * A price whose expanded product is an unreleased draft.
	 *
	 * @return object
	 */
	private function draftProductPriceFixture() {
		return (object) [
			'id'       => 'price_draft_123',
			'object'   => 'price',
			'amount'   => 1500,
			'currency' => 'usd',
			'archived' => false,
			'product'  => (object) [
				'id'          => 'prod_draft_123',
				'object'      => 'product',
				'status'      => 'draft',
				'name'        => 'draft_name_secret_123',
				'description' => 'draft_description_secret_123',
				'slug'        => 'draft-slug-secret-123',
				'sku'         => 'sk_product_secret_123',
				'metadata'    => (object) [ 'internal_note' => 'product_meta_secret_123' ],
			],
		];
	}

	/**
	 * A variant carrying private stock and sku fields.
	 *
	 * @return object
	 */
	private function privateVariantFixture() {
		return (object) [
			'id'              => 'variant_123',
			'object'          => 'variant',
			'option_1'        => 'Small',
			'option_2'        => 'Red',
			'amount'          => 1500,
			'currency'        => 'usd',
			'position'        => 1,
			'sku'             => 'sk_variant_secret_123',
			'stock'           => 3,
			'available_stock' => 2,
			'held_stock'      => 1,
			'metadata'        => (object) [ 'internal_note' => 'variant_meta_secret_123' ],
			'dimensions'      => (object) [ 'length' => 1 ],
			'weight'          => 0.5,
			'weight_unit'     => 'kg',
		];
	}

	/**
	 * A bump carrying private offer internals.
	 *
	 * @return object
	 */
	private function privateBumpFixture() {
		return (object) [
			'id'                       => 'bump_123',
			'object'                   => 'bump',
			'name'                     => 'Test Bump',
			'enabled'                  => true,
			'auto_apply'               => true,
			'archived'                 => false,
			'archived_at'              => 1700000003,
			'currency'                 => 'usd',
			'amount_off'               => 500,
			'percent_off'              => 10,
			'priority'                 => 2,
			'filters'                  => 'price_ids:price_secret_filter_123',
			'filter_price_ids'         => [ 'price_secret_filter_123' ],
			'filter_product_ids'       => [ 'prod_secret_filter_123' ],
			'filter_product_group_ids' => [ 'group_secret_filter_123' ],
			'filter_match_type'        => 'match_type_secret_123',
			'metadata'                 => (object) [ 'internal_note' => 'bump_meta_secret_123' ],
			'price'                    => 'price_123',
		];
	}

	/**
	 * An upsell carrying private offer internals.
	 *
	 * @return object
	 */
	private function privateUpsellFixture() {
		return (object) [
			'id'                          => 'upsell_123',
			'object'                      => 'upsell',
			'fee_description'             => 'Test Upsell',
			'step'                        => 'initial',
			'duplicate_purchase_behavior' => 'allow',
			'currency'                    => 'usd',
			'amount_off'                  => 500,
			'percent_off'                 => 10,
			'priority'                    => 2,
			'replacement_behavior'        => 'replacement_secret_123',
			'filter_price_ids'            => [ 'price_secret_filter_123' ],
			'filter_product_ids'          => [ 'prod_secret_filter_123' ],
			'filter_product_group_ids'    => [ 'group_secret_filter_123' ],
			'filter_match_type'           => 'match_type_secret_123',
			'metadata'                    => (object) [ 'internal_note' => 'upsell_meta_secret_123' ],
			'price'                       => 'price_123',
		];
	}

	/**
	 * A brand carrying private contact details.
	 *
	 * @return object
	 */
	private function privateBrandFixture() {
		return (object) [
			'id'         => 'brand_123',
			'object'     => 'brand',
			'color'      => '#123456',
			'website'    => 'https://example.com',
			'email'      => 'brand-private@example.com',
			'phone'      => '+15555550100',
			'address'    => (object) [ 'line_1' => '123 Private St' ],
			'logo'       => 'media_123',
			'created_at' => 1700000000,
			'updated_at' => 1700000001,
		];
	}

	/**
	 * Anonymous index forces the published + not-archived scope onto the
	 * platform query, even when the client sends its own filter values.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_product_index_forces_published_not_archived_scope() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->emptyListFixture(), $captured );

		$response = $this->dispatch(
			'GET',
			'/surecart/v1/products',
			[
				'archived' => false,
				'status'   => [ 'draft' ],
			]
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'products', $captured[0] );
		$this->assertFalse( $captured[1]['query']['archived'] );
		$this->assertSame( [ 'published' ], $captured[1]['query']['status'] );
	}

	/**
	 * Anonymous callers asking for archived products are rejected before the
	 * platform is ever contacted.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_product_index_with_archived_param_is_rejected() {
		wp_set_current_user( 0 );
		$this->mockRequestNeverCalled();

		$response = $this->dispatch( 'GET', '/surecart/v1/products', [ 'archived' => 'true' ] );

		$this->assertSame( 401, $response->get_status() );
	}

	/**
	 * Anonymous expand values are reduced to the allow-list before being
	 * forwarded to the platform.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_product_index_strips_disallowed_expands() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->emptyListFixture(), $captured );

		$response = $this->dispatch(
			'GET',
			'/surecart/v1/products',
			[ 'expand' => [ 'commission_structure', 'downloads', 'prices' ] ]
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( [ 'prices' ], $captured[1]['query']['expand'] );
	}

	/**
	 * Callers with the edit capability keep their expands and get no forced
	 * scope injected into the platform query.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_editor_product_index_keeps_expands_and_scope() {
		$this->actAsEditor( 'edit_sc_products' );
		$this->mockCatalogRequest( $this->emptyListFixture(), $captured );

		$response = $this->dispatch(
			'GET',
			'/surecart/v1/products',
			[ 'expand' => [ 'commission_structure', 'downloads', 'prices' ] ]
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( [ 'commission_structure', 'downloads', 'prices' ], $captured[1]['query']['expand'] );
		$this->assertArrayNotHasKey( 'archived', $captured[1]['query'] );
		$this->assertArrayNotHasKey( 'status', $captured[1]['query'] );
	}

	/**
	 * Anonymous find of an archived-but-published product is deliberately
	 * NOT hidden — grandfathered subscriptions fetch their product by id
	 * when switching plans on the customer dashboard. Archived products
	 * stay out of listings via the forced index scope.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_product_find_returns_archived_published_product() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest(
			(object) [
				'id'       => 'prod_arch_123',
				'object'   => 'product',
				'name'     => 'Archived Product',
				'archived' => true,
				'status'   => 'published',
			],
			$captured
		);

		$response = $this->dispatch( 'GET', '/surecart/v1/products/prod_arch_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'prod_arch_123', $data['id'] );
		// the archived state itself stays edit-only.
		$this->assertArrayNotHasKey( 'archived', $data );
		$this->assertArrayNotHasKey( 'status', $data );
	}

	/**
	 * Anonymous find of a draft product returns a 404.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_product_find_hides_draft_product() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest(
			(object) [
				'id'       => 'prod_draft_123',
				'object'   => 'product',
				'name'     => 'Draft Product',
				'archived' => false,
				'status'   => 'draft',
			],
			$captured
		);

		$response = $this->dispatch( 'GET', '/surecart/v1/products/prod_draft_123' );

		$this->assertSame( 404, $response->get_status() );
		$this->assertSame( 'rest_not_found', $response->get_data()['code'] );
	}

	/**
	 * Callers with the edit capability can still find archived products.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_editor_product_find_returns_archived_product() {
		$this->actAsEditor( 'edit_sc_products' );
		$this->mockCatalogRequest(
			(object) [
				'id'       => 'prod_arch_123',
				'object'   => 'product',
				'name'     => 'Archived Product',
				'archived' => true,
				'status'   => 'published',
			],
			$captured
		);

		$response = $this->dispatch( 'GET', '/surecart/v1/products/prod_arch_123' );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'prod_arch_123', $response->get_data()['id'] );
	}

	/**
	 * Anonymous single-product responses drop every private field — top
	 * level, expanded sub-objects and accessor-derived copies — while
	 * keeping public storefront data.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_product_find_strips_private_fields() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->privateProductFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/products/prod_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );

		$private_keys = [
			'sku',
			'status',
			'archived',
			'cataloged_at',
			'stock',
			'available_stock',
			'held_stock',
			'metadata',
			'dimensions',
			'weight',
			'weight_unit',
			'tax_category',
			'tax_enabled',
			'purchase_limit',
			'commission_structure',
			'downloads',
			'current_release_download',
			'files',
			'shipping_profile',
		];
		foreach ( $private_keys as $key ) {
			$this->assertArrayNotHasKey( $key, $data, "Anonymous product response should not include {$key}." );
		}

		// public storefront data stays.
		$this->assertSame( 'Test Product', $data['name'] );
		$this->assertSame( 'test-product', $data['slug'] );
		$this->assertSame( 1500, $data['metrics']['min_price_amount'] );
		$this->assertSame( 1500, $data['prices']['data'][0]['amount'] );
		$this->assertSame( 2000, $data['prices']['data'][0]['scratch_amount'] );
		$this->assertSame( 'https://example.com/images/public-image.jpg', $data['product_medias']['data'][0]['media']['url'] );

		// expanded collections keep their public fields, minus internals.
		$this->assertSame( 'pcol_123', $data['product_collections']['data'][0]['id'] );
		$this->assertSame( 'Public Collection', $data['product_collections']['data'][0]['name'] );
		$this->assertArrayNotHasKey( 'metadata', $data['product_collections']['data'][0] );
		$this->assertArrayNotHasKey( 'archived_at', $data['product_collections']['data'][0] );

		// nothing private leaks anywhere in the payload, including accessor copies.
		$body = wp_json_encode( $data );
		foreach ( $this->privateProductSentinels() as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous product response leaked {$sentinel}." );
		}
	}

	/**
	 * Anonymous index responses get the same per-item stripping (the list
	 * filtering path in RestServiceProvider::callback) and keep pagination
	 * headers intact.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_product_index_strips_private_fields_and_keeps_headers() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest(
			(object) [
				'data'       => [ $this->privateProductFixture() ],
				'pagination' => (object) [
					'count' => 1,
					'limit' => 20,
				],
			],
			$captured
		);

		$response = $this->dispatch( 'GET', '/surecart/v1/products' );
		$items    = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertCount( 1, $items );
		$this->assertEquals( 1, $response->get_headers()['X-WP-Total'] );
		$this->assertEquals( 1, $response->get_headers()['X-WP-TotalPages'] );

		foreach ( [ 'sku', 'status', 'stock', 'metadata', 'commission_structure', 'downloads' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $items[0], "Anonymous product list item should not include {$key}." );
		}
		$this->assertSame( 'Test Product', $items[0]['name'] );

		$body = wp_json_encode( $items );
		foreach ( $this->privateProductSentinels() as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous product list leaked {$sentinel}." );
		}
	}

	/**
	 * List-item context filtering is opt-in — non-catalog providers with
	 * pre-existing edit-only schema declarations keep their untouched
	 * view-context list responses.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_list_item_filtering_defaults_off() {
		$defaults = ( new \ReflectionClass( \SureCart\Rest\RestServiceProvider::class ) )->getDefaultProperties();

		$this->assertFalse( $defaults['filters_list_items'] );
	}

	/**
	 * Edit context with the edit capability keeps private fields, so the
	 * admin UI is unaffected by the hardening.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_editor_product_find_in_edit_context_keeps_private_fields() {
		$this->actAsEditor( 'edit_sc_products' );
		$this->mockCatalogRequest( $this->privateProductFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/products/prod_123', [ 'context' => 'edit' ] );
		// edit context skips the strippers, so nested values stay stdClass — normalize to arrays.
		$data = json_decode( wp_json_encode( $response->get_data() ), true );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'sk_product_secret_123', $data['sku'] );
		$this->assertSame( 'published', $data['status'] );
		$this->assertSame( 5, $data['stock'] );
		$this->assertSame( 'product_meta_secret_123', $data['metadata']['internal_note'] );
		// edit context pulls variants out of the data wrapper and keeps sku.
		$this->assertSame( 'sk_variant_secret_123', $data['variants'][0]['sku'] );
	}

	/**
	 * Anonymous price index forces the not-archived scope and reduces
	 * expands to the allow-list.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_price_index_forces_unarchived_scope_and_allowed_expands() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->emptyListFixture(), $captured );

		$response = $this->dispatch(
			'GET',
			'/surecart/v1/prices',
			[ 'expand' => [ 'product', 'downloads' ] ]
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'prices', $captured[0] );
		$this->assertFalse( $captured[1]['query']['archived'] );
		$this->assertSame( [ 'product' ], $captured[1]['query']['expand'] );
	}

	/**
	 * Anonymous price responses drop metadata and archive timestamps but
	 * keep scratch_amount and amounts, and the expanded product is run
	 * through the nested product stripper.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_price_response_strips_private_fields_keeps_scratch_amount() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->privatePriceFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/prices/price_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );

		foreach ( [ 'metadata', 'archived_at', 'discarded_at' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $data, "Anonymous price response should not include {$key}." );
		}

		$this->assertSame( 1500, $data['amount'] );
		$this->assertSame( 'usd', $data['currency'] );
		$this->assertSame( 2000, $data['scratch_amount'] );

		// the expanded archived-but-published product keeps its name (grandfathered
		// plans render it on customer dashboards), minus its private fields.
		$this->assertSame( 'Test Product', $data['product']['name'] );
		foreach ( [ 'metadata', 'commission_structure', 'sku', 'status', 'archived' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $data['product'], "Expanded product on price should not include {$key}." );
		}

		$body = wp_json_encode( $data );
		foreach ( [ 'price_meta_secret_123', 'product_meta_secret_123', 'comm_secret_123', 'sk_product_secret_123' ] as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous price response leaked {$sentinel}." );
		}
	}

	/**
	 * A draft product expanded on a price collapses to its id, so unreleased
	 * product content is not reachable one endpoint over.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_price_response_collapses_draft_expanded_product() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->draftProductPriceFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/prices/price_draft_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertIsString( $data['product'] );
		$this->assertSame( 'prod_draft_123', $data['product'] );

		$body = wp_json_encode( $data );
		foreach ( [ 'draft_name_secret_123', 'draft_description_secret_123', 'draft-slug-secret-123', 'sk_product_secret_123', 'product_meta_secret_123' ] as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous price response leaked draft product content: {$sentinel}." );
		}
	}

	/**
	 * Anonymous find of an archived price is deliberately NOT hidden —
	 * customer dashboards read grandfathered subscription plans.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_find_of_archived_price_is_not_hidden() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest(
			(object) [
				'id'       => 'price_arch_123',
				'object'   => 'price',
				'amount'   => 1000,
				'currency' => 'usd',
				'archived' => true,
			],
			$captured
		);

		$response = $this->dispatch( 'GET', '/surecart/v1/prices/price_arch_123' );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'price_arch_123', $response->get_data()['id'] );
	}

	/**
	 * Anonymous variant responses drop stock, sku and shipping internals
	 * but keep options and amount.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_variant_response_strips_stock_and_sku() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->privateVariantFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/variants/variant_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );

		foreach ( [ 'sku', 'stock', 'available_stock', 'held_stock', 'metadata', 'dimensions', 'weight', 'weight_unit' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $data, "Anonymous variant response should not include {$key}." );
		}

		$this->assertSame( 'Small', $data['option_1'] );
		$this->assertSame( 'Red', $data['option_2'] );
		$this->assertSame( 1500, $data['amount'] );

		$body = wp_json_encode( $data );
		foreach ( [ 'sk_variant_secret_123', 'variant_meta_secret_123' ] as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous variant response leaked {$sentinel}." );
		}
	}

	/**
	 * Anonymous bump index forces the not-archived scope onto the platform
	 * query.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_bump_index_forces_unarchived_scope() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->emptyListFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/bumps', [ 'enabled' => true ] );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'bumps', $captured[0] );
		$this->assertFalse( $captured[1]['query']['archived'] );
	}

	/**
	 * Anonymous bump responses drop the offer internals (discount amounts,
	 * priority, filters, metadata) but keep the customer-facing fields.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_bump_response_strips_offer_internals() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->privateBumpFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/bumps/bump_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );

		foreach ( [ 'amount_off', 'percent_off', 'priority', 'filters', 'filter_price_ids', 'filter_product_ids', 'filter_product_group_ids', 'filter_match_type', 'auto_apply', 'archived', 'archived_at', 'metadata' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $data, "Anonymous bump response should not include {$key}." );
		}

		$this->assertSame( 'Test Bump', $data['name'] );
		$this->assertTrue( $data['enabled'] );
		$this->assertSame( 'price_123', $data['price'] );

		$body = wp_json_encode( $data );
		foreach ( [ 'price_secret_filter_123', 'prod_secret_filter_123', 'group_secret_filter_123', 'match_type_secret_123', 'bump_meta_secret_123' ] as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous bump response leaked {$sentinel}." );
		}
	}

	/**
	 * Edit context with the edit capability keeps the bump offer internals.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_editor_bump_response_in_edit_context_keeps_offer_internals() {
		$this->actAsEditor( 'edit_sc_prices' );
		$this->mockCatalogRequest( $this->privateBumpFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/bumps/bump_123', [ 'context' => 'edit' ] );
		// edit context skips the strippers, so nested values stay stdClass — normalize to arrays.
		$data = json_decode( wp_json_encode( $response->get_data() ), true );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 500, $data['amount_off'] );
		$this->assertSame( 10, $data['percent_off'] );
		$this->assertSame( 2, $data['priority'] );
		$this->assertSame( [ 'price_secret_filter_123' ], $data['filter_price_ids'] );
		$this->assertSame( [ 'group_secret_filter_123' ], $data['filter_product_group_ids'] );
		$this->assertSame( 'match_type_secret_123', $data['filter_match_type'] );
		$this->assertSame( 'bump_meta_secret_123', $data['metadata']['internal_note'] );
	}

	/**
	 * Anonymous upsell responses drop the offer internals (discount amounts,
	 * priority, filters, metadata) but keep the customer-facing fields.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_upsell_response_strips_offer_internals() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->privateUpsellFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/upsells/upsell_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );

		foreach ( [ 'amount_off', 'percent_off', 'priority', 'replacement_behavior', 'filter_price_ids', 'filter_product_ids', 'filter_product_group_ids', 'filter_match_type', 'metadata' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $data, "Anonymous upsell response should not include {$key}." );
		}

		$this->assertSame( 'Test Upsell', $data['fee_description'] );
		$this->assertSame( 'initial', $data['step'] );
		$this->assertSame( 'price_123', $data['price'] );

		$body = wp_json_encode( $data );
		foreach ( [ 'price_secret_filter_123', 'prod_secret_filter_123', 'group_secret_filter_123', 'match_type_secret_123', 'replacement_secret_123', 'upsell_meta_secret_123' ] as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous upsell response leaked {$sentinel}." );
		}
	}

	/**
	 * Anonymous brand responses drop the contact details but keep the
	 * public branding fields.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_brand_response_strips_contact_details() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->privateBrandFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/brand' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'brand', $captured[0] );

		foreach ( [ 'email', 'phone', 'address', 'created_at', 'updated_at' ] as $key ) {
			$this->assertArrayNotHasKey( $key, $data, "Anonymous brand response should not include {$key}." );
		}

		$this->assertSame( 'brand_123', $data['id'] );
		$this->assertSame( '#123456', $data['color'] );
		$this->assertSame( 'https://example.com', $data['website'] );

		$body = wp_json_encode( $data );
		foreach ( [ 'brand-private@example.com', '+15555550100', '123 Private St' ] as $sentinel ) {
			$this->assertStringNotContainsString( $sentinel, $body, "Anonymous brand response leaked {$sentinel}." );
		}
	}

	/**
	 * Anonymous callers cannot list prices in edit context.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_price_edit_context_is_rejected() {
		wp_set_current_user( 0 );
		$this->mockRequestNeverCalled();

		$response = $this->dispatch( 'GET', '/surecart/v1/prices', [ 'context' => 'edit' ] );

		$this->assertSame( 401, $response->get_status() );
		$this->assertSame( 'rest_forbidden_context', $response->get_data()['code'] );
	}

	/**
	 * Anonymous callers cannot list bumps in edit context.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_bump_edit_context_is_rejected() {
		wp_set_current_user( 0 );
		$this->mockRequestNeverCalled();

		$response = $this->dispatch( 'GET', '/surecart/v1/bumps', [ 'context' => 'edit' ] );

		$this->assertSame( 401, $response->get_status() );
		$this->assertSame( 'rest_forbidden_context', $response->get_data()['code'] );
	}

	/**
	 * Anonymous callers cannot request a variant in edit context.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_variant_edit_context_is_rejected() {
		wp_set_current_user( 0 );
		$this->mockRequestNeverCalled();

		$response = $this->dispatch( 'GET', '/surecart/v1/variants/variant_123', [ 'context' => 'edit' ] );

		$this->assertSame( 401, $response->get_status() );
		$this->assertSame( 'rest_forbidden_context', $response->get_data()['code'] );
	}

	/**
	 * Edit context with the edit capability skips the per-item list
	 * filtering, so admin list screens keep the private fields.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_editor_price_index_in_edit_context_keeps_list_items_unstripped() {
		$this->actAsEditor( 'edit_sc_prices' );
		$this->mockCatalogRequest(
			(object) [
				'data'       => [ $this->privatePriceFixture() ],
				'pagination' => (object) [
					'count' => 1,
					'limit' => 20,
				],
			],
			$captured
		);

		$response = $this->dispatch( 'GET', '/surecart/v1/prices', [ 'context' => 'edit' ] );
		// edit context skips the list filtering, so items stay models — normalize to arrays.
		$items = json_decode( wp_json_encode( $response->get_data() ), true );

		$this->assertSame( 200, $response->get_status() );
		$this->assertCount( 1, $items );
		$this->assertSame( 'price_meta_secret_123', $items[0]['metadata']['internal_note'] );
		$this->assertSame( 1700000001, $items[0]['archived_at'] );
		$this->assertSame( 'sk_product_secret_123', $items[0]['product']['sku'] );
	}

	/**
	 * A missing status on the expanded product counts as published — the
	 * product is stripped, not collapsed to its id.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_price_response_treats_missing_product_status_as_published() {
		wp_set_current_user( 0 );
		$fixture = $this->privatePriceFixture();
		unset( $fixture->product->status );
		$this->mockCatalogRequest( $fixture, $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/prices/price_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertIsArray( $data['product'] );
		$this->assertSame( 'Test Product', $data['product']['name'] );
		$this->assertArrayNotHasKey( 'sku', $data['product'] );
		$this->assertArrayNotHasKey( 'metadata', $data['product'] );
	}

	/**
	 * A draft expanded product without an id is unset entirely, keeping the
	 * product key two-shaped (id string or object) — never null.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_price_response_unsets_draft_expanded_product_without_id() {
		wp_set_current_user( 0 );
		$fixture = $this->draftProductPriceFixture();
		unset( $fixture->product->id );
		$this->mockCatalogRequest( $fixture, $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/prices/price_draft_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertArrayNotHasKey( 'product', $data );
	}

	/**
	 * The anonymous expand allow-list is filterable, so integrations can
	 * deliberately widen it per resource.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_expands_filter_can_widen_allow_list() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->emptyListFixture(), $captured );

		add_filter(
			'surecart/rest/anonymous_expands',
			function ( $expands, $class ) {
				if ( $class instanceof \SureCart\Models\Product ) {
					$expands[] = 'downloads';
				}
				return $expands;
			},
			10,
			2
		);

		$response = $this->dispatch(
			'GET',
			'/surecart/v1/products',
			[ 'expand' => [ 'downloads', 'commission_structure' ] ]
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( [ 'downloads' ], $captured[1]['query']['expand'] );
	}

	/**
	 * The private field strip lists are filterable per object type.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_private_catalog_fields_filter_can_strip_more_fields() {
		wp_set_current_user( 0 );
		$this->mockCatalogRequest( $this->privateProductFixture(), $captured );

		add_filter(
			'surecart/rest/private_catalog_fields',
			function ( $fields, $type ) {
				if ( 'product' === $type ) {
					$fields[] = 'slug';
				}
				return $fields;
			},
			10,
			2
		);

		$response = $this->dispatch( 'GET', '/surecart/v1/products/prod_123' );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertArrayNotHasKey( 'slug', $data );
		$this->assertSame( 'Test Product', $data['name'] );
	}

	/**
	 * Anonymous callers cannot request the brand in edit context.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_anonymous_brand_edit_context_is_rejected() {
		wp_set_current_user( 0 );
		$this->mockRequestNeverCalled();

		$response = $this->dispatch( 'GET', '/surecart/v1/brand', [ 'context' => 'edit' ] );

		$this->assertSame( 401, $response->get_status() );
	}

	/**
	 * Block-editor users (edit_posts, no manage_options) can read the brand
	 * in edit context — the store logo block previews it in the post editor.
	 *
	 * @group rest-catalog-hardening
	 */
	public function test_block_editor_user_can_read_brand_in_edit_context() {
		$this->actAsEditor( 'edit_posts' );
		$this->mockCatalogRequest( $this->privateBrandFixture(), $captured );

		$response = $this->dispatch( 'GET', '/surecart/v1/brand', [ 'context' => 'edit' ] );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'brand_123', $data['id'] );
		$this->assertSame( 'media_123', $data['logo'] );
		$this->assertSame( '#123456', $data['color'] );
	}
}
