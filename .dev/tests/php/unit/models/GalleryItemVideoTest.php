<?php

namespace SureCart\Tests\Unit\Models;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Models\GalleryItemVideoAttachment;

class GalleryItemVideoTest extends SureCartUnitTestCase {
    public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCartAppCore\AppCore\AppCoreServiceProvider::class,
				\SureCartAppCore\Config\ConfigServiceProvider::class,
				\SureCartAppCore\Assets\AssetsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Svg\SvgServiceProvider::class,
			],
			'views'  => array( SURECART_PLUGIN_DIR . DIRECTORY_SEPARATOR . 'views' ), // needed to find the views for the test.
		], false);
	}
	
	
	/**
	 * Test that the video gallery item handles invalid post data gracefully.
	 *
	 * @group media
	 * @group video
	 */
	public function test_handles_invalid_post_data_gracefully() {
		$invalid_id = 99999; // Non-existent attachment ID
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $invalid_id]);
		
		$this->assertInstanceOf(GalleryItemVideoAttachment::class, $gallery_item);
		$this->assertFalse($gallery_item->exists());
		$this->assertNull($gallery_item->id);
	}
	
	/**
	 * Test that posterId returns thumbnail image ID from metadata.
	 *
	 * @group media
	 * @group video
	 * @group poster
	 */
	public function test_poster_id_returns_thumbnail_image_from_metadata() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video with Poster',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		
		// Set thumbnail image metadata
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$this->assertEquals($poster_id, $gallery_item->posterId());
	}
	
	/**
	 * Test that posterId returns null when no images are available.
	 *
	 * @group media
	 * @group video
	 * @group poster
	 */
	public function test_poster_id_returns_null_when_no_images_available() {
		// Create a video attachment without any poster images
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video No Poster',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		
		$this->assertNull($gallery_item->posterId());
	}
	
	/**
	 * Test that posterId handles nested metadata structure correctly.
	 *
	 * @group media
	 * @group video
	 * @group poster
	 */
	public function test_poster_id_with_nested_metadata_structure() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Nested Metadata',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		
		// Set complex metadata structure
		$gallery_item->setMetadata('thumbnail_image', [
			'id' => $poster_id,
			'alt' => 'Custom poster alt text',
			'title' => 'Custom poster title'
		]);
		
		$this->assertEquals($poster_id, $gallery_item->posterId());
	}
	
	/**
	 * Test that attributes returns fallback image when no poster is available.
	 *
	 * @group media
	 * @group video
	 * @group poster
	 */
	public function test_attributes_returns_fallback_image_when_no_poster() {
		// Create a video attachment without poster
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Fallback',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$attributes = $gallery_item->attributes();
		
		$this->assertIsObject($attributes);
		$this->assertObjectHasProperty('src', $attributes);
		$this->assertObjectHasProperty('alt', $attributes);
		$this->assertObjectHasProperty('title', $attributes);
		
		// Should contain fallback placeholder image
		$this->assertStringContainsString('placeholder.jpg', $attributes->src);
		$this->assertStringContainsString('Product Video', $attributes->alt);
	}
	
	/**
	 * Test that attributes includes proper WordPress image attributes when poster exists.
	 *
	 * @group media
	 * @group video
	 * @group poster
	 */
	public function test_attributes_includes_proper_wordpress_attributes() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video WP Attributes',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$attributes = $gallery_item->attributes('medium');
		
		$this->assertIsObject($attributes);
		$this->assertObjectHasProperty('src', $attributes);
		$this->assertObjectHasProperty('width', $attributes);
		$this->assertObjectHasProperty('height', $attributes);
		$this->assertObjectHasProperty('class', $attributes);
		
		// Should include size-specific class
		$this->assertStringContainsString('attachment-medium', $attributes->class);
		$this->assertStringContainsString('size-medium', $attributes->class);
	}
	
	/**
	 * Test that posterId falls back to product featured image when no thumbnail provided.
	 *
	 * @group media
	 * @group video
	 * @group poster
	 * @group featured-image
	 */
	public function test_poster_id_falls_back_to_product_featured_image() {
		// Create a product featured image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$featured_image_id = self::factory()->attachment->create_upload_object($filename);
		$featured_image_post = get_post($featured_image_id);
		
		// Create a video attachment without any thumbnail metadata.
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Featured Image Fallback',
		]);
		
		// Create gallery item with featured image passed as second parameter.
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id], $featured_image_post);
		
		// Verify that posterId returns the featured image ID when no thumbnail provided.
		$this->assertEquals($featured_image_id, $gallery_item->posterId());
		
		// Test that attributes method uses the featured image.
		$attributes = $gallery_item->attributes();
		$this->assertIsObject($attributes);
		$this->assertObjectHasProperty('src', $attributes);
		
		// The src should contain the featured image URL.
		$expected_url = wp_get_attachment_image_src($featured_image_id, 'full')[0];
		$this->assertEquals($expected_url, $attributes->src);
	}
	
	/**
	 * Test that thumbnail metadata takes priority over product featured image.
	 *
	 * @group media
	 * @group video
	 * @group poster
	 * @group featured-image
	 */
	public function test_thumbnail_metadata_takes_priority_over_featured_image() {
		// Create both a thumbnail image and a featured image
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$thumbnail_id = self::factory()->attachment->create_upload_object($filename);
		$featured_image_id = self::factory()->attachment->create_upload_object($filename);
		$featured_image_post = get_post($featured_image_id);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Priority',
		]);
		
		// Create gallery item with featured image
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id], $featured_image_post);
		
		// Set thumbnail metadata
		$gallery_item->setMetadata('thumbnail_image', ['id' => $thumbnail_id]);
		
		// Verify that thumbnail metadata takes priority over featured image
		$this->assertEquals($thumbnail_id, $gallery_item->posterId());
		$this->assertNotEquals($featured_image_id, $gallery_item->posterId());
	}
	
	/**
	 * Test that html generates valid image markup.
	 *
	 * @group media
	 * @group video
	 * @group html
	 */
	public function test_html_generates_valid_image_markup() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video HTML',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$html = $gallery_item->html();
		
		$this->assertIsString($html);
		$this->assertNotEmpty($html);
		$this->assertStringContainsString('<img', $html);
		$this->assertStringContainsString('src=', $html);
	}
	
	/**
	 * Test that html applies custom styling attributes correctly.
	 *
	 * @group media
	 * @group video
	 * @group html
	 */
	public function test_html_applies_custom_styling_attributes() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Styling',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$custom_style = 'border: 2px solid red; border-radius: 10px;';
		$html = $gallery_item->html('medium', ['style' => $custom_style]);
		
		$this->assertStringContainsString('style=', $html);
		$this->assertStringContainsString($custom_style, $html);
	}
	
	/**
	 * Test that html returns empty string for missing poster.
	 *
	 * @group media
	 * @group video
	 * @group html
	 */
	public function test_html_returns_empty_string_for_missing_poster() {
		// Create a video attachment without poster
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video No HTML',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$html = $gallery_item->html();
		
		$this->assertEquals('', $html);
	}
	
	/**
	 * Test that html includes lightbox attributes when enabled.
	 *
	 * @group media
	 * @group video
	 * @group html
	 * @group lightbox
	 */
	public function test_html_includes_lightbox_attributes_when_enabled() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Lightbox',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		$gallery_item->withLightbox(true);
		
		$html = $gallery_item->html();
		
		$this->assertStringContainsString('data-wp-on-async--click', $html);
		$this->assertStringContainsString('has-image-lightbox', $html);
		$this->assertStringContainsString('<button', $html);
		$this->assertStringContainsString('lightbox-trigger', $html);
	}
	
	/**
	 * Test that html processes WP_HTML_Tag_Processor correctly.
	 *
	 * @group media
	 * @group video
	 * @group html
	 */
	public function test_html_processes_wp_html_tag_processor_correctly() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Tag Processor',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$html = $gallery_item->html('thumbnail', ['alt' => 'Custom Alt Text']);
		
		$this->assertStringContainsString('alt="Custom Alt Text"', $html);
		$this->assertStringContainsString('attachment-thumbnail', $html);
		
		// Verify it's valid HTML by checking for proper img tag structure
		$this->assertMatchesRegularExpression('/<img[^>]+>/', $html);
	}
	
	/**
	 * Test that video_html generates proper markup with poster and src attributes.
	 *
	 * @group media
	 * @group video
	 * @group video-html
	 */
	public function test_video_html_generates_proper_markup() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment with actual file
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video HTML Generation',
			'guid' => 'http://example.com/test-video.mp4'
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);	
        $gallery_item->setMetadata('aspect_ratio', '4:3');
	
		$html = $gallery_item->video_html();
		
		// Test specific attributes in the generated HTML
		$this->assertStringContainsString('poster="' . wp_get_attachment_url($poster_id) . '"', $html);
		$this->assertStringContainsString('src="' . wp_get_attachment_url($video_id) . '"', $html);
		$this->assertStringContainsString('<video', $html);
		$this->assertStringContainsString('class="sc-video"', $html);
        $this->assertStringContainsString('aspect-ratio: 4:3;', $html);
	}
	
	/**
	 * Test that video_html returns empty for invalid attachment.
	 *
	 * @group media
	 * @group video
	 * @group video-html
	 */
	public function test_video_html_returns_empty_for_invalid_attachment() {
		$gallery_item = new GalleryItemVideoAttachment(['id' => 99999]);
		
		$html = $gallery_item->video_html();
		
		$this->assertEquals('', $html);
	}
	
	/**
	 * Test that video_attributes returns complete object structure.
	 *
	 * @group media
	 * @group video
	 * @group video-attributes
	 */
	public function test_video_attributes_returns_complete_object_structure() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Attributes Object',
			'guid' => 'http://example.com/test-video-obj.mp4'
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$attributes = $gallery_item->video_attributes('large', ['data-custom' => 'test-value']);
		
		$this->assertIsObject($attributes);
		$this->assertObjectHasProperty('src', $attributes);
		$this->assertObjectHasProperty('poster', $attributes);
		$this->assertObjectHasProperty('class', $attributes);
		$this->assertObjectHasProperty('mime_type', $attributes);
        $this->assertObjectHasProperty('alt', $attributes);
        $this->assertEquals('video/mp4', $attributes->mime_type);
		$this->assertStringContainsString('attachment-large', $attributes->class);
		$this->assertStringContainsString('size-large', $attributes->class);
		$this->assertStringContainsString('video-attachment', $attributes->class);
        $this->assertObjectHasProperty('data-custom', $attributes);
        $this->assertEquals('test-value', $attributes->{'data-custom'});
	}

	/**
	 * Test that video_thumbnail_html generates proper thumbnail markup.
	 *
	 * @group media
	 * @group video
	 * @group video-thumbnail-html
	 */
	public function test_video_thumbnail_html_generates_proper_markup() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Thumbnail',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$html = $gallery_item->video_thumbnail_html();
		
        $this->assertStringContainsString('src="' . wp_get_attachment_url($poster_id) . '"', $html);
        $this->assertStringContainsString('class="sc-video-play-button', $html);
	}

	/**
	 * Test that video_thumbnail_html applies size parameter correctly.
	 *
	 * @group media
	 * @group video
	 * @group video-thumbnail-html
	 */
	public function test_video_thumbnail_html_applies_size_parameter() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Thumbnail Size',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		$html_medium = $gallery_item->video_thumbnail_html('medium');
		$html_large = $gallery_item->video_thumbnail_html('large');
		
		$this->assertStringContainsString('attachment-medium', $html_medium);
        $this->assertStringContainsString('attachment-large', $html_large);
        $this->assertStringContainsString('size-medium', $html_medium);
        $this->assertStringContainsString('size-large', $html_large);
        $this->assertStringContainsString('sc-video-play-button', $html_medium);
        $this->assertStringContainsString('sc-video-play-button', $html_large);
	}

	/**
	 * Test that video_thumbnail_html uses fallback image when poster is missing.
	 *
	 * @group media
	 * @group video
	 * @group video-thumbnail-html
	 */
	public function test_video_thumbnail_html_uses_fallback_for_missing_poster() {
		// Create a video attachment without poster
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video No Thumbnail',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		
		$html = $gallery_item->video_thumbnail_html();

		// Should contain fallback placeholder image
		$this->assertStringContainsString('placeholder.jpg', $html);
		$this->assertStringContainsString('Product Video', $html);
	}

	/**
	 * Test that video_attributes returns empty object for invalid attachment.
	 *
	 * @group media
	 * @group video
	 * @group video-attributes
	 */
	public function test_video_attributes_returns_empty_for_invalid_attachment() {
		$gallery_item = new GalleryItemVideoAttachment(['id' => 99999]);
		
		$attributes = $gallery_item->video_attributes();
		
		$this->assertIsObject($attributes);
		$this->assertEquals((object) [], $attributes);
	}

	/**
	 * Test video methods with different aspect ratio formats.
	 *
	 * @group media
	 * @group video
	 * @group video-html
	 */
	public function test_video_html_with_different_aspect_ratios() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Aspect Ratios',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		// Test different aspect ratios
		$aspect_ratios = ['16:9', '1:1', '4:3', '21:9'];
		
		foreach ($aspect_ratios as $ratio) {
			$gallery_item->setMetadata('aspect_ratio', $ratio);
			$html = $gallery_item->video_html();
			
			$this->assertIsString($html);
			$this->assertNotEmpty($html);
			$this->assertStringContainsString("aspect-ratio: $ratio;", $html);
		}
	}

	/**
	 * Test that methods handle empty metadata gracefully.
	 *
	 * @group media
	 * @group video
	 */
	public function test_handles_empty_metadata_gracefully() {
		// Create a poster image attachment
		$filename = DIR_TESTDATA . '/images/test-image.jpg';
		$poster_id = self::factory()->attachment->create_upload_object($filename);
		
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/mp4',
			'post_title' => 'Test Video Empty Metadata',
		]);
		
		$gallery_item = new GalleryItemVideoAttachment(['id' => $video_id]);
		$gallery_item->setMetadata('thumbnail_image', ['id' => $poster_id]);
		
		// Test with empty aspect ratio - should not include style attribute
		$gallery_item->setMetadata('aspect_ratio', '');
		$html = $gallery_item->video_html();
		
		$this->assertIsString($html);
		$this->assertNotEmpty($html);
		$this->assertStringNotContainsString('aspect-ratio:', $html);
		
		// Test with null aspect ratio - should not include style attribute
		$gallery_item->setMetadata('aspect_ratio', null);
		$html = $gallery_item->video_html();
		
		$this->assertIsString($html);
		$this->assertNotEmpty($html);
		$this->assertStringNotContainsString('aspect-ratio:', $html);
	}

	/**
	 * Test instantiation with different parameter types.
	 *
	 * @group media
	 * @group video
	 */
	public function test_can_instantiate_with_different_parameter_types() {
		// Create a video attachment
		$video_id = self::factory()->attachment->create([
			'post_mime_type' => 'video/webm',
			'post_title' => 'Test Video Multiple Types',
		]);
		
		// Test with integer ID
		$gallery_item_int = new GalleryItemVideoAttachment($video_id);
		$this->assertInstanceOf(GalleryItemVideoAttachment::class, $gallery_item_int);
		$this->assertEquals($video_id, $gallery_item_int->id);
		
		// Test with array containing ID
		$gallery_item_array = new GalleryItemVideoAttachment(['id' => $video_id]);
		$this->assertInstanceOf(GalleryItemVideoAttachment::class, $gallery_item_array);
		$this->assertEquals($video_id, $gallery_item_array->id);
		
		// Test with WP_Post object
		$post = get_post($video_id);
		$gallery_item_post = new GalleryItemVideoAttachment($post);
		$this->assertInstanceOf(GalleryItemVideoAttachment::class, $gallery_item_post);
		$this->assertEquals($video_id, $gallery_item_post->id);
	}
}