<?php

namespace CheckoutEngine\Tests;

use CheckoutEngine\Support\Errors\ErrorsTranslationService;
use \Mockery;

class ErrorsTranslationServiceTest extends CheckoutEngineUnitTestCase
{
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\Support\Errors\ErrorsServiceProvider::class,
			]
		], false);
	}

	public function tearDown()
	{
		parent::tearDown();
		Mockery::close();
	}

	public function test_has_fallback()
	{
		$translation_service = \CheckoutEngine::errors()->translate();
		$this->assertWPError($translation_service, 'Error.');
	}

	public function test_code_translation()
	{
		$errors = new ErrorsTranslationService();
		$this->assertEquals('Failed to save coupon.', $errors->codeTranslation('coupon.invalid'));
	}

	public function test_attribute_translation()
	{
		$errors = new ErrorsTranslationService();
		$this->assertEquals('Promotion code is invalid.', $errors->attributeTranslation('promotion_code', 'invalid_code'));
	}

	public function test_type_translation()
	{
		$errors = new ErrorsTranslationService();
		$this->assertEquals("Can't be empty.", $errors->typeTranslation('empty'));
	}

	public function test_translate_error_message()
	{
		// code translation
		$errors = new ErrorsTranslationService();
		$translation = $errors->translateErrorMessage([
			'code' => 'coupon.invalid'
		]);
		$this->assertEquals('Failed to save coupon.', $translation);

		// attribute translation
		$errors = new ErrorsTranslationService();
		$translation = $errors->translateErrorMessage([
			'code' => 'invalid_code',
			'attribute' => 'product',
			'type' => 'blank'
		]);
		$this->assertEquals("Product can't be blank.", $translation);

		// type translation
		$errors = new ErrorsTranslationService();
		$translation = $errors->translateErrorMessage([
			'code' => 'iasdfasdfasdf',
			'attribute' => 'something',
			'type' => 'not_found'
		]);
		$this->assertEquals("Not found.", $translation);

		// fallback
		$errors = new ErrorsTranslationService();
		$translation = $errors->translateErrorMessage([
			'code' => 'asdfasdfasdf',
			'attribute' => 'asdfasdfasdf',
			'type' => 'asdfasdfasdf'
		]);
		$this->assertEquals("Error.", $translation);
	}

	public function test_translate()
	{
		$errors = new ErrorsTranslationService();
		$error = json_decode(file_get_contents(dirname(__FILE__) . '/price-error.json'), true);
		$translated = $errors->translate($error);
		$this->assertEquals([
			'price.invalid' => ['There were some validation errors.'],
			'price.amount.blank' => ["Amount can't be blank."],
			'price.amount.not_a_number' => ['Amount must be a number.']
		], $translated->errors);
	}
}
