<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\RecaptchaValidationService;

class RecaptchaValidationServiceTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([], false);
		parent::setUp();
	}

	public function validationData()
	{
		return [
			[(object) [
				'success'      => 0,
				'score'        => 0.9,
			], false],
			[(object) [
				'success'      => 1,
				'score'        => 0.4,
			], false],
			[(object) [
				'success'      => 1,
				'score'        => 0.5,
			], true],
		];
	}

	/**
	 * Test reCaptcha validate token.
	 * @group failing
	 * @dataProvider validationData
	 */
	public function test_validate($data, $valid)
	{
		$service = \Mockery::mock(RecaptchaValidationService::class)->makePartial();
		$service->shouldReceive('makeRequest')->once()->andReturn($data);
		add_filter('surecart_recaptcha_needed_validation_score', '__return_true');
		if ($valid) {
			$this->assertTrue($service->validate('test'));
		} else {
			$this->assertWPError($service->validate('test'));
		}
	}

	/**
	 * Test Min score
	 * @group failing
	 */
	public function test_min_score() {
		$service = \Mockery::mock(RecaptchaValidationService::class)->makePartial();
		$service->shouldReceive('getMinScore')->once()->andReturn(0.2);
		$this->assertTrue($service->isValidScore((object)[
			'success' => 1,
			'score' => 0.3
		]));

		$service->shouldReceive('getMinScore')->once()->andReturn(0.4);
		$this->assertFalse($service->isValidScore((object)[
			'success' => 1,
			'score' => 0.3
		]));
	}

	/**
	 * @group failing
	 */
	public function test_is_token_valid() {
		$service = \Mockery::mock(RecaptchaValidationService::class)->makePartial();
		$this->assertTrue($service->isTokenValid((object)[
			'success' => 1,
		]));
		$this->assertFalse($service->isTokenValid((object)[
			'success' => 0,
		]));
		// unexpected response.
		$this->assertFalse($service->isTokenValid('string'));
	}
}
