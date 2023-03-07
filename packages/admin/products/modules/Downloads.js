/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScDropdown,
	ScFormControl,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScSwitch,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../components/Error';

import MediaLibrary from '../../components/MediaLibrary';
import Box from '../../ui/Box';
import AddExternalUrlModal from './AddExternalUrlModal';
import SingleDownload from './SingleDownload';

export default ({ id, product, updateProduct, loading }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [showArchived, setShowArchived] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [modal, setModal] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);

	const { downloads, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'download',
				{ context: 'edit', product_ids: [id], per_page: 100 },
			];
			return {
				downloads: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

	const addDownload = async (media, isExternal) => {
		const payload = {
			product: product?.id,
			enabled: true,
		};

		if (isExternal) {
			payload.name = media.name;
			payload.url = media.url;
		} else payload.media = media?.id;

		try {
			setIsSaving(true);
			await saveEntityRecord('surecart', 'download', payload, {
				throwOnError: true,
			});
			createSuccessNotice(__('Download added.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			setError(e);
			console.error(e);
		} finally {
			setModal(null);
			setIsSaving(false);
		}
	};

	// sort and group.
	const sorted = (downloads || []).sort(
		(a, b) => a.created_at - b.created_at
	);
	const unArchived = (sorted || []).filter((download) => !download.archived);
	const archived = (sorted || []).filter((download) => !!download.archived);

	return (
		<>
			<Box
				title={__('Downloads', 'surecart')}
				loading={loading}
				footer={
					<div
						css={css`
							width: 100%;
							display: flex;
							justify-content: space-between;
							align-items: center;
						`}
					>
						<ScDropdown
							placement="bottom-start"
							style={{ '--panel-width': '14em' }}
						>
							<ScButton slot="trigger">
								<ScIcon name="plus" slot="prefix" />
								{__('Add Downloads', 'surecart')}
							</ScButton>
							<ScMenu>
								<ScFormControl
									label={__('File', 'surecart')}
									showLabel={false}
								>
									<MediaLibrary
										onSelect={(data) =>
											addDownload(data, false)
										}
										multiple={true}
										render={({ setOpen }) => {
											return (
												<ScMenuItem
													onClick={() =>
														setOpen(true)
													}
												>
													<ScIcon
														name="shield"
														slot="prefix"
													/>
													{__(
														'Secure Storage',
														'surecart'
													)}
												</ScMenuItem>
											);
										}}
									/>
								</ScFormControl>
								<ScMenuItem
									onClick={() =>
										setModal('external_link_modal')
									}
								>
									<ScIcon name="link" slot="prefix" />
									{__('External Link', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>

						{!!archived?.length && (
							<ScSwitch
								class="sc-show-archived"
								checked={showArchived}
								onScChange={(e) =>
									setShowArchived(e.target.checked)
								}
							>
								{__('Show Archived', 'surecart')}{' '}
								<sc-tag size="small">{archived?.length}</sc-tag>
							</ScSwitch>
						)}
					</div>
				}
			>
				{(() => {
					if (!downloads?.length) return null;
					return (
						<>
							{error && (
								<Error error={error} setError={setError} />
							)}
							<ScCard noPadding>
								<ScStackedList>
									{(unArchived || [])
										.sort(
											(a, b) =>
												a.created_at - b.created_at
										)
										.map((download) => (
											<SingleDownload
												download={download}
												key={download.id}
												product={product}
												updateProduct={updateProduct}
											/>
										))}

									{showArchived &&
										(archived || [])
											.sort(
												(a, b) =>
													a.created_at - b.created_at
											)
											.map((download) => (
												<SingleDownload
													css={css`
														--sc-list-row-background-color: var(
															--sc-color-warning-50
														);
													`}
													download={download}
													key={download.id}
												/>
											))}
								</ScStackedList>
							</ScCard>
						</>
					);
				})()}
				{fetching && <ScBlockUi spinner />}
			</Box>
			{modal === 'external_link_modal' && (
				<AddExternalUrlModal
					onSubmit={(data) => addDownload(data, true)}
					onRequestClose={() => setModal(null)}
					loading={isSaving}
				/>
			)}
		</>
	);
};
