<?php

namespace SureCart\Tests\Support\Errors;

use SureCart\Support\Errors\ErrorsTranslationService;
use SureCart\Tests\SureCartUnitTestCase;

class ErrorsTranslationServiceTest extends SureCartUnitTestCase {
	
	/**
	 * The service instance.
	 * 
	 * @var ErrorsTranslationService
	 */
	protected $service;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->service = new ErrorsTranslationService();
	}

	/**
	 * Test bad_gateway error with code preserves raw message.
	 * 
	 * @group errors
	 */
	public function test_bad_gateway_error_with_code_preserves_raw_message() {
		$response = [
			'code' => 'bad_gateway',
			'message' => 'Charge ch_3Rh3nCCAyH09BTUT1QpGDreU has been charged back; cannot issue a refund.',
			'type' => 'bad_gateway',
			'http_status' => 'bad_gateway',
			'validation_errors' => []
		];
		
		$translated = $this->service->translateErrorMessage( $response );
		
		$this->assertEquals( 'Charge ch_3Rh3nCCAyH09BTUT1QpGDreU has been charged back; cannot issue a refund.', $translated );
	}

	/**
	 * Test bad_gateway error with type preserves raw message.
	 * 
	 * @group errors
	 */
	public function test_bad_gateway_error_with_type_preserves_raw_message() {
		$response = [
			'type' => 'bad_gateway',
			'message' => 'Payment processor timeout error',
			'validation_errors' => []
		];
		
		$translated = $this->service->translateErrorMessage( $response );
		
		$this->assertEquals( 'Payment processor timeout error', $translated );
	}

	/**
	 * Test bad_gateway error with http_status preserves raw message.
	 * 
	 * @group errors
	 */
	public function test_bad_gateway_error_with_http_status_preserves_raw_message() {
		$response = [
			'http_status' => 'bad_gateway',
			'message' => 'Stripe API error: insufficient funds',
			'validation_errors' => []
		];
		
		$translated = $this->service->translateErrorMessage( $response );
		
		$this->assertEquals( 'Stripe API error: insufficient funds', $translated );
	}

	/**
	 * Test bad_gateway error without message uses fallback.
	 * 
	 * @group errors
	 */
	public function test_bad_gateway_error_without_message_uses_fallback() {
		$response = [
			'code' => 'bad_gateway',
			'type' => 'bad_gateway',
			'http_status' => 'bad_gateway',
			'validation_errors' => []
		];
		
		$translated = $this->service->translateErrorMessage( $response );
		
		$this->assertEquals( 'Payment processor error occurred', $translated );
	}

	/**
	 * Test non-bad_gateway errors still get translated.
	 * 
	 * @group errors
	 */
	public function test_non_bad_gateway_errors_still_get_translated() {
		$response = [
			'code' => 'checkout.line_items.required',
			'message' => 'Original message',
			'validation_errors' => []
		];
		
		$translated = $this->service->translateErrorMessage( $response );
		
		// This should be translated based on the codes.php file
		$this->assertEquals( 'Please add at least one product.', $translated );
	}

	/**
	 * Test translate method properly handles bad_gateway errors.
	 * 
	 * @group errors
	 */
	public function test_translate_method_handles_bad_gateway_errors() {
		$response = [
			'code' => 'bad_gateway',
			'type' => 'bad_gateway',
			'http_status' => 'bad_gateway',
			'message' => 'Charge ch_3Rh3nCCAyH09BTUT1QpGDreU has been charged back; cannot issue a refund.',
			'validation_errors' => []
		];
		
		$error = $this->service->translate( $response, 502 );
		
		$this->assertInstanceOf( \WP_Error::class, $error );
		$this->assertEquals( 'bad_gateway', $error->get_error_code() );
		$this->assertEquals( 'Charge ch_3Rh3nCCAyH09BTUT1QpGDreU has been charged back; cannot issue a refund.', $error->get_error_message() );
		
		// Check error data includes proper fields
		$error_data = $error->get_error_data();
		$this->assertEquals( 502, $error_data['status'] );
		$this->assertEquals( 'bad_gateway', $error_data['type'] );
		$this->assertEquals( 'bad_gateway', $error_data['http_status'] );
	}
}