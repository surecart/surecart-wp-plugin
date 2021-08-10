<?php
namespace CheckoutEngine\Tests;

use CheckoutEngine\Support\Errors;
use WP_UnitTestCase;

class ErrorTranslationsTest extends WP_UnitTestCase
{
	public function test_has_generic_error()
	{
		$error = new Errors([]);

		$this->assertEquals('Something went wrong.', $error->message);
	}

	public function test_error_has_fallbacks()
	{
		$this->assertEquals('Not found.', (new Errors(["type" => "not_found"]))->message);
		$this->assertEquals('Bad request.', (new Errors(["type" => "bad_request"]))->message);
		$this->assertEquals('You are not allowed to do this.', (new Errors(["type" => "unauthorized"]))->message);
		$this->assertEquals('Could not complete the request. Please try again.', (new Errors(["type" => "unprocessable_entity"]))->message);
		$this->assertEquals('Something went wrong.', (new Errors(["type" => "server_error"]))->message);
	}

	public function test_validates_attributes()
	{

		$error = new Errors([
			"type" => "unprocessable_entity",
			"code" => "product.invalid",
			"message" => "Failed to save product",
			"validation_errors" => [
			  [
				"attribute" => "name",
				"type" => "blank",
				"code" => "product.name.blank",
				"options" => [],
				"message" => "can't be blank"
			  ]
			]
		]);

		$this->assertEquals($error->message, "Could not complete the request. Please try again.");
		$this->assertNotEmpty($error->getValidationErrors());
		$this->assertEquals($error->getValidationErrors()[0], "Name can't be blank.");
	}
}
