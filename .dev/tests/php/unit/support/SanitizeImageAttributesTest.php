<?php

namespace SureCart\Tests\Support;

use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group sanitize-image-attributes
 */
class SanitizeImageAttributesTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up.
	 */
	public function setUp() : void {
		parent::setUp();

		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
			],
		]);
	}

	/**
	 * Test that disallowed keys are stripped.
	 */
	public function test_strips_disallowed_keys() {
		$input = (object) array(
			'src'                => 'https://example.com/image.jpg',
			'alt'                => 'Test image',
			'width'              => 100,
			'height'             => 100,
			'class'              => 'attachment-thumbnail size-thumbnail',
			'style'              => '--dominant-color: #abcdef',
			'data-dominant-color' => '#abcdef',
		);

		$result = sc_sanitize_image_attributes( $input );

		$this->assertEquals( 'https://example.com/image.jpg', $result->src );
		$this->assertEquals( 'Test image', $result->alt );
		$this->assertEquals( 100, $result->width );
		$this->assertEquals( 100, $result->height );
		$this->assertEquals( 'attachment-thumbnail size-thumbnail', $result->class );
		$this->assertObjectNotHasProperty( 'style', $result );
		$this->assertObjectNotHasProperty( 'data-dominant-color', $result );
	}

	/**
	 * Test that null input returns empty object.
	 */
	public function test_null_returns_empty_object() {
		$result = sc_sanitize_image_attributes( null );

		$this->assertEquals( (object) array(), $result );
	}

	/**
	 * Test that empty object returns empty object.
	 */
	public function test_empty_object_returns_empty_object() {
		$result = sc_sanitize_image_attributes( (object) array() );

		$this->assertEquals( (object) array(), $result );
	}

	/**
	 * Test that all safe keys pass through unchanged.
	 */
	public function test_all_safe_keys_pass_through() {
		$input = (object) array(
			'src'           => 'https://example.com/image.jpg',
			'alt'           => 'Test image',
			'width'         => 800,
			'height'        => 600,
			'srcset'        => 'image-300.jpg 300w, image-600.jpg 600w',
			'sizes'         => '(max-width: 600px) 300px, 600px',
			'loading'       => 'lazy',
			'decoding'      => 'async',
			'fetchpriority' => 'high',
			'title'         => 'Image title',
		);

		$result = sc_sanitize_image_attributes( $input );

		$this->assertEquals( $input, $result );
	}
}
