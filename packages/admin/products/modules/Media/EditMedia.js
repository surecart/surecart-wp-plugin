/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { closeSmall, edit } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import UploadMedia from './UploadMedia';
import MediaDisplayPreview from './MediaDisplayPreview';
import Error from '../../../components/Error';
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScFormControl,
	ScIcon,
	ScSelect,
	ScSkeleton,
	ScText,
} from '@surecart/components-react';
import {
	aspectRatioChoices,
	normalizeMedia,
	updateAttachmentMeta,
} from '../../../util/attachments';

const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ media, setMedia, product, onSave, open, onRequestClose }) => {
	const [mediaData, setMediaData] = useState(media || '');
	const [error, setError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [variation, setVariation] = useState('');
	const [videoThumbnailId, setVideoThumbnailId] = useState(
		media?.meta?.sc_video_thumbnail || null
	);
	const [videoThumbnailAspectRatio, setVideoThumbnailAspectRatio] =
		useState('');

	useEffect(() => {
		if (media) {
			setMediaData(normalizeMedia(media));
			setVariation(media?.meta?.sc_variant_option || '');
			setVideoThumbnailId(media?.meta?.sc_video_thumbnail || null);
			setVideoThumbnailAspectRatio(
				media?.meta?.sc_video_thumbnail_aspect_ratio || ''
			);
		}
	}, [media]);

	const { videoThumbnail, thumbnailLoading } = useSelect((select) => {
		if (!videoThumbnailId) {
			return {
				videoThumbnail: null,
				thumbnailLoading: false,
			};
		}

		return {
			videoThumbnail: select(coreStore).getMedia(videoThumbnailId),
			thumbnailLoading: !select(coreStore).hasFinishedResolution(
				'getMedia',
				[videoThumbnailId]
			),
		};
	});

	const onSubmit = async (event) => {
		event.preventDefault();
		if (!mediaData?.id) {
			setError(__('Please select a media item.', 'surecart'));
			return;
		}

		try {
			setIsSaving(true);
			setError(null);

			// Update the media in the parent component
			const meta = {
				sc_variant_option: variation || '',
				sc_video_thumbnail: videoThumbnail?.id || null,
				sc_video_thumbnail_aspect_ratio:
					videoThumbnailAspectRatio || null,
			};

			// Update product media data.
			onSave({
				...mediaData,
				meta,
			});

			// Update the attachment meta in the WordPress.
			await updateAttachmentMeta(mediaData.id, {
				meta,
				...(meta?.sc_video_thumbnail
					? { featured_media: meta.sc_video_thumbnail }
					: {}),
			});

			// Close the drawer
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(
				e?.message ||
					__('An error occurred while updating media.', 'surecart')
			);
		} finally {
			setIsSaving(false);
		}
	};

	const selectMedia = (updatedMedia) => {
		setMediaData(normalizeMedia(updatedMedia));
	};

	const selectThumbnail = (thumbnail) => {
		setMediaData({
			...mediaData,
			meta: {
				...mediaData.meta,
				sc_video_thumbnail: thumbnail?.id || null,
			},
		});
		setVideoThumbnailId(thumbnail?.id || null);
	};

	const isVideo = mediaData?.mime_type?.includes('video');

	return (
		<ScForm onScFormSubmit={onSubmit}>
			<ScDrawer
				label={__('Edit Media', 'surecart')}
				style={{
					'--sc-drawer-size': '28rem',
					'--sc-input-label-margin': 'var(--sc-spacing-small)',
				}}
				onScRequestClose={onRequestClose}
				open={open}
				stickyHeader
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						height: 100%;
						background: var(--sc-color-gray-50);
					`}
				>
					<div
						css={css`
							padding: 30px;
							display: grid;
							gap: 2em;
						`}
					>
						<Error error={error} setError={setError} />

						<ScFormControl
							label={__('Select Media', 'surecart')}
							required
						>
							{!!mediaData?.id && (
								<>
									{typeof mediaData?.id === 'string' ? (
										<div>Handle Product Media</div>
									) : (
										<>
											<MediaDisplayPreview
												media={mediaData}
											/>

											<div
												css={css`
													display: flex;
													justify-content: flex-end;
													align-items: center;
													gap: var(
														--sc-spacing-x-small
													);
													margin: var(
															--sc-spacing-small
														)
														0px;
												`}
											>
												<MediaUpload
													addToGallery={false}
													multiple={false}
													value={mediaData?.id ?? ''}
													onSelect={selectMedia}
													allowedTypes={
														ALLOWED_MEDIA_TYPES
													}
													onClose={() => {}}
													render={({ open }) => (
														<Button
															onClick={open}
															icon={edit}
															variant="secondary"
														>
															{__(
																'Change',
																'surecart'
															)}
														</Button>
													)}
												/>

												<Button
													icon={closeSmall}
													variant="secondary"
													onClick={() => {
														setMedia(null);
														setMediaData(null);
														setVariation(null);
														setVideoThumbnailId(
															null
														);
														selectThumbnail(null);
													}}
													isDestructive
												>
													{__('Remove', 'surecart')}
												</Button>
											</div>
										</>
									)}
								</>
							)}

							{!mediaData?.id && (
								<UploadMedia
									value={mediaData?.id ?? ''}
									onSelect={selectMedia}
								/>
							)}
						</ScFormControl>

						{mediaData?.id && (
							<>
								<ScFormControl
									label={__('Select Variation', 'surecart')}
								>
									<ScSelect
										value={variation}
										choices={(
											product?.variant_options || []
										).flatMap((v) =>
											v.values.map((val) => ({
												label: val,
												value: val,
											}))
										)}
										style={{ width: '100%' }}
										placeholder={__(
											'Select Variation',
											'surecart'
										)}
										onScChange={(e) =>
											setVariation(e.target.value)
										}
									/>
								</ScFormControl>

								{isVideo && (
									<>
										<ScFormControl
											label={__('Thumbnail', 'surecart')}
										>
											{!!videoThumbnail?.id ? (
												<div
													css={css`
														display: flex;
														justify-content: space-between;
														gap: var(
															--sc-spacing-small
														);
														border: 1px solid
															var(
																--sc-color-gray-200
															);
														border-radius: 4px;
														padding: var(
															--sc-spacing-small
														);

														.media-display-preview {
															width: 100px;
															min-height: auto;
														}

														img {
															max-height: 60px;
														}
													`}
												>
													<div
														css={css`
															display: flex;
															justify-content: center;
															align-items: center;
															gap: var(
																--sc-spacing-x-small
															);
															max-width: 100%;
														`}
													>
														<div
															css={css`
																width: 100px;
																height: 60px;
																overflow: hidden;
															`}
														>
															{thumbnailLoading && (
																<ScSkeleton
																	style={{
																		aspectRatio:
																			'1 / 1',
																		'--border-radius':
																			'var(--sc-border-radius-medium)',
																	}}
																/>
															)}
															<MediaDisplayPreview
																media={
																	videoThumbnail
																}
															/>
														</div>
														<ScText
															css={css`
																max-width: 180px;
															`}
															tag="p"
															truncate
															title={
																videoThumbnail
																	?.title
																	?.rendered ||
																videoThumbnail?.title ||
																videoThumbnail?.alt ||
																''
															}
														>
															{videoThumbnail
																?.title
																?.rendered ||
																videoThumbnail?.title ||
																videoThumbnail?.alt ||
																''}
														</ScText>
													</div>

													<div
														css={css`
															display: flex;
															justify-content: flex-end;
															align-items: center;
															gap: var(
																--sc-spacing-x-small
															);
															margin: var(
																	--sc-spacing-small
																)
																0px;
														`}
													>
														<MediaUpload
															title={__(
																'Change Thumbnail',
																'surecart'
															)}
															onSelect={
																selectThumbnail
															}
															value={
																videoThumbnail?.id ??
																null
															}
															multiple={false}
															allowedTypes={[
																'image',
															]}
															render={({
																open,
															}) => (
																<Button
																	icon={edit}
																	label={__(
																		'Change Thumbnail',
																		'surecart'
																	)}
																	showTooltip={
																		true
																	}
																	size="compact"
																	onClick={
																		open
																	}
																/>
															)}
														/>
														<Button
															icon={closeSmall}
															label={__(
																'Remove Thumbnail',
																'surecart'
															)}
															showTooltip={true}
															size="compact"
															onClick={() =>
																selectThumbnail(
																	null
																)
															}
														/>
													</div>
												</div>
											) : (
												<MediaUpload
													title={__(
														'Select Thumbnail',
														'surecart'
													)}
													onSelect={selectThumbnail}
													value={
														videoThumbnail?.id ?? ''
													}
													multiple={false}
													allowedTypes={['image']}
													render={({ open }) => (
														<ScButton
															type="default"
															onClick={open}
															css={css`
																width: 100%;
															`}
														>
															<ScIcon
																name="upload"
																slot="suffix"
															></ScIcon>
															{__(
																'Open Media Library',
																'surecart'
															)}
														</ScButton>
													)}
												/>
											)}
										</ScFormControl>

										<ScFormControl
											label={__(
												'Aspect Ratio',
												'surecart'
											)}
										>
											<ScSelect
												value={
													videoThumbnailAspectRatio
												}
												placeholder={__(
													'Select aspect ratio',
													'surecart'
												)}
												choices={aspectRatioChoices}
												style={{ width: '100%' }}
												onScChange={(e) =>
													setVideoThumbnailAspectRatio(
														e.target.value
													)
												}
											/>
										</ScFormControl>
									</>
								)}
							</>
						)}
					</div>
				</div>

				<div
					css={css`
						display: flex;
						justify-content: space-between;
					`}
					slot="footer"
				>
					<div>
						<ScButton
							type="primary"
							submit
							isBusy={isSaving}
							disabled={isSaving || !mediaData?.id}
						>
							{__('Update Media', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</div>
				{isSaving && <sc-block-ui spinner></sc-block-ui>}
			</ScDrawer>
		</ScForm>
	);
};
