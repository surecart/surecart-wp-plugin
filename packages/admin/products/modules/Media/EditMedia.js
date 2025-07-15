/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { closeSmall, edit } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import WordPressMediaFullPreview from './WordPressMediaFullPreview';
import VideoThumbnail from './VideoThumbnail';
import Error from '../../../components/Error';
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScFormControl,
	ScSelect,
} from '@surecart/components-react';
import {
	normalizeMedia,
	isVideo,
	normalizeGalleryItem,
	createGalleryItem,
} from '../../../util/attachments';

const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ media, product, onSave, open, onRequestClose }) => {
	const [mediaData, setMediaData] = useState(() => normalizeMedia(media));
	const [error, setError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);

	// Initialize form values from media data
	const [formData, setFormData] = useState(() => {
		const normalized = normalizeGalleryItem(media);
		return {
			variant_option: normalized.variant_option || '',
			thumbnail_image: normalized.thumbnail_image || null,
			aspect_ratio: normalized.aspect_ratio || '',
		};
	});

	useEffect(() => {
		if (media) {
			setMediaData(normalizeMedia(media));
			setFormData(normalizeGalleryItem(media));
		}
	}, [media]);

	const onSubmit = async (event) => {
		event.preventDefault();
		if (!mediaData?.id) {
			setError(__('Please select a media item.', 'surecart'));
			return;
		}

		try {
			setIsSaving(true);
			setError(null);

			// Create the updated gallery item.
			const updatedItem = createGalleryItem(mediaData.id, {
				variant_option: formData.variant_option || null,
				thumbnail_image: formData.thumbnail_image || null,
				aspect_ratio: formData.aspect_ratio || null,
			});

			onSave(updatedItem);
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

	const updateFormData = (key, value) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const variantOptionChoices = (product?.variant_options || []).flatMap((v) =>
		v.values.map((val) => ({
			label: val,
			value: val,
		}))
	);

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
							{typeof mediaData?.id !== 'string' && (
								<>
									<WordPressMediaFullPreview
										media={mediaData}
									/>

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
											addToGallery={false}
											multiple={false}
											value={mediaData?.id ?? ''}
											onSelect={selectMedia}
											allowedTypes={ALLOWED_MEDIA_TYPES}
											onClose={() => {}}
											render={({ open }) => (
												<Button
													onClick={open}
													icon={edit}
													variant="secondary"
												>
													{__('Change', 'surecart')}
												</Button>
											)}
										/>

										<Button
											icon={closeSmall}
											variant="secondary"
											onClick={() => {
												setMediaData(null);
												setFormData({
													variant_option: '',
													thumbnail_image: null,
													aspect_ratio: '',
												});
											}}
											isDestructive
										>
											{__('Remove', 'surecart')}
										</Button>
									</div>
								</>
							)}

							{!mediaData?.id && (
								<MediaUpload
									title={__('Select Media', 'surecart')}
									onSelect={selectMedia}
									value={mediaData?.id ?? ''}
									multiple={false}
									allowedTypes={ALLOWED_MEDIA_TYPES}
									render={({ open }) => (
										<ScButton
											type="default"
											onClick={open}
											css={css`
												width: 100%;
											`}
										>
											{__(
												'Select from Library',
												'surecart'
											)}
										</ScButton>
									)}
								/>
							)}
						</ScFormControl>

						{mediaData?.id && (
							<>
								{!!variantOptionChoices?.length && (
									<ScFormControl
										label={__(
											'Select Variation',
											'surecart'
										)}
									>
										<ScSelect
											value={formData.variant_option}
											choices={variantOptionChoices}
											style={{ width: '100%' }}
											placeholder={__(
												'Select Variation',
												'surecart'
											)}
											onScChange={(e) =>
												updateFormData(
													'variant_option',
													e.target.value
												)
											}
										/>
									</ScFormControl>
								)}

								{isVideo(mediaData) && (
									<VideoThumbnail
										thumbnailImage={
											formData.thumbnail_image
										}
										onThumbnailChange={(thumbnail) =>
											updateFormData(
												'thumbnail_image',
												thumbnail
											)
										}
										aspectRatio={formData.aspect_ratio}
										onAspectRatioChange={(aspectRatio) =>
											updateFormData(
												'aspect_ratio',
												aspectRatio
											)
										}
										mediaData={mediaData}
									/>
								)}
							</>
						)}
					</div>
				</div>

				<div slot="footer">
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
				{isSaving && <sc-block-ui spinner></sc-block-ui>}
			</ScDrawer>
		</ScForm>
	);
};
