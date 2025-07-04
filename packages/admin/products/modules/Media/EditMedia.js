/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';

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
	ScText,
} from '@surecart/components-react';
import { MediaUpload } from '@wordpress/media-utils';
import { closeSmall, edit } from '@wordpress/icons';
const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ media, setMedia, product, onSave, open, onRequestClose }) => {
	const [mediaData, setMediaData] = useState(media || '');
	const [error, setError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [variation, setVariation] = useState('');
	const [videoThumbnail, setVideoThumbnail] = useState('');
	console.log('media', media);

	useEffect(() => {
		if (media) {
			setMediaData({
				...media,
				mime_type: media?.mime || media?.mime_type,
				source_url: media?.source_url || media?.url,
				alt_text: media?.alt_text || media?.alt,
				thumb: media?.sizes?.medium
					? { src: media.sizes.medium.url }
					: media?.thumb,
				media_details: media?.media_details || {
					sizes: media?.sizes
						? {
								medium: media.sizes.medium,
						  }
						: {},
				},
			});
			setVariation(media?.meta?.sc_variant_option || '');
			setVideoThumbnail(media?.meta?.sc_video_thumbnail || '');
		}
	}, [media]);

	const onSubmit = (event) => {
		event.preventDefault();
		if (!mediaData?.id) {
			setError(__('Please select a media item.', 'surecart'));
			return;
		}

		try {
			setIsSaving(true);
			setError(null);

			// Update the media in the parent component
			onSave({
				...mediaData,
				meta: {
					...mediaData.meta,
					sc_variant_option: variation || '',
				},
				thumbnail_url:
					videoThumbnail?.source_url || mediaData.thumbnail_url,
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
		setMediaData({
			...updatedMedia,
			mime_type: updatedMedia?.mime || updatedMedia?.mime_type,
			source_url: updatedMedia?.source_url || updatedMedia?.url,
			alt_text: updatedMedia?.alt_text || updatedMedia?.alt,
			thumb: updatedMedia?.sizes?.medium
				? {
						src: updatedMedia.sizes.medium.url,
				  }
				: updatedMedia?.thumb,
			media_details: updatedMedia?.media_details || {
				sizes: updatedMedia?.sizes
					? {
							medium: updatedMedia.sizes.medium,
					  }
					: {},
			},
		});
	};

	const selectThumbnail = (thumbnail) => {
		const normalizedThumbnail = {
			...thumbnail,
			mime_type: thumbnail?.mime || thumbnail?.mime_type,
			source_url: thumbnail?.source_url || thumbnail?.url,
			alt_text: thumbnail?.alt_text || thumbnail?.alt,
			thumb: thumbnail?.sizes?.medium
				? {
						src: thumbnail.sizes.medium.url,
				  }
				: thumbnail?.thumb,
			media_details: thumbnail?.media_details || {
				sizes: thumbnail?.sizes
					? {
							medium: thumbnail.sizes.medium,
					  }
					: {},
			},
		};
		setVideoThumbnail(normalizedThumbnail);
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
														setMediaData('');
														setVariation('');
														setVideoThumbnail('');
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
																videoThumbnail?.title ||
																videoThumbnail?.alt ||
																''
															}
														>
															{videoThumbnail?.title ||
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
																''
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
																setVideoThumbnail(
																	''
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
													mediaData?.aspect_ratio ||
													''
												}
												placeholder={__(
													'Select aspect ratio',
													'surecart'
												)}
												choices={[
													{
														label: __(
															'Original',
															'surecart'
														),
														value: 'auto',
													},
													{
														label: __(
															'Square - 1:1',
															'surecart'
														),
														value: '1',
													},
													{
														label: __(
															'Standard - 4:3',
															'surecart'
														),
														value: '4/3',
													},
													{
														label: __(
															'Portrait - 3:4',
															'surecart'
														),
														value: '3/4',
													},
													{
														label: __(
															'Classic - 3:2',
															'surecart'
														),
														value: '3/2',
													},
													{
														label: __(
															'Classic Portrait - 2:3',
															'surecart'
														),
														value: '2/3',
													},
													{
														label: __(
															'Wide - 16:9',
															'surecart'
														),
														value: '16/9',
													},
													{
														label: __(
															'Tall - 9:16',
															'surecart'
														),
														value: '9/16',
													},
												]}
												style={{ width: '100%' }}
												onScChange={(e) =>
													setMedia({
														...mediaData,
														aspect_ratio:
															e.target.value,
													})
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
