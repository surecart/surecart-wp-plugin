/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * Internal dependencies.
 */
import { ScIcon } from '@surecart/components-react';
import VariantImage from './VariantImage';
import WordPressMedia from './WordPressMedia';

const ALLOWED_MEDIA_TYPES = ['image'];

export default ({ variant, onAdd, onRemove, value, size = '36px' }) => {
	// handle image.
	if (variant?.metadata?.wp_media) {
		return (
			<WordPressMedia
				id={variant.metadata.wp_media}
				size={size}
				onRemove={onRemove}
			/>
		);
	}

	// handle fallback.
	if (variant?.image_url) {
		return (
			<VariantImage variant={variant} onRemove={onRemove} size={size} />
		);
	}

	return (
		<MediaUpload
			title={__('Select Media', 'surecart')}
			onSelect={onAdd}
			value={value}
			multiple={true}
			allowedTypes={ALLOWED_MEDIA_TYPES}
			render={({ open }) => (
				<div
					css={css`
						width: ${size};
						height: ${size};
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						background: var(--sc-choice-background-color);
						border: var(--sc-choice-border);
						border-radius: var(--sc-border-radius-medium);
						border-style: dashed;
						display: flex;
						flex-direction: column;
						justify-content: center;
						cursor: pointer;
						transition: background-color var(--sc-transition-medium)
							ease-in-out;
						&:hover {
							background: var(--sc-color-gray-100);
						}
					`}
					onClick={open}
				>
					<ScIcon
						name="image"
						style={{
							color: 'var(--sc-color-gray-400)',
							width: '18px',
							height: '18px',
						}}
					/>
				</div>
			)}
		/>
	);
};
