/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScFormControl,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScRadio,
	ScRadioGroup,
	ScStackedList,
	ScSwitch,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../components/Error';
import MediaLibrary from '../../../components/MediaLibrary';
import DrawerSection from '../../../ui/DrawerSection';
import AddExternalUrlModal from '../AddExternalUrlModal';
import SingleDownload from '../SingleDownload';
import useVariantValue from '../../hooks/useVariantValue';

export default ({ variant, product, updateVariant }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [showArchived, setShowArchived] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [modal, setModal] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);
	const { getValue, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	const downloadsEnabled = getValue('downloads_enabled');
	const isCustomDownloads = downloadsEnabled === true;

	const { downloads, fetching } = useSelect(
		(select) => {
			// Reset/refetch when variant changes and Only fetch downloads when custom downloads mode is enabled.
			if (!variant?.id || !isCustomDownloads) {
				return {
					downloads: [],
					fetching: false,
				};
			}

			const queryArgs = [
				'surecart',
				'download',
				{
					context: 'edit',
					variant_ids: [variant?.id],
					per_page: 100,
					expand: ['media'],
				},
			];
			return {
				downloads: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[variant?.id, downloadsEnabled]
	);

	const addDownload = async (media, isExternal) => {
		if (!variant?.id) {
			setError(
				__(
					'Please save the variant before adding downloads.',
					'surecart'
				)
			);
			return;
		}

		const payload = {
			variant: variant?.id,
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
	const sorted = [...(downloads || [])].sort(
		(a, b) => a.created_at - b.created_at
	);
	const unArchived = sorted.filter((download) => !download.archived);
	const archived = sorted.filter((download) => !!download.archived);

	const onDownloadBehaviorChange = (value) =>
		updateVariant(getUpdateValue({ downloads_enabled: value }));

	const renderDownloads = () => {
		if (
			unArchived?.length === 0 &&
			(!showArchived || archived?.length === 0)
		) {
			return null;
		}

		return (
			<ScCard noPadding>
				<ScStackedList>
					{unArchived.map((download) => (
						<SingleDownload
							download={download}
							key={download.id}
							variant={variant}
						/>
					))}

					{showArchived &&
						archived.map((download) => (
							<SingleDownload
								css={css`
									--sc-list-row-background-color: var(
										--sc-color-warning-50
									);
								`}
								download={download}
								key={download.id}
								variant={variant}
							/>
						))}
				</ScStackedList>
			</ScCard>
		);
	};

	return (
		<>
			<DrawerSection title={__('Downloads', 'surecart')}>
				<ScRadioGroup
					label={__('Download Behavior', 'surecart')}
					required
				>
					<div
						css={css`
							display: grid;
							gap: 1em;
							margin-top: 0.5em;
						`}
					>
						<ScRadio
							checked={downloadsEnabled == null}
							value="null"
							onClick={() => onDownloadBehaviorChange(null)}
						>
							{__('Inherit product downloads', 'surecart')}
							<span
								slot="description"
								css={css`
									margin: 0.5em 0px 0px 0px;
								`}
							>
								{__(
									'This variant will inherit and deliver all product-level downloads.',
									'surecart'
								)}
							</span>
						</ScRadio>
						<ScRadio
							checked={downloadsEnabled === true}
							value="true"
							onClick={() => onDownloadBehaviorChange(true)}
						>
							{__('Custom downloads', 'surecart')}
							<span
								slot="description"
								css={css`
									margin: 0.5em 0px 0px 0px;
								`}
							>
								{__(
									'This variant will override product downloads with its own set.',
									'surecart'
								)}
							</span>
						</ScRadio>
						<ScRadio
							checked={downloadsEnabled === false}
							value="false"
							onClick={() => onDownloadBehaviorChange(false)}
						>
							{__('No downloads', 'surecart')}
							<span
								slot="description"
								css={css`
									margin: 0.5em 0px 0px 0px;
								`}
							>
								{__(
									'This variant will not deliver any downloads.',
									'surecart'
								)}
							</span>
						</ScRadio>
					</div>
				</ScRadioGroup>

				{isCustomDownloads && (
					<div
						css={css`
							position: relative;
						`}
					>
						{error && <Error error={error} setError={setError} />}

						{renderDownloads()}

						<div
							css={css`
								display: flex;
								justify-content: space-between;
								align-items: center;
								margin-top: var(--sc-spacing-medium);
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
									className="sc-show-archived"
									checked={showArchived}
									onScChange={(e) =>
										setShowArchived(e.target.checked)
									}
								>
									<ScFlex>
										{__('Show Archived', 'surecart')}
										<ScTag size="small">
											{archived?.length}
										</ScTag>
									</ScFlex>
								</ScSwitch>
							)}
						</div>

						{(fetching || isSaving) && <ScBlockUi spinner />}
					</div>
				)}
			</DrawerSection>

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
