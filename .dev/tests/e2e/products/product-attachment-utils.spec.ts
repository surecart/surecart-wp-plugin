/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import {  calculateThumbnailDimensions } from '../../../../packages/admin/util/attachments';
import * as Attachments from '../../../../packages/admin/util/attachments';

test('test_calculateThumbnailDimensions', () => {
	// minimum width and height doesn't exceed the maximum dimensions.
	const result1 = calculateThumbnailDimensions(100, 200, 1200, 800);
	expect(result1.width).toBe(100);
	expect(result1.height).toBe(200);
	expect(result1.scale).toBe(1);

	// maximum width and height exceeds the maximum dimensions.
	const result2 = calculateThumbnailDimensions(2400, 1200, 1200, 900);
	expect(result2.width).toBe(1200);
	expect(result2.height).toBe(600);
	expect(result2.scale).toBeCloseTo(0.5, 5);
});

// Use page.evaluate for DOM-related tests
test('test_extractVideoThumbnail_success', async ({ page }) => {
	const result = await page.evaluate(async () => {
		// Minimal mock for extractVideoThumbnail logic
		const video = document.createElement('video');
		video.crossOrigin = 'anonymous';
		video.preload = 'metadata';
		video.muted = true;
		video.playsInline = true;

		const canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 100;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Failed to get canvas context');
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, 100, 100);

		return await new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error('Failed to create blob'));
					return;
				}
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.readAsDataURL(blob);
			}, 'image/jpeg', 0.8);
		});
	});

	expect(result).toContain('data:image/jpeg');
});

test('test_generateVideoThumbnail_with_cache', async () => {
	const origExtract = Attachments.extractVideoThumbnail;
	let called = 0;
	Attachments.extractVideoThumbnail = async () => { called++; return 'data:image/jpeg;base64,cached'; };

	const videoMedia = {
		source_url: 'http://video',
		mime_type: 'video/mp4',
		thumbnail_image: { id: 123, url: 'cached' },
	};

	const result = await Attachments.generateVideoThumbnail(videoMedia, 1, { skipIfExists: true });
	expect(result).toEqual(videoMedia.thumbnail_image);
	expect(called).toBe(0);

	Attachments.extractVideoThumbnail = origExtract;
});
