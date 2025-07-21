/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { closeSmall, edit } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScSelect,
	ScSkeleton,
	ScText,
} from '@surecart/components-react';
import {
	generateVideoThumbnail,
	aspectRatioChoices,
} from '../../../util/attachments';

export default ({
	thumbnailImage,
	onThumbnailChange,
	aspectRatio,
	onAspectRatioChange,
	mediaData,
}) => {
	const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
	const [thumbnailError, setThumbnailError] = useState(null);

	const { videoThumbnail, thumbnailLoading } = useSelect((select) => {
		if (!thumbnailImage?.id) {
			return {
				videoThumbnail: null,
				thumbnailLoading: false,
			};
		}

		return {
			videoThumbnail: select(coreStore).getMedia(thumbnailImage.id),
			thumbnailLoading: !select(coreStore).hasFinishedResolution(
				'getMedia',
				[thumbnailImage.id]
			),
		};
	});

	const thumbnailTitle =
		videoThumbnail?.title?.rendered ||
		videoThumbnail?.title ||
		videoThumbnail?.alt ||
		'';

	const selectThumbnail = (thumbnail) => {
		onThumbnailChange(
			thumbnail
				? {
						id: thumbnail.id,
						url: thumbnail.source_url || thumbnail.url,
				  }
				: null
		);
	};

	const handleGenerateThumbnail = async () => {
		if (!mediaData?.id) {
			return;
		}

		try {
			setIsGeneratingThumbnail(true);
			setThumbnailError(null);

			const thumbnailMedia = await generateVideoThumbnail(mediaData);

			if (thumbnailMedia) {
				onThumbnailChange({
					id: thumbnailMedia.id,
					url: thumbnailMedia.source_url || thumbnailMedia.url,
				});
			}
		} catch (error) {
			console.error('Failed to generate thumbnail:', error);
			setThumbnailError(
				error?.message ||
					__(
						'Failed to generate video thumbnail. Please try again.',
						'surecart'
					)
			);
		} finally {
			setIsGeneratingThumbnail(false);
		}
	};

	const renderExistingThumbnail = () => {
		if (!videoThumbnail?.id) return null;

		return (
			<div
				css={css`
					display: flex;
					justify-content: space-between;
					gap: var(--sc-spacing-small);
					border: 1px solid var(--sc-color-gray-200);
					border-radius: 4px;
					padding: var(--sc-spacing-small);
				`}
			>
				<div
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
						gap: var(--sc-spacing-x-small);
						max-width: 100%;
					`}
				>
					<div
						css={css`
							width: auto;
							max-width: 100px;
							overflow: hidden;
						`}
					>
						<img
							src={
								videoThumbnail?.media_details?.sizes?.medium
									?.source_url || videoThumbnail?.source_url
							}
							css={css`
								max-width: 100%;
								max-height: 60px;
								object-fit: contain;
								display: block;
								border-radius: var(--sc-border-radius-medium);
								pointer-events: none;
							`}
							alt={
								videoThumbnail?.alt_text ||
								videoThumbnail?.alt ||
								''
							}
							{...(!!thumbnailTitle
								? {
										title: thumbnailTitle,
								  }
								: {})}
							loading="lazy"
						/>
					</div>
					<ScText
						css={css`
							max-width: 180px;
						`}
						tag="p"
						truncate
						title={thumbnailTitle}
					>
						{thumbnailTitle}
					</ScText>
				</div>

				<div
					css={css`
						display: flex;
						justify-content: flex-end;
						align-items: center;
						gap: var(--sc-spacing-x-small);
						margin: var(--sc-spacing-small) 0px;
					`}
				>
					<MediaUpload
						title={__('Change Thumbnail', 'surecart')}
						onSelect={selectThumbnail}
						value={videoThumbnail?.id ?? null}
						multiple={false}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button
								icon={edit}
								label={__('Change Thumbnail', 'surecart')}
								showTooltip={true}
								size="compact"
								onClick={open}
							/>
						)}
					/>
					<Button
						icon={closeSmall}
						label={__('Remove Thumbnail', 'surecart')}
						showTooltip={true}
						size="compact"
						onClick={() => selectThumbnail(null)}
					/>
				</div>
			</div>
		);
	};

	const renderThumbnailActions = () => {
		return (
			<div
				css={css`
					display: flex;
					gap: var(--sc-spacing-small);
					width: 100%;
				`}
			>
				<MediaUpload
					title={__('Select Thumbnail', 'surecart')}
					onSelect={selectThumbnail}
					value={videoThumbnail?.id ?? ''}
					multiple={false}
					allowedTypes={['image']}
					render={({ open }) => (
						<ScButton
							type="default"
							onClick={open}
							css={css`
								flex: 1;
							`}
						>
							<ScIcon name="upload" slot="suffix"></ScIcon>
							{__('Select from Library', 'surecart')}
						</ScButton>
					)}
				/>

				<ScButton
					type="default"
					onClick={handleGenerateThumbnail}
					disabled={isGeneratingThumbnail}
					loading={isGeneratingThumbnail}
					css={css`
						flex: 1;
					`}
				>
					{__('Generate Thumbnail', 'surecart')}
					<ScIcon name="refresh-cw" slot="suffix"></ScIcon>
				</ScButton>
			</div>
		);
	};

	return (
		<>
			<ScFormControl label={__('Thumbnail', 'surecart')}>
				{thumbnailError && (
					<div
						css={css`
							color: var(--sc-color-danger-500);
							font-size: var(--sc-font-size-small);
							margin-bottom: var(--sc-spacing-small);
						`}
					>
						{thumbnailError}
					</div>
				)}
				{!(thumbnailLoading || isGeneratingThumbnail) ? (
					<>{renderExistingThumbnail() || renderThumbnailActions()}</>
				) : (
					<ScSkeleton
						style={{
							height: '60px',
							'--border-radius': 'var(--sc-border-radius-small)',
						}}
					/>
				)}
			</ScFormControl>

			<ScSelect
				label={__('Aspect Ratio', 'surecart')}
				value={aspectRatio}
				placement="top-start"
				placeholder={__('Select aspect ratio', 'surecart')}
				choices={aspectRatioChoices}
				onScChange={(e) => onAspectRatioChange(e.target.value)}
			/>
		</>
	);
};
