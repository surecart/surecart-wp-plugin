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
import { ScFlex, ScTag } from '@surecart/components-react';
import { getGalleryItemId, createGalleryItem } from '../../../util/attachments';

const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ value, onSelect, ...rest }) => {
	const handleSelect = (media) => {
		const existingIds = (value || []).map(getGalleryItemId);
		const newMedia = (media || []).filter(
			({ id }) => !existingIds.includes(id)
		);

		// Preserve existing gallery items and add new ones as objects.
		const newGalleryItems = newMedia.map(({ id }) => createGalleryItem(id));
		const updatedGallery = [...(value || []), ...newGalleryItems];

		onSelect(updatedGallery);
	};

	return (
		<MediaUpload
			title={__('Select Media', 'surecart')}
			onSelect={handleSelect}
			value={(value || []).map(getGalleryItemId)}
			multiple={'add'}
			allowedTypes={ALLOWED_MEDIA_TYPES}
			render={({ open }) => (
				<div
					className="cancel-sortable"
					css={css`
						background: var(--sc-choice-background-color);
						border: var(--sc-choice-border);
						border-radius: var(--sc-border-radius-medium);
						border-style: dashed;
						display: flex;
						flex-direction: column;
						justify-content: center;
						min-height: 9.3rem;
						cursor: pointer;
						transition: background-color var(--sc-transition-medium)
							ease-in-out;
						&:hover {
							background: var(--sc-color-gray-100);
						}
					`}
					onClick={open}
				>
					<ScFlex
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						css={css`
							margin-top: auto;
							margin-bottom: auto;
						`}
					>
						<ScTag>{__('Add', 'surecart')}</ScTag>
					</ScFlex>
				</div>
			)}
			{...rest}
		/>
	);
};
