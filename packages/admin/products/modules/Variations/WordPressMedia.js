/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScSkeleton, ScTag } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

export default ({ id, onRemove, size = '36px' }) => {
	const { media, hasLoadedMedia } = useSelect((select) => {
		return {
			media: select(coreStore).getMedia(id),
			hasLoadedMedia: select(coreStore).hasFinishedResolution(
				'getMedia',
				[id]
			),
		};
	});

	return (
		<div
			css={css`
				position: relative;
				width: ${size};
				height: ${size};
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
			aria-label={__('Delete image', 'surecart')}
			title={__('Delete image', 'surecart')}
		>
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
					border-style: ${!media?.source_url ? 'dashed' : 'solid'};
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
			>
				{!hasLoadedMedia ? (
					<ScSkeleton
						style={{
							aspectRatio: '1 / 1',
							'--border-radius': 'var(--sc-border-radius-medium)',
						}}
					/>
				) : (
					<img
						src={
							media?.media_details?.sizes?.medium?.source_url ||
							media?.source_url
						}
						css={css`
							width: ${size};
							height: ${size};
							object-fit: cover;
						`}
						alt={media?.alt_text}
						{...(media?.title?.rendered
							? { title: media?.title?.rendered }
							: {})}
					/>
				)}
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
					right: -5px;
					top: -5px;
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
};
