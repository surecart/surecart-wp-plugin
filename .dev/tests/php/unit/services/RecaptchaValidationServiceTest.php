<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\RecaptchaValidationService;

class RecaptchaValidationServiceTest extends SureCartUnitTestCase {
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() {
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Pages\PageServiceProvider::class,
			]
		], false);

		$this->service = new RecaptchaValidationService();

		parent::setUp();
	}

	/**
	 * Test reCaptcha validate token.
	 */
	public function test_sc_is_validate_token() {
		$this->assertFalse( $this->service->is_validate_token( $this->get_test_data() ) );
	}

	/**
	 * Test reCaptcha validate score.
	 */
	public function test_sc_is_validate_score() {
		$this->assertTrue( $this->service->is_validate_score( $this->get_test_data() ) );
	}

    /**
	 * Get test data.
	 */
    public function get_test_data() {
        return (object) [
            'success'      => 1,
            'challenge_ts' => '2022-09-13T17:43:52Z',
            'hostname'     => 'surecart.local',
            'score'        => 0.9,
            'action'       => 'surecart_checkout_submit'
        ];
    }
}
