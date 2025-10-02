/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { reusableBlock } from '@wordpress/icons';

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
	ScSelect,
	ScSwitch,
} from '@surecart/components-react';
import {
	normalizeMedia,
	isVideo,
	normalizeGalleryItem,
	aspectRatioChoices,
	getGalleryItemId,
} from '../../../util/attachments';
import DrawerSection from '../../../ui/DrawerSection';

const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({
	media,
	product,
	onRequestClose,
	updateProduct,
	updateMedia,
}) => {
	const [mediaData, setMediaData] = useState(() => normalizeMedia(media));
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	// Initialize form values from media data
	const [formData, setFormData] = useState(() => {
		const normalized = normalizeGalleryItem(media);
		return {
			variant_option: normalized.variant_option || '',
			thumbnail_image: normalized.thumbnail_image || null,
			aspect_ratio: normalized.aspect_ratio || '',
			autoplay: normalized.autoplay || false,
			loop: normalized.loop || false,
			muted: normalized.muted || false,
		};
	});

	const onSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation(); // prevent parent form from submitting.

		if (!mediaData?.id) {
			setError(__('Please select a media item.', 'surecart'));
			return;
		}

		try {
			setIsSaving(true);
			setError(null);

			const {
				variant_option,
				thumbnail_image,
				aspect_ratio,
				autoplay,
				loop,
				muted,
			} = formData;

			// Update the gallery with the new item data.
			const ids = [...(product?.gallery_ids || [])];

			// Find the index of the item being edited (by original media id).
			const originalIndex = ids.findIndex(
				(item) => getGalleryItemId(item) === getGalleryItemId(media)
			);

			if (originalIndex !== -1) {
				ids[originalIndex] = {
					id: parseInt(mediaData.id),
					...(variant_option ? { variant_option } : {}),
					...(thumbnail_image ? { thumbnail_image } : {}),
					...(aspect_ratio ? { aspect_ratio } : {}),
					...(isVideo(mediaData) && autoplay ? { autoplay } : {}),
					...(isVideo(mediaData) && loop ? { loop } : {}),
					...(isVideo(mediaData) && muted ? { muted } : {}),
				};
			}

			// Remove any previous deprecated metadata from the media item.
			updateMedia({
				meta: {
					sc_variant_option: null,
				},
			});

			updateProduct({
				metadata: {
					...(product?.metadata || {}),
					gallery_ids: ids,
				},
				gallery_ids: ids,
			});

			setOpen(false);
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

	const selectMedia = (updatedMedia) =>
		setMediaData(normalizeMedia(updatedMedia));

	const updateFormData = (key, value) =>
		setFormData((prev) => ({ ...prev, [key]: value }));

	const variantOptionChoices = (product?.variant_options || []).flatMap(
		(v) => {
			return {
				label: v.name,
				choices: v.values.map((val) => ({
					label: val,
					value: val,
				})),
			};
		}
	);

	return (
		<ScForm
			style={{
				'--sc-form-row-spacing': 'var(--sc-spacing-large)',
				position: 'absolute',
			}}
			onScFormSubmit={onSubmit}
		>
			<ScDrawer
				label={__('Edit Media', 'surecart')}
				style={{
					'--sc-drawer-size': '30rem',
					'--sc-input-label-margin': 'var(--sc-spacing-small)',
				}}
				onScAfterHide={onRequestClose}
				open={open}
				stickyHeader
				stickyFooter
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

						<DrawerSection
							title={__('Media', 'surecart')}
							suffix={
								<MediaUpload
									addToGallery={false}
									multiple={false}
									value={mediaData?.id ?? ''}
									onSelect={selectMedia}
									allowedTypes={ALLOWED_MEDIA_TYPES}
									render={({ open }) => (
										<Button
											onClick={open}
											icon={reusableBlock}
											variant="secondary"
											size="small"
											iconSize={14}
										>
											{__('Change', 'surecart')}
										</Button>
									)}
								/>
							}
						>
							<div>
								<WordPressMediaFullPreview
									media={mediaData}
									settings={formData}
								/>
							</div>
							{isVideo(mediaData) && (
								<>
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
										mediaData={mediaData}
									/>

									<ScSelect
										label={__('Aspect Ratio', 'surecart')}
										help={__(
											'The aspect ratio of the media.',
											'surecart'
										)}
										value={formData.aspect_ratio}
										placement="top-start"
										placeholder={__(
											'Select aspect ratio',
											'surecart'
										)}
										choices={aspectRatioChoices}
										onScChange={(e) =>
											updateFormData(
												'aspect_ratio',
												e.target.value
											)
										}
									/>

									<ScSwitch
										checked={formData.autoplay}
										onScChange={(e) => {
											updateFormData(
												'autoplay',
												e.target.checked
											);

											// if autoplay is enabled, ensure muted is also enabled.
											if (e.target.checked) {
												updateFormData('muted', true);
											}
										}}
									>
										{__('Autoplay', 'surecart')}
										<span slot="description">
											{__(
												'Automatically play the video when it appears on screen. This only works if the video is muted according to browser policies.',
												'surecart'
											)}
										</span>
									</ScSwitch>

									<ScSwitch
										checked={formData.loop}
										onScChange={(e) =>
											updateFormData(
												'loop',
												e.target.checked
											)
										}
									>
										{__('Loop', 'surecart')}
										<span slot="description">
											{__(
												'Loop the video playback.',
												'surecart'
											)}
										</span>
									</ScSwitch>

									<ScSwitch
										checked={formData.muted}
										onScChange={(e) =>
											updateFormData(
												'muted',
												e.target.checked
											)
										}
										disabled={!!formData.autoplay}
									>
										{__('Muted', 'surecart')}
										<span slot="description">
											{__(
												'Mute the video. Most browsers require videos to be muted for autoplay to work.',
												'surecart'
											)}
										</span>
									</ScSwitch>
								</>
							)}
						</DrawerSection>

						<DrawerSection title={__('Variation', 'surecart')}>
							{!!variantOptionChoices?.length && (
								<ScSelect
									label={__('Option', 'surecart')}
									help={__(
										'Display only when this variant option is selected.',
										'surecart'
									)}
									placement="top-start"
									value={formData.variant_option}
									choices={[
										{
											label: __(
												'(All Variations)',
												'surecart'
											),
											value: '',
										},
										...variantOptionChoices,
									]}
									placeholder={__(
										'(All Variations)',
										'surecart'
									)}
									onScChange={(e) =>
										updateFormData(
											'variant_option',
											e.target.value
										)
									}
									style={{
										'--sc-input-placeholder-color':
											'var(--sc-input-color)',
									}}
								/>
							)}
						</DrawerSection>
					</div>
				</div>

				<div slot="footer">
					<ScButton
						type="primary"
						submit
						isBusy={isSaving}
						disabled={isSaving || !mediaData?.id}
					>
						{__('Done', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={() => setOpen(false)}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
				{isSaving && <sc-block-ui spinner></sc-block-ui>}
			</ScDrawer>
		</ScForm>
	);
};
