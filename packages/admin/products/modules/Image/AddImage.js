/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScFlex, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
const ALLOWED_MEDIA_TYPES = ['image', 'video'];
import { MediaUpload } from '@wordpress/media-utils';

export default ({ value, onSelect, ...rest }) => {
	return (
		<MediaUpload
			title={__('Select Media', 'surecart')}
			onSelect={onSelect}
			value={value}
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
