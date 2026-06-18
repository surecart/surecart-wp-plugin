<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\ProductsController;
use SureCart\Models\Product;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class ProductsControllerTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap( [ 'providers' => [] ], false );
		parent::setUp();
	}

	/**
	 * Run the controller middleware against a fresh Product model.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return \SureCart\Models\Product
	 */
	protected function runMiddleware( WP_REST_Request $request ) {
		$controller = \Mockery::mock( ProductsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		return $controller->middleware( new Product(), $request );
	}

	/**
	 * Without `expand_mode=replace`, a client `expand` augments the forced set
	 * (additive) rather than replacing it.
	 *
	 * @group products-rest
	 */
	public function test_collection_get_with_client_expand_merges_by_default() {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/products' );
		$request->set_param( 'context', 'edit' );
		$request->set_param( 'expand', [ 'shipping_profile' ] );

		$model = $this->runMiddleware( $request );

		$this->assertEqualsCanonicalizing(
			array_merge( ProductsController::EDIT_EXPANDS, [ 'shipping_profile' ] ),
			$model->getQuery()['expand']
		);
	}

	/**
	 * `expand_mode=replace` opts a collection GET out of the forced set: the
	 * client's `expand` is used verbatim. This is how the products dataview
	 * requests a lean list.
	 *
	 * @group products-rest
	 */
	public function test_collection_get_with_replace_mode_uses_client_expand_verbatim() {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/products' );
		$request->set_param( 'context', 'edit' );
		$request->set_param( 'expand_mode', 'replace' );
		$request->set_param( 'expand', [ 'variant_options', 'product_medias' ] );

		$model = $this->runMiddleware( $request );

		$this->assertEqualsCanonicalizing(
			[ 'variant_options', 'product_medias' ],
			$model->getQuery()['expand']
		);
	}

	/**
	 * `expand_mode=replace` with an empty expand yields a truly lean request
	 * (no relations) — it does not flip back to the forced set.
	 *
	 * @group products-rest
	 */
	public function test_collection_get_with_replace_mode_and_empty_expand_is_lean() {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/products' );
		$request->set_param( 'context', 'edit' );
		$request->set_param( 'expand_mode', 'replace' );

		$model = $this->runMiddleware( $request );

		$this->assertSame( [], $model->getQuery()['expand'] );
	}

	/**
	 * Legacy collection GETs without expand keep the full forced set.
	 *
	 * @group products-rest
	 */
	public function test_collection_get_without_expand_gets_forced_expands() {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/products' );
		$request->set_param( 'context', 'edit' );

		$model = $this->runMiddleware( $request );

		$this->assertEqualsCanonicalizing( ProductsController::EDIT_EXPANDS, $model->getQuery()['expand'] );
	}

	/**
	 * An explicitly empty expand is treated like no expand at all.
	 *
	 * @group products-rest
	 */
	public function test_collection_get_with_empty_expand_gets_forced_expands() {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/products' );
		$request->set_param( 'context', 'edit' );
		$request->set_param( 'expand', [] );

		$model = $this->runMiddleware( $request );

		$this->assertEqualsCanonicalizing( ProductsController::EDIT_EXPANDS, $model->getQuery()['expand'] );
	}

	/**
	 * Single GETs (find) always merge the forced set with the client's.
	 *
	 * @group products-rest
	 */
	public function test_single_get_merges_forced_and_client_expands() {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/products/prod_123' );
		$request->set_param( 'context', 'edit' );
		$request->set_param( 'id', 'prod_123' );
		$request->set_param( 'expand', [ 'shipping_profile' ] );

		$model = $this->runMiddleware( $request );

		$this->assertEqualsCanonicalizing(
			array_merge( ProductsController::EDIT_EXPANDS, [ 'shipping_profile' ] ),
			$model->getQuery()['expand']
		);
	}

	/**
	 * Write methods always merge the forced set — the post sync reads from it.
	 *
	 * @group products-rest
	 */
	public function test_write_request_merges_forced_and_client_expands() {
		$request = new WP_REST_Request( 'POST', '/surecart/v1/products' );
		$request->set_param( 'expand', [ 'shipping_profile' ] );

		$model = $this->runMiddleware( $request );

		$this->assertEqualsCanonicalizing(
			array_merge( ProductsController::EDIT_EXPANDS, [ 'shipping_profile' ] ),
			$model->getQuery()['expand']
		);
	}

	/**
	 * View-context GETs are untouched by the middleware.
	 *
	 * @group products-rest
	 */
	public function test_view_context_get_is_untouched() {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/products' );
		$request->set_param( 'expand', [ 'prices' ] );

		$model = $this->runMiddleware( $request );

		$this->assertArrayNotHasKey( 'expand', $model->getQuery() );
	}
}
