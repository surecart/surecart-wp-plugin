/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import MediaLibrary from '../../../components/MediaLibrary';

export default ({ onAddMedia, existingMediaIds = [], children }) => {
	return (
		<MediaLibrary
			onSelect={onAddMedia}
			isPrivate={false}
			isMultiSelect={false}
			disabled={existingMediaIds}
			render={({ setOpen }) => {
				return (
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
							cursor: pointer;
							transition: background-color
								var(--sc-transition-medium) ease-in-out;
							&:hover {
								background: var(--sc-color-gray-100);
							}
						`}
						onClick={() => setOpen(true)}
					>
						{children}
					</div>
				);
			}}
		/>
	);
};
