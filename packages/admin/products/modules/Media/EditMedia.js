/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import UploadMedia from './UploadMedia';
import Error from '../../../components/Error';
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScFormControl,
	ScIcon,
	ScSelect,
	ScSkeleton,
} from '@surecart/components-react';
import SortableList, { SortableItem } from 'react-easy-sort';
import { MediaUpload } from '@wordpress/media-utils';
const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ media, setMedia, product, open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [variation, setVariation] = useState('');
	const [videoThumbnail, setVideoThumbnail] = useState('');

	const onSubmit = (event) => {
		event.preventDefault();
	};

	const selectMedia = (media) => {
		setMedia(media);
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
								<SortableList>
									<SortableItem key={media?.id ?? ''}>
										<div
											css={css`
												user-select: none;
												cursor: grab;
												max-height: 200px;
											`}
										>
											{typeof media?.id === 'string' ? (
												<div>Handle Product Media</div>
											) : (
												<div
													css={css`
														background: #f3f3f3;
														position: relative;
														border-radius: var(
															--sc-border-radius-medium
														);
														border: var(
															--sc-input-border
														);
														box-shadow: var(
															--sc-input-box-shadow
														);

														height: auto;
														width: 200px;

														.overlay,
														.delete-icon,
														.edit-icon {
															opacity: 0;
															visibility: hidden;
															transition: all
																var(
																	--sc-transition-medium
																)
																ease-in-out;
														}

														:hover .overlay,
														:hover .delete-icon,
														:hover .edit-icon {
															opacity: 1;
															visibility: visible;
														}
													`}
												>
													<ScIcon
														className="delete-icon"
														onClick={() => {
															setMedia('');
															setVariation('');
															setVideoThumbnail(
																''
															);
														}}
														css={css`
															position: absolute;
															top: 4px;
															right: 4px;
															z-index: 10;
															cursor: pointer;
															padding: var(
																--sc-spacing-xx-small
															);
															border-radius: var(
																--sc-border-radius-small
															);
															color: var(
																--sc-color-white
															);
															font-weight: var(
																--sc-font-weight-semibold
															);
															background-color: var(
																--sc-color-gray-800
															);
														`}
														name="x"
													/>

													<MediaUpload
														addToGallery={false}
														multiple={false}
														value={media?.id ?? ''}
														onSelect={selectMedia}
														allowedTypes={
															ALLOWED_MEDIA_TYPES
														}
														onClose={() => {
															// invalidateResolution(
															// 	'getMedia',
															// 	[media?.id]
															// );
														}}
														render={({ open }) => (
															<ScIcon
																className="edit-icon"
																css={css`
																	position: absolute;
																	bottom: 4px;
																	right: 4px;
																	z-index: 10;
																	cursor: pointer;
																	padding: var(
																		--sc-spacing-small
																	);
																	font-size: var(
																		--sc-font-size-small
																	);
																	border-radius: var(
																		--sc-border-radius-small
																	);
																	color: var(
																		--sc-color-gray-800
																	);
																	font-weight: var(
																		--sc-font-weight-semibold
																	);
																	background-color: var(
																		--sc-color-white
																	);
																	border-radius: var(
																		--sc-border-radius-small
																	);
																`}
																name="edit-2"
																onClick={open}
															/>
														)}
													/>

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
																	controls={
																		false
																	}
																	css={css`
																		max-width: 100%;
																		max-height: 100%;
																		object-fit: contain;
																		border-radius: var(
																			--sc-border-radius-medium
																		);
																		pointer-events: none;
																	`}
																	src={
																		media?.source_url
																	}
																	muted
																	loop
																	playsInline
																	{...(media
																		?.thumb
																		?.src
																		? {
																				poster: media
																					?.thumb
																					?.src,
																		  }
																		: {})}
																>
																	<source
																		type={
																			media?.mime
																		}
																		src={
																			media?.source_url
																		}
																	/>
																</video>
																<ScIcon
																	css={css`
																		position: absolute;
																		color: var(
																			--sc-color-white
																		);
																		background-color: rgba(
																			0,
																			0,
																			0,
																			0.5
																		);
																		border-radius: 50%;
																		padding: var(
																			--sc-spacing-small
																		);
																		width: 40px;
																		height: 40px;
																	`}
																	name="play"
																/>
															</div>
														) : (
															<img
																src={
																	media
																		?.media_details
																		?.sizes
																		?.medium
																		?.source_url ||
																	media?.source_url
																}
																css={css`
																	max-width: 100%;
																	object-fit: contain;
																	display: block;
																	border-radius: var(
																		--sc-border-radius-medium
																	);
																	pointer-events: none;
																`}
																alt={
																	media?.alt_text
																}
																{...(media
																	?.title
																	?.rendered
																	? {
																			title: media
																				?.title
																				?.rendered,
																	  }
																	: {})}
																loading="lazy"
															/>
														)
													) : (
														<ScSkeleton
															style={{
																aspectRatio:
																	'1 / 1',
																'--border-radius':
																	'var(--sc-border-radius-medium)',
															}}
														/>
													)}
												</div>
											)}
										</div>
									</SortableItem>
								</SortableList>
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
									css={css`
										margin-top: var(--sc-spacing-medium);
									`}
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
											label={__(
												'Video Thumbnail',
												'surecart'
											)}
										>
											<MediaUpload
												title={__(
													'Select Video Thumbnail',
													'surecart'
												)}
												onSelect={(thumbnail) =>
													setVideoThumbnail(thumbnail)
												}
												value={videoThumbnail?.id ?? ''}
												multiple={false}
												allowedTypes={['image']}
												render={({ open }) => (
													<ScButton
														type="default"
														onClick={open}
													>
														<ScIcon
															name="upload"
															slot="prefix"
														></ScIcon>
														{__(
															'Upload Thumbnail',
															'surecart'
														)}
													</ScButton>
												)}
											/>
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
							disabled={isSaving}
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
