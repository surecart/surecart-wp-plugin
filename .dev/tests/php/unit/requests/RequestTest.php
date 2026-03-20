<?php

namespace SureCart\Tests\Requests;

use SureCartCore\Requests\Request;
use SureCartVendors\Psr\Http\Message\UriInterface;
use WP_UnitTestCase;

/**
 * Tests for the Request class.
 */
class RequestTest extends WP_UnitTestCase {

	/**
	 * Test that getUrl() returns a string, not a URI object.
	 *
	 * @see https://github.com/surecart/surecart/issues/SUR-4692
	 */
	public function test_getUrl_returns_string() {
		$request = new Request(
			'GET',
			'https://example.com/buy/test-product?foo=bar',
			[],
			null,
			'1.1',
			[ 'REQUEST_URI' => '/buy/test-product' ]
		);

		$url = $request->getUrl();

		$this->assertIsString( $url, 'getUrl() should return a string, not a URI object' );
		$this->assertEquals( 'https://example.com/buy/test-product?foo=bar', $url );
	}

	/**
	 * Test that getUri() still returns a UriInterface object.
	 */
	public function test_getUri_returns_uri_interface() {
		$request = new Request(
			'GET',
			'https://example.com/buy/test-product',
			[],
			null,
			'1.1',
			[]
		);

		$uri = $request->getUri();

		$this->assertInstanceOf( UriInterface::class, $uri );
	}

	/**
	 * Test that getUrl() can be safely assigned to $_SERVER['REQUEST_URI'].
	 */
	public function test_getUrl_safe_for_server_request_uri() {
		$request = new Request(
			'GET',
			'https://example.com/buy/test-product',
			[],
			null,
			'1.1',
			[]
		);

		$original_request_uri   = $_SERVER['REQUEST_URI'] ?? null;
		$_SERVER['REQUEST_URI'] = $request->getUrl();

		$this->assertIsString( $_SERVER['REQUEST_URI'] );

		// Restore original value.
		if ( $original_request_uri !== null ) {
			$_SERVER['REQUEST_URI'] = $original_request_uri;
		} else {
			unset( $_SERVER['REQUEST_URI'] );
		}
	}
}
