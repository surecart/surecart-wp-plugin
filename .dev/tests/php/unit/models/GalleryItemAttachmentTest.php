<?php

namespace SureCart\Tests\Unit\Models;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Models\GalleryItemAttachment;
use SureCart\Models\GalleryItemImageAttachment;
use SureCart\Models\GalleryItemVideoAttachment;

class GalleryItemAttachmentTest extends SureCartUnitTestCase {
	
	/**
	 * Test that the factory creates an image attachment for image mime types.
	 *
	 * @group media
	 * @group factory
	 */
	public function test_creates_image_attachment_for_image_mime_type() {
		// Create an image attachment using WordPress factory
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$attachment_id = self::factory()->attachment->create_upload_object( $filename );
		
		// TODO(human)
		$gallery_item = GalleryItemAttachment::create( $attachment_id );

		// Verify the factory creates the correct type
		$this->assertInstanceOf( GalleryItemImageAttachment::class, $gallery_item );
	}

	/**
	 * Test that the factory creates a video attachment for video mime types.
	 *
	 * @group media
	 * @group factory
	 */
	public function test_creates_video_attachment_for_video_mime_type() {
		// Create a video attachment using WordPress factory
		$attachment_id = self::factory()->attachment->create( [
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video',
			'post_content' => '',
			'post_status' => 'inherit'
		] );
		
		// TODO(human)
		$gallery_item = GalleryItemAttachment::create( $attachment_id );
		
		// Verify the factory creates the correct type
		$this->assertInstanceOf( GalleryItemVideoAttachment::class, $gallery_item );
	}

	/**
	 * Test that the factory defaults to image attachment for unknown/missing mime types.
	 *
	 * @group media
	 * @group factory
	 */
	public function test_defaults_to_image_attachment_for_unknown_mime_type() {
		// Create an attachment with no specific mime type
		$attachment_id = self::factory()->attachment->create( [
			'post_mime_type' => 'application/unknown',
			'post_title' => 'Test Unknown File',
			'post_content' => '',
			'post_status' => 'inherit'
		] );
		
		// TODO(human)
		$gallery_item = GalleryItemAttachment::create( $attachment_id );

		// Verify the factory defaults to image attachment
		$this->assertInstanceOf( GalleryItemImageAttachment::class, $gallery_item );
	}

	/**
	 * Test that the factory handles invalid attachment IDs gracefully.
	 *
	 * @group media
	 * @group factory
	 */
	public function test_handles_invalid_attachment_id() {
		$invalid_id = 99999; // Non-existent attachment ID
		
		// TODO(human)
		$gallery_item = GalleryItemAttachment::create( $invalid_id );
		
		// Should still create an image attachment as the default fallback
		$this->assertNull( $gallery_item );
	}
}