/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScSkeleton, ScTag } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { MediaUpload } from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { SortableKnob } from 'react-easy-sort';
const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ id, isNew, onRemove, isFeatured, onSelect }) => {
	const { invalidateResolution } = useDispatch(coreStore);

	const { media, hasLoadedMedia } = useSelect((select) => {
		return {
			media: select(coreStore).getMedia(id),
			hasLoadedMedia: select(coreStore).hasFinishedResolution(
				'getMedia',
				[id]
			),
		};
	});

	console.log('media', media);

	if (hasLoadedMedia && !media) {
		return (
			<div
				css={css`
					.components-notice {
						aspect-ratio: 1 / 1;
						box-sizing: border-box;
						background-color: #ffecec;
						border-radius: var(--sc-border-radius-medium);
						box-shadow: var(--sc-input-box-shadow);
					}
					button.components-button.components-notice__action.is-link {
						margin: 10px 0 0 0;
					}
				`}
			>
				<Notice
					status="error"
					isDismissible={false}
					actions={[
						{
							label: __('Remove', 'surecart'),
							onClick: onRemove,
							noDefaultClasses: true,
							variant: 'link',
						},
					]}
				>
					{__(
						'This media has been deleted or is unavailable.',
						'surecart'
					)}
				</Notice>
			</div>
		);
	}

	const isVideo = media?.mime_type?.includes('video');

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
				.delete-icon,
				.edit-icon {
					opacity: 0;
					visibility: hidden;
					transition: all var(--sc-transition-medium) ease-in-out;
				}

				:hover .overlay,
				:hover .delete-icon,
				:hover .edit-icon {
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
					`}
				>
					{__('Featured', 'surecart')}
				</ScTag>
			)}

			{isNew && (
				<ScTag
					type="success"
					className="featured-badge"
					size="small"
					css={css`
						position: absolute;
						top: ${isFeatured ? '25px' : '5px'};
						left: 5px;
					`}
				>
					{__('New', 'surecart')}
				</ScTag>
			)}

			{media?.meta?.sc_variant_option && (
				<ScTag
					className="featured-badge"
					size="small"
					css={css`
						position: absolute;
						bottom: 5px;
						left: 5px;

						&::part(content) {
							max-width: 140px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							display: inline;
						}
					`}
				>
					{media?.meta?.sc_variant_option}
				</ScTag>
			)}

			<ScIcon
				className="delete-icon"
				onClick={onRemove}
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

			<MediaUpload
				addToGallery={false}
				multiple={false}
				value={id}
				onSelect={onSelect}
				allowedTypes={ALLOWED_MEDIA_TYPES}
				onClose={() => invalidateResolution('getMedia', [id])}
				render={({ open }) => (
					<ScIcon
						className="edit-icon"
						css={css`
							position: absolute;
							bottom: 4px;
							right: 4px;
							z-index: 10;
							cursor: pointer;
							padding: var(--sc-spacing-small);
							font-size: var(--sc-font-size-small);
							border-radius: var(--sc-border-radius-small);
							color: var(--sc-color-gray-800);
							font-weight: var(--sc-font-weight-semibold);
							background-color: var(--sc-color-white);
							border-radius: var(--sc-border-radius-small);
						`}
						name="edit-2"
						onClick={open}
					/>
				)}
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

			{media?.source_url ? (
				isVideo ? (
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
							controls={false}
							css={css`
								max-width: 100%;
								max-height: 100%;
								object-fit: contain;
								border-radius: var(--sc-border-radius-medium);
								pointer-events: none;
							`}
							src={media?.source_url}
							muted
							loop
							playsInline
							{...(media?.thumbnail_url
								? { poster: media?.thumbnail_url }
								: {})}
						>
							<source
								type={media?.mime_type}
								src={media?.source_url}
							/>
						</video>
						<ScIcon
							css={css`
								position: absolute;
								color: var(--sc-color-white);
								background-color: rgba(0, 0, 0, 0.5);
								border-radius: 50%;
								padding: var(--sc-spacing-small);
								width: 40px;
								height: 40px;
							`}
							name="play"
						/>
					</div>
				) : (
					<img
						src={
							media?.media_details?.sizes?.medium?.source_url ||
							media?.source_url
						}
						css={css`
							max-width: 100%;
							aspect-ratio: 1 / 1;
							object-fit: contain;
							height: auto;
							display: block;
							border-radius: var(--sc-border-radius-medium);
							pointer-events: none;
						`}
						alt={media?.alt_text}
						{...(media?.title?.rendered
							? { title: media?.title?.rendered }
							: {})}
						loading="lazy"
					/>
				)
			) : (
				<ScSkeleton
					style={{
						aspectRatio: '1 / 1',
						'--border-radius': 'var(--sc-border-radius-medium)',
					}}
				/>
			)}
		</div>
	);
};
