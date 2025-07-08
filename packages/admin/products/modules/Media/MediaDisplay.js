/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Download from './Download';
import { SortableKnob } from 'react-easy-sort';
import { isVideoMedia } from '../../../util/attachments';

export default ({ productMedia, onDeleteImage, onDownloaded, isFeatured }) => {
	return (
		<div
			css={css`
				background: #f3f3f3;
				position: relative;
				border-radius: var(--sc-border-radius-medium);
				border: var(--sc-input-border);
				box-shadow: var(--sc-input-box-shadow);
				aspect-ratio: 1 / 1;

				.overlay,
				.delete-icon {
					opacity: 0;
					visibility: hidden;
					transition: all var(--sc-transition-medium) ease-in-out;
				}

				:hover .overlay,
				:hover .delete-icon {
					opacity: 1;
					visibility: visible;
				}
			`}
		>
			{isFeatured && (
				<ScTag
					type="info"
					className="featured-badge"
					size="small"
					css={css`
						position: absolute;
						top: 5px;
						left: 5px;
						z-index: 10;
					`}
				>
					{__('Featured', 'surecart')}
				</ScTag>
			)}

			<ScIcon
				className="delete-icon"
				onClick={() => onDeleteImage(productMedia)}
				css={css`
					position: absolute;
					top: 4px;
					right: 4px;
					z-index: 10;
					cursor: pointer;
					padding: var(--sc-spacing-xx-small);
					border-radius: var(--sc-border-radius-small);
					color: var(--sc-color-white);
					font-weight: var(--sc-font-weight-semibold);
					background-color: var(--sc-color-gray-800);
				`}
				name="x"
			/>

			<Download
				className="download-icon"
				css={css`
					position: absolute;
					bottom: 4px;
					right: 4px;
					line-height: 0;
					z-index: 10;
				`}
				media={productMedia}
				onDownloaded={onDownloaded}
			/>

			<SortableKnob>
				<div
					className="overlay"
					css={css`
						background-color: var(--sc-overlay-background-color);
						position: absolute;
						top: 0;
						right: 0;
						bottom: 0;
						left: 0;
						z-index: 2;
					`}
				></div>
			</SortableKnob>

			{productMedia?.url || productMedia?.media?.url ? (
				isVideoMedia(productMedia) ? (
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: center;
							height: 100%;
							width: 100%;
							position: relative;
						`}
					>
						<video
							css={css`
								max-width: 100%;
								max-height: 100%;
								object-fit: contain;
								border-radius: var(--sc-border-radius-medium);
								pointer-events: none;
							`}
							src={productMedia?.url || productMedia?.media?.url}
							muted
							loop
							autoPlay
							playsInline
						/>
						<ScIcon
							css={css`
								position: absolute;
								color: var(--sc-color-white);
								background-color: rgba(0, 0, 0, 0.5);
								border-radius: 50%;
								padding: var(--sc-spacing-small);
								width: 40px;
								height: 40px;
								z-index: 10;
							`}
							name="play"
						/>
					</div>
				) : (
					<img
						src={productMedia?.url || productMedia?.media?.url}
						css={css`
							max-width: 100%;
							aspect-ratio: 1 / 1;
							object-fit: contain;
							height: auto;
							display: block;
							border-radius: var(--sc-border-radius-medium);
							pointer-events: none;
						`}
						alt={productMedia?.media?.alt}
						{...(productMedia?.title
							? { title: productMedia?.title }
							: {})}
						loading="lazy"
					/>
				)
			) : null}
		</div>
	);
};
