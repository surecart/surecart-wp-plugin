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
