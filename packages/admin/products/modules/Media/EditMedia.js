/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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
} from '@surecart/components-react';
import { MediaUpload } from '@wordpress/media-utils';
const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ media, setMedia, product, open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [variation, setVariation] = useState('');
	const [videoThumbnail, setVideoThumbnail] = useState('');

	const onSubmit = (event) => {
		event.preventDefault();
		if (!media?.id) {
			setError(__('Please select a media item.', 'surecart'));
			return;
		}
	};

	const selectMedia = (media) => {
		media = {
			...media,
			mime_type: media?.mime || media?.mime_type,
			source_url: media?.source_url || media?.url,
			alt_text: media?.alt_text || media?.alt,
			thumb: media?.sizes?.medium
				? {
						src: media.sizes.medium.url,
				  }
				: media?.thumb,
			media_details: media?.media_details || {
				sizes: media?.sizes
					? {
							medium: media.sizes.medium,
					  }
					: {},
			},
		};
		setMedia(media);
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

	const updateVideoThumbnail = () => {
		setVideoThumbnail('');
	};

	const isVideo = media?.mime_type?.includes('video');

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
							{!!media?.id && (
								<>
									{typeof media?.id === 'string' ? (
										<div>Handle Product Media</div>
									) : (
										<>
											<MediaDisplayPreview
												media={media}
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
													value={media?.id ?? ''}
													onSelect={selectMedia}
													allowedTypes={
														ALLOWED_MEDIA_TYPES
													}
													onClose={() => {}}
													render={({ open }) => (
														<ScButton
															onClick={open}
														>
															<ScIcon
																name="edit-3"
																slot="prefix"
															/>
															{__(
																'Change',
																'surecart'
															)}
														</ScButton>
													)}
												/>

												<ScButton
													type="danger"
													onClick={() => {
														setMedia('');
														setVariation('');
														setVideoThumbnail('');
													}}
													outline
												>
													<ScIcon
														name="x"
														className="delete-icon"
														slot="prefix"
													/>
													{__('Remove', 'surecart')}
												</ScButton>
											</div>
										</>
									)}
								</>
							)}

							{!media?.id && (
								<UploadMedia
									value={media?.id ?? ''}
									onSelect={selectMedia}
								/>
							)}
						</ScFormControl>

						{media?.id && (
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

														.media-display-preview {
															max-width: 100px;
														}

														img {
															max-height: 60px;
														}
													`}
												>
													<MediaDisplayPreview
														media={videoThumbnail}
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
																<ScButton
																	onClick={
																		open
																	}
																>
																	<ScIcon
																		name="edit-3"
																		slot="prefix"
																	/>
																	{__(
																		'Change',
																		'surecart'
																	)}
																</ScButton>
															)}
														/>

														<ScButton
															type="danger"
															onClick={
																updateVideoThumbnail
															}
															outline
														>
															<ScIcon
																name="x"
																slot="prefix"
															/>
															{__(
																'Remove',
																'surecart'
															)}
														</ScButton>
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
													media?.aspect_ratio || ''
												}
												placeholder={__(
													'Select aspect ratio',
													'surecart'
												)}
												choices={[
													{
														label: __(
															'16:9',
															'surecart'
														),
														value: '16:9',
													},
													{
														label: __(
															'4:3',
															'surecart'
														),
														value: '4:3',
													},
													{
														label: __(
															'1:1',
															'surecart'
														),
														value: '1:1',
													},
												]}
												style={{ width: '100%' }}
												onScChange={(e) =>
													setMedia({
														...media,
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
							disabled={isSaving || !media?.id}
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
