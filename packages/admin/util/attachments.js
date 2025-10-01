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

// Add thumbnail cache to avoid re-processing.
const thumbnailCache = new Map();

/**
 * Common thumbnail size presets
 */
export const THUMBNAIL_SIZES = {
	small: { maxWidth: 300, maxHeight: 200 },
	medium: { maxWidth: 600, maxHeight: 400 },
	large: { maxWidth: 1200, maxHeight: 800 },
	original: { maxWidth: Infinity, maxHeight: Infinity },
};

/**
 * Calculate optimal thumbnail dimensions while preserving aspect ratio
 *
 * @param {number} videoWidth - Original video width
 * @param {number} videoHeight - Original video height
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {Object} - Calculated dimensions { width, height, scale }
 */
export const calculateThumbnailDimensions = (
	videoWidth,
	videoHeight,
	maxWidth,
	maxHeight
) => {
	if (videoWidth <= maxWidth && videoHeight <= maxHeight) {
		return { width: videoWidth, height: videoHeight, scale: 1 };
	}

	const widthRatio = maxWidth / videoWidth;
	const heightRatio = maxHeight / videoHeight;

	// Use the smaller ratio to ensure both dimensions fit within limits
	const scale = Math.min(widthRatio, heightRatio);

	return {
		width: Math.round(videoWidth * scale),
		height: Math.round(videoHeight * scale),
		scale,
	};
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
 * Extract thumbnail from video file with optimizations.
 *
 * @param {string} videoUrl - URL of the video.
 * @param {number} seekTime - Time in seconds to capture frame (default: 1).
 * @param {Object} options - Optimization options.
 *
 * @returns {Promise<string>} - Base64 encoded PNG thumbnail.
 */
export const extractVideoThumbnail = (videoUrl, seekTime = 1, options = {}) => {
	const cacheKey = `${videoUrl}_${seekTime}`;
	if (thumbnailCache.has(cacheKey)) {
		return Promise.resolve(thumbnailCache.get(cacheKey));
	}

	const {
		maxWidth = 1600,
		maxHeight = 1200,
		quality = 0.8,
		format = 'png',
		timeout = 30000, // 30 seconds timeout.
	} = options;

	return new Promise((resolve, reject) => {
		let timeoutId;
		const video = document.createElement('video');
		video.crossOrigin = 'anonymous';
		video.preload = 'metadata';
		video.muted = true;
		video.playsInline = true;

		let canvas;
		let ctx;

		const cleanup = () => {
			if (timeoutId) clearTimeout(timeoutId);
			video.remove();
			if (canvas) canvas.remove();
		};

		const onError = () => {
			cleanup();
			reject(new Error(__('Failed to load video.', 'surecart')));
		};

		const captureFrame = () => {
			try {
				const dimensions = calculateThumbnailDimensions(
					video.videoWidth,
					video.videoHeight,
					maxWidth,
					maxHeight
				);

				canvas = document.createElement('canvas');
				canvas.width = dimensions.width;
				canvas.height = dimensions.height;

				ctx = canvas.getContext('2d');
				if (!ctx) {
					cleanup();
					reject(
						new Error('Failed to get canvas context.', 'surecart')
					);
					return;
				}
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'medium';
				ctx.drawImage(video, 0, 0, dimensions.width, dimensions.height);

				const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(
								new Error(
									__(
										'Failed to convert canvas to blob.',
										'surecart'
									)
								)
							);
							return;
						}
						const reader = new FileReader();
						reader.onloadend = () => {
							const dataURL = reader.result;
							thumbnailCache.set(cacheKey, dataURL);
							cleanup();
							resolve(dataURL);
						};
						reader.readAsDataURL(blob);
					},
					mimeType,
					quality
				);
			} catch (err) {
				cleanup();
				reject(err);
			}
		};

		const onLoadedMetadata = () => {
			try {
				const targetTime = Math.min(seekTime, video.duration || 1);
				video.currentTime = targetTime;
			} catch (err) {
				reject(new Error(__('Failed to seek video', 'surecart')));
			}
		};

		const onSeeked = () => {
			captureFrame();
		};

		timeoutId = setTimeout(() => {
			cleanup();
			reject(
				new Error(
					__(
						'Video processing timed out. Please try again.',
						'surecart'
					)
				)
			);
		}, timeout);

		video.addEventListener('error', onError);
		video.addEventListener('loadedmetadata', onLoadedMetadata);
		video.addEventListener('seeked', onSeeked);

		video.src = videoUrl;
		document.body.appendChild(video);
	});
};

/**
 * Upload base64 thumbnail to WordPress media library using REST API with optimizations.
 *
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} filename - Filename for the thumbnail
 * @param {Object} options - Upload options
 *
 * @returns {Promise<Object>} - WordPress media object (JSON).
 */
