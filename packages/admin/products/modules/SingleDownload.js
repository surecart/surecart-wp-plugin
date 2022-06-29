/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedListRow,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, select } from '@wordpress/data';
import { useState, Fragment } from '@wordpress/element';
import useSnackbar from '../../hooks/useSnackbar';
import apiFetch from '@wordpress/api-fetch';

export default ({ download, className }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { addSnackbarNotice } = useSnackbar();
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);

	const onRemove = async () => {
		const r = confirm(
			__(
				'Are you sure you want to delete the download from this product?',
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
			addSnackbarNotice({ content: __('Download deleted.', 'surecart') });
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
			addSnackbarNotice({
				content: download?.archived
					? __('Download un-archived.', 'surecart')
					: __('Download archived.', 'surecart'),
			});
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
							padding: 1em;
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
								gap: 0.5em;
							`}
						>
							<sc-format-bytes
								value={download?.media?.byte_size}
							></sc-format-bytes>
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
						<ScMenuItem onClick={downloadItem}>
							<ScIcon name="download-cloud" slot="prefix" />
							{__('Download', 'surecart')}
						</ScMenuItem>
						<ScMenuItem onClick={toggleDisable}>
							<ScIcon name="archive" slot="prefix" />
							{download?.archived
								? __('Un-Archive', 'surecart')
								: __('Archive', 'surecart')}
						</ScMenuItem>

						<ScMenuItem onClick={onRemove}>
							<ScIcon name="trash" slot="prefix" />
							{__('Delete', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScStackedListRow>
			{loading && <ScBlockUi spinner />}
		</Fragment>
	);
};
