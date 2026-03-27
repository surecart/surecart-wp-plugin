/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import {
	ScBlockUi,
	ScFormatBytes,
	ScInput,
	ScLineItem,
	ScSkeleton,
	ScTextarea,
} from '@surecart/components-react';
import Error from '../Error';
import DownloadMedia from './DownloadMedia';
import { ScCard } from '@surecart/components-react';

export default ({ media: initialMedia, onDeleted }) => {
	const { deleteEntityRecord, saveEntityRecord } = useDispatch(coreStore);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [busy, setBusy] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [media, setMedia] = useState(initialMedia);
	const isImage = media?.content_type?.startsWith('image/');

	useEffect(() => {
		if (!initialMedia?.content_type?.startsWith('image/')) return; // do not fetch if no image.
		if (!initialMedia?.id || initialMedia?.url) return; // initialMedia not loaded or we have a url.
		fetchMedia(initialMedia?.id);
	}, [initialMedia]);

	const fetchMedia = async (id) => {
		try {
			setFetching(true);
			const media = await apiFetch({
				path: `surecart/v1/medias/${id}?expose_for=60`,
			});
			setMedia(media);
		} catch (e) {
			console.error(e);
		} finally {
			setFetching(false);
		}
	};

	const updateMedia = async ({ alt, title }) => {
		setMedia({ ...media, alt, title });
		try {
			setBusy(true);
			setError(null);
			const saved = await saveEntityRecord(
				'surecart',
				'media',
				{
					id: media?.id,
					alt,
					title,
				},
				{ throwOnError: true }
			);
			if (!saved?.url) {
				const exposed = await apiFetch({
					path: `surecart/v1/medias/${saved?.id}?expose_for=60`,
				});
				return setMedia(exposed);
			}
			setMedia(saved);
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const onDelete = async () => {
		const r = confirm(
			__(
				'Are you sure you wish to delete this media item? This cannot be undone.',
				'surecart'
			)
		);
		if (!r) return;
		try {
			setLoading(true);
			setError(null);
			await deleteEntityRecord(
				'surecart',
				'media',
				media?.id,
				{},
				{ throwOnError: true }
			);
			onDeleted && onDeleted();
		} catch (e) {
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScCard>
			<div
				css={css`
					display: grid;
					gap: 1em;
					position: relative;
				`}
			>
				<Error error={error} setError={setError} margin="80px" />

				{isImage &&
					(fetching ? (
						<ScSkeleton
							style={{
								width: '100%',
								height: '200px',
								'--border-radius': '0',
							}}
						></ScSkeleton>
					) : (
						<img
							src={media?.url}
							css={css`
								max-width: 100%;
								height: auto;
							`}
							alt={media?.alt}
							{...(media.title ? { title: media.title } : {})}
						/>
					))}

				<ScLineItem>
					<span slot="title">{__('Filename', 'surecart')}</span>
					<span slot="price-description">{media.filename}</span>
				</ScLineItem>

				<ScLineItem>
					<span slot="title">{__('Size', 'surecart')}</span>
					<span slot="price-description">
						<ScFormatBytes value={media?.byte_size}></ScFormatBytes>
					</span>
				</ScLineItem>

				<ScLineItem>
					<span slot="title">{__('Added', 'surecart')}</span>
					<span
						slot="price-description"
						css={css`
							white-space: nowrap;
						`}
					>
						{media?.created_at_date_time}
					</span>
				</ScLineItem>

				{isImage && (
					<ScTextarea
						label={__('Alternative Text', 'surecart')}
						help={__(
							'Leave empty if the image is purely decorative.',
							'surecart'
						)}
						onScChange={(e) =>
							updateMedia({ ...media, alt: e.target.value })
						}
						value={media?.alt}
						name="alternative-text"
					/>
				)}
				<ScInput
					label={__('Title', 'surecart')}
					onScChange={(e) =>
						updateMedia({ ...media, title: e.target.value })
					}
					value={media?.title}
					name="title"
				/>
				<hr
					css={css`
						width: 100%;
					`}
				/>

				<ScLineItem
					css={css`
						font-size: 12px;
					`}
				>
					<DownloadMedia
						media={media}
						render={({ downloading, onDownload }) => (
							<Button
								slot="title"
								isSecondary
								onClick={onDownload}
								isBusy={downloading}
							>
								{__('Download', 'surecart')}
							</Button>
						)}
					/>

					<Button
						slot="price"
						isDestructive
						onClick={onDelete}
						isBusy={loading}
					>
						{__('Delete', 'surecart')}
					</Button>
				</ScLineItem>
				{(loading || busy) && <ScBlockUi spinner />}
			</div>
		</ScCard>
	);
};
