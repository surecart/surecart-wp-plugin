/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export const aspectRatioChoices = [
	{
		label: __('Original', 'surecart'),
		value: 'auto',
	},
	{
		label: __('Square - 1:1', 'surecart'),
		value: '1',
	},
	{
		label: __('Standard - 4:3', 'surecart'),
		value: '4/3',
	},
	{
		label: __('Portrait - 3:4', 'surecart'),
		value: '3/4',
	},
	{
		label: __('Classic - 3:2', 'surecart'),
		value: '3/2',
	},
	{
		label: __('Classic Portrait - 2:3', 'surecart'),
		value: '2/3',
	},
	{
		label: __('Wide - 16:9', 'surecart'),
		value: '16/9',
	},
	{
		label: __('Tall - 9:16', 'surecart'),
		value: '9/16',
	},
];

export const updateAttachmentMeta = async (attachmentId, media) => {
	const response = await fetch(`/wp-json/wp/v2/media/${attachmentId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': wpApiSettings.nonce,
		},
		body: JSON.stringify(media),
	});

	return response.json();
};

export const normalizeMedia = (media) => {
	if (!media) {
		return null;
	}

	return {
		...media,
		mime_type: media?.mime || media?.mime_type,
		source_url: media?.source_url || media?.url,
		alt_text: media?.alt_text || media?.alt,
		thumb: media?.sizes?.medium
			? {
					src: media.sizes.medium.url,
			  }
			: media?.thumb,
		media_details: media?.media_details || {
			sizes: media?.sizes
				? {
						medium: media.sizes.medium,
				  }
				: {},
		},
	};
};

/**
 * Extract thumbnail from video file.
 *
 * @param {string} videoUrl - URL of the video.
 * @param {number} seekTime - Time in seconds to capture frame (default: 1).
 *
 * @returns {Promise<string>} - Base64 encoded PNG thumbnail.
 */
export const extractVideoThumbnail = (videoUrl, seekTime = 1) => {
	return new Promise((resolve, reject) => {
		// Create video element.
		const video = document.createElement('video');
		video.crossOrigin = 'anonymous';
		video.preload = 'metadata';
		video.muted = true;
		video.playsInline = true;

		// Handle video load errors.
		video.onerror = () => {
			reject(new Error('Failed to load video'));
		};

		// When video metadata is loaded.
		video.onloadeddata = function () {
			// Seek to the specified time.
			video.currentTime = Math.min(seekTime, video.duration || 1);
		};

		// When seeking is complete, extract the frame.
		video.onseeked = function () {
			try {
				// Create canvas element.
				const canvas = document.createElement('canvas');
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;

				// Draw video frame on canvas.
				const ctx = canvas.getContext('2d');
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				// Convert to base64 PNG.
				const dataURL = canvas.toDataURL('image/png');

				// Cleanup.
				video.remove();
				canvas.remove();

				resolve(dataURL);
			} catch (error) {
				reject(error);
			}
		};

		// Set video source.
		video.src = videoUrl;
	});
};

/**
 * Upload base64 thumbnail to WordPress media library using REST API.
 *
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} filename - Filename for the thumbnail
 *
 * @returns {Promise<Object>} - WordPress media object (JSON).
 */
export const uploadThumbnailToMediaRestApi = async (
	base64Data,
	filename = 'video-thumbnail.png'
) => {
	// Convert base64 to Blob.
	const response = await fetch(base64Data);
	const blob = await response.blob();

	// Create FormData.
	const formData = new FormData();
	formData.append('file', blob, filename);

	// Upload to WordPress REST API.
	const uploadResponse = await fetch(wpApiSettings.root + 'wp/v2/media', {
		method: 'POST',
		headers: {
			'X-WP-Nonce': wpApiSettings.nonce,
		},
		body: formData,
	});

	if (!uploadResponse.ok) {
		const errorData = await uploadResponse.json();
		throw new Error(
			`Failed to upload thumbnail via REST API: ${uploadResponse.status} ${uploadResponse.statusText}. Code: ${errorData.code}, Message: ${errorData.message}`
		);
	}

	// Parse the JSON response.
	return await uploadResponse.json();
};

/**
 * Generate and upload video thumbnail automatically.
 *
 * @param {Object} videoMedia - Video media object.
 * @param {number} seekTime - Time in seconds to capture frame.
 *
 * @returns {Promise<Object>} - Thumbnail media object.
 */
export const generateVideoThumbnail = async (videoMedia, seekTime = 1) => {
	if (!videoMedia?.source_url || !videoMedia?.mime_type?.includes('video')) {
		throw new Error('Invalid video media object');
	}

	try {
		// Extract thumbnail from video.
		const thumbnailBase64 = await extractVideoThumbnail(
			videoMedia.source_url,
			seekTime
		);

		// Generate filename.
		const videoName =
			videoMedia.title?.rendered || videoMedia?.title || 'video';
		const filename = `${videoName.replace(
			/[^a-zA-Z0-9]/g,
			'_'
		)}_thumbnail_${Date.now()}.png`;

		// Upload thumbnail to media library.
		return await uploadThumbnailToMediaRestApi(thumbnailBase64, filename);
	} catch (error) {
		console.error('Failed to generate video thumbnail:', error);
		throw error;
	}
};

/**
 * Check if media is a video.
 *
 * @param {Object} media - Media object.
 *
 * @returns {boolean}
 */
export const isVideoMedia = (media) =>
	(media?.mime_type || media?.mime)?.includes('video');

/**
 * Normalize gallery item to ensure consistent structure.
 *
 * @param {number|Object} item - Gallery item (can be integer ID or object)
 * @returns {Object} - Normalized gallery item object
 */
export const normalizeGalleryItem = (item) => {
	if (typeof item === 'number' || typeof item === 'string') {
		return {
			id: parseInt(item),
			variant_option: null,
			thumbnail_image: null,
			aspect_ratio: null,
		};
	}

	if (typeof item === 'object' && item !== null) {
		return {
			id: parseInt(item.id || 0),
			variant_option:
				item.variant_option || item?.meta?.sc_variant_option || null,
			thumbnail_image: item.thumbnail_image || null,
			aspect_ratio: item.aspect_ratio || null,
		};
	}

	return {
		id: 0,
		variant_option: null,
		thumbnail_image: null,
		aspect_ratio: null,
	};
};

/**
 * Get the ID from a gallery item (handles both integer and object formats).
 *
 * @param {number|Object} item - Gallery item
 * @returns {number} - The media ID
 */
export const getGalleryItemId = (item) => {
	return typeof item === 'object' ? item?.id : parseInt(item);
};

/**
 * Check if gallery item is an object with additional properties.
 *
 * @param {number|Object} item - Gallery item
 * @returns {boolean} - True if item is an object with properties
 */
export const isComplexGalleryItem = (item) => {
	return (
		typeof item === 'object' &&
		item !== null &&
		(item.variant_option || item.thumbnail_image || item.aspect_ratio)
	);
};

/**
 * Create a gallery item object with the specified properties.
 *
 * @param {number} id - Media ID
 * @param {Object} properties - Additional properties
 * @returns {number|Object} - Gallery item (returns just ID if no properties, otherwise object)
 */
export const createGalleryItem = (id, properties = {}) => {
	const { variant_option, thumbnail_image, aspect_ratio } = properties;

	// If no additional properties, return just the ID
	if (!variant_option && !thumbnail_image && !aspect_ratio) {
		return parseInt(id);
	}

	// Return object with properties
	const item = { id: parseInt(id) };
	if (variant_option) item.variant_option = variant_option;
	if (thumbnail_image) item.thumbnail_image = thumbnail_image;
	if (aspect_ratio) item.aspect_ratio = aspect_ratio;

	return item;
};

/**
 * Update a gallery item's properties.
 *
 * @param {number|Object} item - Existing gallery item
 * @param {Object} updates - Properties to update
 * @returns {number|Object} - Updated gallery item
 */
export const updateGalleryItem = (item, updates = {}) => {
	const normalized = normalizeGalleryItem(item);
	const updated = { ...normalized, ...updates };

	return createGalleryItem(updated.id, {
		variant_option: updated.variant_option,
		thumbnail_image: updated.thumbnail_image,
		aspect_ratio: updated.aspect_ratio,
	});
};