export const uploadThumbnailToMedia = async (
	base64Data,
	filename = 'video-thumbnail.jpg', // Default to JPEG.
	options = {}
) => {
	const { timeout = 30000 } = options;

	// Convert base64 to Blob more efficiently.
	const byteCharacters = atob(base64Data.split(',')[1]);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);
	const mimeType = base64Data.split(',')[0].split(':')[1].split(';')[0];
	const blob = new Blob([byteArray], { type: mimeType });

	// Create FormData.
	const formData = new FormData();
	formData.append('file', blob, filename);

	// Create abort controller for timeout
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		// Upload to WordPress REST API.
		const uploadResponse = await fetch(wpApiSettings.root + 'wp/v2/media', {
			method: 'POST',
			headers: {
				'X-WP-Nonce': wpApiSettings.nonce,
			},
			body: formData,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!uploadResponse.ok) {
			const errorData = await uploadResponse.json();
			throw new Error(
				`Failed to upload thumbnail via REST API: ${uploadResponse.status} ${uploadResponse.statusText}. Code: ${errorData.code}, Message: ${errorData.message}`
			);
		}

		// Parse the JSON response.
		return await uploadResponse.json();
	} catch (error) {
		clearTimeout(timeoutId);
		if (error.name === 'AbortError') {
			throw new Error('Upload timed out');
		}
		throw error;
	}
};

/**
 * Generate and upload video thumbnail automatically with optimizations.
 *
 * @param {Object} videoMedia - Video media object.
 * @param {number} seekTime - Time in seconds to capture frame.
 * @param {Object} options - Generation options.
 *
 * @returns {Promise<Object>} - Thumbnail media object.
 */
export const generateVideoThumbnail = async (
	videoMedia,
	seekTime = 1,
	options = {}
) => {
	if (!videoMedia?.source_url || !videoMedia?.mime_type?.includes('video')) {
		throw new Error(__('Invalid video media provided.', 'surecart'));
	}

	const {
		maxWidth = 800,
		maxHeight = 600,
		quality = 0.8,
		format = 'jpeg',
		skipIfExists = true,
	} = options;

	// Check if thumbnail already exists.
	if (skipIfExists && videoMedia.thumbnail_image) {
		return videoMedia.thumbnail_image;
	}

	try {
		// Extract thumbnail from video with optimizations.
		const thumbnailBase64 = await extractVideoThumbnail(
			videoMedia.source_url,
			seekTime,
			{ maxWidth, maxHeight, quality, format }
		);

		// Generate filename.
		const videoName =
			videoMedia.title?.rendered || videoMedia?.title || 'video';
		const sanitizedName = videoName.replace(/[^a-zA-Z0-9]/g, '_');
		const extension = format === 'jpeg' ? 'jpg' : 'png';
		const filename = `${sanitizedName}_thumbnail_${Date.now()}.${extension}`;

		// Upload thumbnail to media library.
		return await uploadThumbnailToMedia(thumbnailBase64, filename);
	} catch (error) {
		throw new Error(`Error generating video thumbnail: ${error.message}`);
	}
};

/**
 * Check if media is a video.
 *
 * @param {Object} media - Media object.
 *
 * @returns {boolean}
 */
export const isVideo = (media) =>
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
			autoplay: false,
			loop: false,
		};
	}

	if (typeof item === 'object' && item !== null) {
		return {
			id: parseInt(item.id || 0),
			variant_option:
				item.variant_option || item?.meta?.sc_variant_option || null,
			thumbnail_image: item.thumbnail_image || null,
			aspect_ratio: item.aspect_ratio || null,
			autoplay: item.autoplay || false,
			loop: item.loop || false,
		};
	}

	return {
		id: 0,
		variant_option: null,
		thumbnail_image: null,
		aspect_ratio: null,
		autoplay: false,
		loop: false,
	};
};

/**
 * Get the ID from a gallery item (handles both integer and object formats).
 *
 * @param {number|Object} item - Gallery item
 * @returns {number} - The media ID
 */
export const getGalleryItemId = (item) => {
	const id = typeof item === 'object' ? item?.id : item;
	return isNaN(id) ? id : parseInt(id); // ProductMedia id could be just a uuid.
};

/**
 * Create a gallery item object with the specified properties.
 *
 * @param {number} id - Media ID
 * @param {Object} properties - Additional properties
 * @returns {number|Object} - Gallery item (returns just ID if no properties, otherwise object)
 */
export const transformGalleryItem = (id, properties = {}) => {
	const { variant_option, thumbnail_image, aspect_ratio, autoplay, loop } = properties;
	return {
		id: parseInt(id),
		...(variant_option ? { variant_option } : {}),
		...(thumbnail_image ? { thumbnail_image } : {}),
		...(aspect_ratio ? { aspect_ratio } : {}),
		...(autoplay ? { autoplay } : {}),
		...(loop ? { loop } : {}),
	};
};
