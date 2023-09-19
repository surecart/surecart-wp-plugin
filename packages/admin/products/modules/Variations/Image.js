/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import MediaLibrary from '../../../components/MediaLibrary';
import { ScIcon } from '@surecart/components-react';

export default ({ variant, onAdd, onRemove, existingMediaIds = [] }) => {
	const style = css`
		width: 35px;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: var(--sc-choice-background-color);
		border: var(--sc-choice-border);
		border-radius: var(--sc-border-radius-medium);
		border-style: ${!variant?.image_url ? 'dashed' : 'solid'};
		display: flex;
		flex-direction: column;
		justify-content: center;
		cursor: pointer;
		transition: background-color var(--sc-transition-medium) ease-in-out;
		&:hover {
			background: var(--sc-color-gray-100);
		}
	`;

	if (variant?.image_url) {
		return (
			<div
				css={css`
					position: relative;
					padding: 10px;
					margin: -10px;
					.sc-remove-icon {
						visibility: hidden;
						opacity: 0;
						transition: all 0.25s ease-in-out;
					}

					&:hover {
						.sc-remove-icon {
							visibility: visible;
							opacity: 1;
						}
					}
				`}
				onClick={onRemove}
				aria-label="Delete image"
				title="Delete image"
			>
				<div css={style}>
					<img
						src={variant?.image_url}
						alt={sprintf(__('Image of %s', 'sc'), variant?.name)}
						css={css`
							width: 35px;
							height: 35px;
						`}
					/>
				</div>
				<div
					css={css`
						cursor: pointer;
						background: var(--sc-color-gray-800);
						color: white;
						width: 18px;
						height: 18px;
						font-size: 10px;
						position: absolute;
						right: 0px;
						top: 0px;
						border-radius: 999px;
						display: flex;
						align-items: center;
						justify-content: center;
					`}
					className="sc-remove-icon"
					onClick={onRemove}
				>
					<ScIcon name="trash" slot="suffix" />
				</div>
			</div>
		);
	}

	return (
		<MediaLibrary
			onSelect={onAdd}
			isPrivate={false}
			isMultiSelect={false}
			disabled={existingMediaIds}
			render={({ setOpen }) => {
				return (
					<div css={style} onClick={() => setOpen(true)}>
						<ScIcon
							name="image"
							style={{
								color: 'var(--sc-color-gray-400)',
								width: '18px',
								height: '18px',
							}}
						/>
					</div>
				);
			}}
		/>
	);
};
