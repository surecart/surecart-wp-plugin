<?php

namespace SureCart\Tests\Support;

use SureCart\Support\Currency;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;
use WP_Error;

class CurrencyTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Display currencies test data.
	 *
	 * @var array
	 */
	protected $display_currencies;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
			]
		], false);

		// Test data
		$this->display_currencies = [
			(object)[
				'id' => 'test_id_1',
				'object' => 'display_currency',
				'currency' => 'usd',
				'current_exchange_rate' => 1.0,
				'created_at' => time(),
				'updated_at' => time(),
			],
			(object)[
				'id' => 'test_id_2',
				'object' => 'display_currency',
				'currency' => 'eur',
				'current_exchange_rate' => 1.2,
				'created_at' => time(),
				'updated_at' => time(),
			],
			(object)[
				'id' => 'test_id_3',
				'object' => 'display_currency',
				'currency' => 'gbp',
				'current_exchange_rate' => 1.5,
				'created_at' => time(),
				'updated_at' => time(),
			]
		];

		// Mock the request service
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function() use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Mock account request
		$requests->shouldReceive('makeRequest')
			->with('account')
			->andReturn((object)[
				'id' => 'test',
				'currency' => 'usd',
			]);

		// Mock display currencies request
		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('display_currencies')
			->andReturn((object)[
				'data' => $this->display_currencies,
			]);

		// Mock account
		\SureCart::alias('account', function() {
			return (object) [
				'currency' => 'usd'
			];
		});
	}

	public function tearDown(): void {
		parent::tearDown();
		\Mockery::close();
		$_GET = [];
		$_COOKIE = [];
		$_SERVER = [];
	}

	public function test_is_supported_currency() {
		$this->assertTrue(Currency::isSupportedCurrency('usd'));
		$this->assertTrue(Currency::isSupportedCurrency('eur'));
		$this->assertFalse(Currency::isSupportedCurrency('invalid'));
		$this->assertFalse(Currency::isSupportedCurrency(''));
	}

	public function test_is_supported_currency_with_wp_error() {
		// Mock DisplayCurrency::get() to return WP_Error
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function() use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('display_currencies')
			->andReturn(new WP_Error('error', 'Test error'));

		$this->assertFalse(Currency::isSupportedCurrency('usd'));
	}

	public function test_get_current_currency() {
		\SureCart::currency()->convert( true );

		// Test default currency
		$this->assertEquals('usd', Currency::getCurrentCurrency());

		// Test with GET parameter
		$_GET['currency'] = 'eur';
		$this->assertEquals('eur', Currency::getCurrentCurrency());
		unset($_GET['currency']);

		// Test with cookie
		$_COOKIE['sc_current_currency'] = 'eur';
		$this->assertEquals('eur', Currency::getCurrentCurrency());
		unset($_COOKIE['sc_current_currency']);

		// Test with invalid currency in GET
		$_GET['currency'] = 'invalid';
		$this->assertEquals('usd', Currency::getCurrentCurrency());
		unset($_GET['currency']);

		// Test with invalid currency in cookie
		$_COOKIE['sc_current_currency'] = 'invalid';
		$this->assertEquals('usd', Currency::getCurrentCurrency());
		unset($_COOKIE['sc_current_currency']);
	}

	public function test_get_preferred_locale_from_header() {
		// Test with no header
		$this->assertEquals(get_locale(), Currency::getPreferredLocaleFromHeader());

		// Test with simple locale
		$_SERVER['HTTP_ACCEPT_LANGUAGE'] = 'en-US';
		$this->assertEquals('en_US', Currency::getPreferredLocaleFromHeader());

		// Test with quality values
		$_SERVER['HTTP_ACCEPT_LANGUAGE'] = 'fr-FR,fr;q=0.9,en;q=0.8';
		$this->assertEquals('fr_FR', Currency::getPreferredLocaleFromHeader());

		// Test with invalid format
		$_SERVER['HTTP_ACCEPT_LANGUAGE'] = 'invalid-format';
		$this->assertEquals(get_locale(), Currency::getPreferredLocaleFromHeader());
	}

	public function test_get_default_currency() {
		\SureCart::currency()->convert( true );

		$this->assertEquals('usd', Currency::getDefaultCurrency());

		// Test with different account currency
		\SureCart::alias('account', function() {
			return (object) [
				'currency' => 'eur'
			];
		});
		$this->assertEquals('eur', Currency::getDefaultCurrency());
	}

	public function test_get_currency_from_geolocation_with_number_formatter_exception() {
		if (!class_exists('NumberFormatter')) {
			$this->markTestSkipped('NumberFormatter class is not available.');
		}

		// falls back to default locale.
		$_SERVER['HTTP_ACCEPT_LANGUAGE'] = 'invalid-locale';
		$this->assertSame('usd', Currency::getCurrencyFromGeolocation());
	}

	public function test_get_exchange_rate() {
		$this->assertEquals(1.0, Currency::getExchangeRate('usd'));
		$this->assertEquals(1.2, Currency::getExchangeRate('eur'));
		$this->assertEquals(1, Currency::getExchangeRate('invalid')); // Invalid currency returns 1
	}

	public function test_get_currency_symbol() {
		$this->assertEquals('&#36;', Currency::getCurrencySymbol('USD'));
		$this->assertEquals('&euro;', Currency::getCurrencySymbol('EUR'));
		$this->assertEquals('&#36;', Currency::getCurrencySymbol('INVALID')); // Invalid currency returns default $
	}

	public function test_is_zero_decimal() {
		$this->assertTrue(Currency::isZeroDecimal('JPY'));
		$this->assertFalse(Currency::isZeroDecimal('USD'));
		$this->assertFalse(Currency::isZeroDecimal('EUR'));
	}

	public function test_maybe_convert_amount() {
		// Test zero decimal currency
		$this->assertEquals(1000, Currency::maybeConvertAmount(1000, 'JPY'));

		// Test regular currency
		$this->assertEquals(10, Currency::maybeConvertAmount(1000, 'USD'));
		$this->assertEquals(10, Currency::maybeConvertAmount(1000, 'EUR'));
	}

	public function test_format() {
		// Test formatting USD
		$this->assertEquals('$10', Currency::format(1000, 'USD'));

		// Test formatting EUR
		$this->assertEquals('€10', Currency::format(1000, 'EUR'));

		// Test formatting JPY (zero decimal)
		$this->assertEquals('¥1,000', Currency::format(1000, 'JPY'));
	}

	public function test_get_currency_from_geolocation() {
		\SureCart::currency()->convert( true );
		// Mock NumberFormatter
		if (!class_exists('NumberFormatter')) {
			$this->markTestSkipped('NumberFormatter class is not available.');
		}

		$_SERVER['HTTP_ACCEPT_LANGUAGE'] = 'en-US';
		$this->assertEquals('usd', Currency::getCurrentCurrency());

		// Test with different locale
		$_SERVER['HTTP_ACCEPT_LANGUAGE'] = 'fr-FR';
		$this->assertEquals('eur', Currency::getCurrentCurrency());
	}

	/**
	 * Test formatting with exchange rates.
	 */
	public function test_formats_with_exchange_rate() {
		\SureCart::currency()->convert( true );
		$_GET['currency'] = 'eur';
		// EUR has 1.2 exchange rate from test data
		$this->assertEquals('€12', Currency::format(1000, 'usd', true));

		// GBP has 1.5 exchange rate from test data
		$_GET['currency'] = 'gbp';
		$this->assertEquals('£15', Currency::format(1000, 'usd', true));
	}
}
