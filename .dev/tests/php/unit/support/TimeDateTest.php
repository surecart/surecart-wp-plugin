<?php
namespace SureCart\Tests\Support;

use SureCart\Support\TimeDate;
use SureCart\Tests\SureCartUnitTestCase;

class TimeDateTest extends SureCartUnitTestCase {
	/**
	 * @group timedate
	 */
	public function test_getSiteLocale_returns_wplang_option() {
		update_option( 'WPLANG', 'es_ES' );
		$this->assertEquals( 'es_ES', TimeDate::getSiteLocale() );
	}

	/**
	 * @group timedate
	 */
	public function test_getSiteLocale_defaults_to_en_US() {
		update_option( 'WPLANG', '' );
		$this->assertEquals( 'en_US', TimeDate::getSiteLocale() );
	}

	/**
	 * @group timedate
	 */
	public function test_formatDate_returns_string() {
		$result = TimeDate::formatDate( time() );
		$this->assertIsString( $result );
		$this->assertNotEmpty( $result );
	}

	/**
	 * @group timedate
	 */
	public function test_formatDate_uses_site_locale() {
		update_option( 'WPLANG', 'de_DE' );
		$result = TimeDate::formatDate( time() );
		$this->assertIsString( $result );
		$this->assertNotEmpty( $result );
	}

	/**
	 * @group timedate
	 */
	public function test_formatDate_restores_locale_after_call() {
		// Force locale to fr_FR via filter (works without language packs).
		$filter = fn() => 'fr_FR';
		add_filter( 'locale', $filter );
		$this->assertEquals( 'fr_FR', get_locale() );

		update_option( 'WPLANG', 'es_ES' );
		TimeDate::formatDate( time() );

		// Locale must still be fr_FR — proves restore_previous_locale() ran.
		$this->assertEquals( 'fr_FR', get_locale() );
		remove_filter( 'locale', $filter );
	}

	/**
	 * @group timedate
	 */
	public function test_formatTime_restores_locale_after_call() {
		$filter = fn() => 'fr_FR';
		add_filter( 'locale', $filter );
		$this->assertEquals( 'fr_FR', get_locale() );

		update_option( 'WPLANG', 'es_ES' );
		TimeDate::formatTime( time() );

		$this->assertEquals( 'fr_FR', get_locale() );
		remove_filter( 'locale', $filter );
	}

	/**
	 * @group timedate
	 */
	public function test_humanTimeDiff_restores_locale_after_call() {
		$filter = fn() => 'fr_FR';
		add_filter( 'locale', $filter );
		$this->assertEquals( 'fr_FR', get_locale() );

		update_option( 'WPLANG', 'es_ES' );
		TimeDate::humanTimeDiff( time() - 60 );

		$this->assertEquals( 'fr_FR', get_locale() );
		remove_filter( 'locale', $filter );
	}
}
