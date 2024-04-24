<?php

namespace SureCart\Tests\Models;

use SureCart\Models\GalleryItem;
use SureCart\Tests\SureCartUnitTestCase;

class GalleryItemTest extends SureCartUnitTestCase {
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([], false);

		parent::setUp();
	}

	/**
	 * @group gallery
	 */
	public function test_running() {

		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$id = $this->factory->attachment->create_upload_object( $filename );
		$post = get_post($id);

		$this->assertNotEmpty($post);
		// $gallery = new GalleryItem($post);
		// $this->assertEquals(1, $gallery->id);

		// $gallery = new GalleryItem('asdfasdfasdf');
		// $this->assertEquals('asdfasdfasdf', $gallery->id);
	}
}
