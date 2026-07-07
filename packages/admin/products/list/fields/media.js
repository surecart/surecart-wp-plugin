/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { ScIcon } from '@surecart/components-react';

// Reads `line_item_image.src` matching `ProductThumbnail`'s contract
// (`.type === 'fallback'` means no real image was set).
export default () => ({
	id: 'media',
	label: __('Image', 'surecart'),
	enableSorting: false,
	enableHiding: true,
	getValue: ({ item }) => {
		const image = item?.line_item_image;
		return image?.src && image.type !== 'fallback' ? image.src : '';
	},
	render: ({ item }) => {
		const image = item?.line_item_image;
		const hasImage = image?.src && image.type !== 'fallback';

		if (hasImage) {
			return (
				<img
					src={image.src}
					alt={item?.name || ''}
					css={css`
						width: 100%;
						aspect-ratio: 1;
						object-fit: cover;
						display: block;
						background: var(--sc-color-gray-100, #f3f4f6);
					`}
				/>
			);
		}

		return (
			<div
				css={css`
					width: 100%;
					aspect-ratio: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--sc-color-gray-100, #f3f4f6);
					color: var(--sc-color-gray-400, #9ca3af);
				`}
			>
				<ScIcon
					name="image"
					style={{
						width: '32px',
						height: '32px',
					}}
				/>
			</div>
		);
	},
});
