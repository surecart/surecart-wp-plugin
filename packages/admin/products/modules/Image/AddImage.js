/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScFlex, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import MediaLibrary from '../../../components/MediaLibrary';

export default ({ onAddMedia, onAddFromURL, existingMediaIds = [] }) => {
	return (
		<MediaLibrary
			onSelect={onAddMedia}
			isPrivate={false}
			isMultiSelect={true}
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
							min-height: 9.3rem;
							cursor: pointer;
							transition: background-color
								var(--sc-transition-medium) ease-in-out;
							&:hover {
								background: var(--sc-color-gray-100);
							}
						`}
						onClick={() => setOpen(true)}
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
							<ScButton
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onAddFromURL();
								}}
								type="link"
								style={{
									'--sc-button-link-text-decoration':
										'underline',
								}}
							>
								{__('Add From URL', 'surecart')}
							</ScButton>
						</ScFlex>
					</div>
				);
			}}
		/>
	);
};
