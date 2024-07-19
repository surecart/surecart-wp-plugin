/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScSkeleton, ScTag } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { MediaUpload } from '@wordpress/block-editor';
const ALLOWED_MEDIA_TYPES = ['image'];

export default ({ id, onRemove, isFeatured, onSelect }) => {
	const media = useSelect((select) => {
		return select(coreStore).getMedia(id);
	});

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
						right: 5px;
					`}
				>
					{__('Featured', 'surecart')}
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
				render={({ open }) => (
					<ScIcon
						className="edit-icon"
						css={css`
							position: absolute;
							bottom: 4px;
							left: 4px;
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
						onMouseDown={(e) => {
							e.stopPropagation(); // prevents sortable from being triggered
						}}
					/>
				)}
			/>

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

			{media?.source_url ? (
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
				/>
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
