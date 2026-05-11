<?php

namespace SureCart\Tests\Unit\Models;

use SureCart\Models\Media;
use SureCart\Models\ProductMedia;
use SureCart\Models\GalleryItemProductMedia;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Regression coverage for SUR-5239.
 *
 * WordPress allows get_the_post_thumbnail()'s third arg to be a query string
 * (e.g. Enfold theme passes 'class=foo&id=bar'). The plugin must not fatal
 * on PHP 8+ when this happens — both Media and GalleryItemProductMedia must
 * normalise $attr to an array before any array-write.
 */
class MediaStringAttrTest extends SureCartUnitTestCase {

	/**
	 * @group media
	 * @group models
	 */
	public function test_media_html_accepts_string_attr_without_fatal() {
		$media = new Media(
			[
				'id'     => 'test_media',
				'url'    => 'https://example.com/image.jpg',
				'alt'    => 'Goat mug',
				'width'  => 800,
				'height' => 600,
			]
		);

		// Must not throw "Cannot access offset of type string on string" on PHP 8+.
		$html = $media->html( 'full', 'class=foo&id=bar' );

		$this->assertStringContainsString( '<img', $html );
		$this->assertStringContainsString( 'foo', $html );
	}

	/**
	 * @group media
	 * @group models
	 */
	public function test_gallery_item_product_media_html_accepts_string_attr_without_fatal() {
		$product_media = new ProductMedia(
			[
				'id'  => 'pm_test',
				'url' => 'https://example.com/image.jpg',
			]
		);
		$gallery_item  = new GalleryItemProductMedia( $product_media );

		// Must not throw "Cannot access offset of type string on string" on PHP 8+.
		$html = $gallery_item->html( 'full', 'class=foo&id=bar' );

		$this->assertStringContainsString( '<img', $html );
		$this->assertStringContainsString( 'foo', $html );
	}
}
