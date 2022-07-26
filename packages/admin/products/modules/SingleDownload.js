/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScButton,
	ScDropdown,
	ScFormatBytes,
	ScIcon,
	ScMenu,
	ScMenuDivider,
	ScMenuItem,
	ScStackedListRow,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { useState, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import MediaLibrary from '../../components/MediaLibrary';

export default ({ download, product, updateProduct, className }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);

	const setRelease = () => {
		updateProduct({
			current_release_download: download.id,
		});
	};

	const unSetRelease = () => {
		updateProduct({
			current_release_download: null,
		});
	};

	const replaceItem = async (media) => {
		const r = confirm(
			__(
				'Are you sure you want to replace the file in this download? This may push out a new release to everyone.',
				'surecart'
			)
		);
		if (!r) return;
		await saveEntityRecord('surecart', 'download', {
			id: download?.id,
			media: media?.id,
		});
	};

	// Is this the current release.
	const isCurrentRelease = product?.current_release_download === download?.id;

	const onRemove = async () => {
		const r = confirm(
			__(
				'Are you sure you want to remove the download from this product?',
				'surecart'
			)
		);
		if (!r) return;

		setLoading(true);
		try {
			await deleteEntityRecord(
				'surecart',
				'download',
				download?.id,
				{},
				{ throwOnError: true }
			);
			createSuccessNotice(__('Download removed.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong', 'surecart'));
		} finally {
			setLoading(false);
		}
	};

	const toggleDisable = async () => {
		setLoading(true);
		try {
			await saveEntityRecord(
				'surecart',
				'download',
				{
					...download,
					archived: !download.archived,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(
				download?.archived
					? __('Download un-archived.', 'surecart')
					: __('Download archived.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong', 'surecart'));
		} finally {
			setLoading(false);
		}
	};

	const downloadItem = async () => {
		setLoading(true);
		try {
			const media = await apiFetch({
				path: `surecart/v1/medias/${download?.media?.id}?expose_for=60`,
			});
			if (!media?.url) {
				throw {
					message: __('Could not download the file.', 'surecart'),
				};
			}
			downloadFile(media?.url, media.filename);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong', 'surecart'));
		} finally {
			setLoading(false);
		}
	};

	const downloadFile = (path, filename) => {
		// Create a new link
		const anchor = document.createElement('a');
		anchor.href = path;
		anchor.download = filename;
		anchor.target = '_blank';

		// Append to the DOM
		document.body.appendChild(anchor);

		// Trigger `click` event
		anchor.click();

		// To make this work on Firefox we need to wait
		// a little while before removing it.
		setTimeout(() => {
			document.body.removeChild(anchor);
		}, 0);
	};

	return (
		<Fragment>
			{!!error && (
				<sc-alert open={!!error} type="danger">
					{error}
				</sc-alert>
			)}
			<ScStackedListRow
				className={className}
				style={{ position: 'relative' }}
				mobile-size={0}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.75em;
						overflow: hidden;
						min-width: 0;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: center;
							padding: 1.25em;
							background: var(--sc-color-gray-200);
							border-radius: var(--sc-border-radius-small);
						`}
					>
						{download?.media?.filename?.split?.('.')?.pop?.()}
					</div>
					<div
						css={css`
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						`}
					>
						{isCurrentRelease && (
							<ScTag type="info" size="small">
								{__('Current Release', 'surecart')}
							</ScTag>
						)}
						<div
							css={css`
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								font-weight: bold;
							`}
						>
							{download?.media.filename}
						</div>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<ScFormatBytes value={download?.media?.byte_size} />
							{!!download?.media?.release_json?.version && (
								<ScTag
									type="primary"
									size="small"
									style={{
										'--sc-tag-primary-background-color':
											'#f3e8ff',
										'--sc-tag-primary-color': '#6b21a8',
									}}
								>
									v{download?.media?.release_json?.version}
								</ScTag>
							)}
							{download?.archived && (
								<div>
									<ScTag type="warning" size="small">
										{__('Archived', 'surecart')}
									</ScTag>
								</div>
							)}
						</div>
					</div>
				</div>

				<ScDropdown slot="suffix" placement="bottom-end">
					<ScButton type="text" slot="trigger" circle>
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						{isCurrentRelease ? (
							<ScMenuItem onClick={unSetRelease}>
								<ScIcon name="truck" slot="prefix" />
								{__('Unset Release', 'surecart')}
							</ScMenuItem>
						) : (
							!!product?.licensing_enabled && (
								<ScMenuItem onClick={setRelease}>
									<ScIcon name="truck" slot="prefix" />
									{__('Set As Release', 'surecart')}
								</ScMenuItem>
							)
						)}

						<MediaLibrary
							onSelect={replaceItem}
							multiple={false}
							render={({ setOpen }) => {
								return (
									<ScMenuItem onClick={() => setOpen(true)}>
										<ScIcon name="repeat" slot="prefix" />
										{__('Replace', 'surecart')}
									</ScMenuItem>
								);
							}}
						></MediaLibrary>

						<ScMenuDivider></ScMenuDivider>

						<ScMenuItem onClick={downloadItem}>
							<ScIcon name="download-cloud" slot="prefix" />
							{__('Download', 'surecart')}
						</ScMenuItem>

						<ScMenuDivider></ScMenuDivider>

						<ScMenuItem onClick={toggleDisable}>
							<ScIcon name="archive" slot="prefix" />
							{download?.archived
								? __('Un-Archive', 'surecart')
								: __('Archive', 'surecart')}
						</ScMenuItem>

						<ScMenuItem onClick={onRemove}>
							<ScIcon name="trash" slot="prefix" />
							{__('Remove', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScStackedListRow>
			{loading && <ScBlockUi spinner />}
		</Fragment>
	);
};
