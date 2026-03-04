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
import useVariantValue from '../../hooks/useVariantValue';
import AddExternalUrlModal from '../AddExternalUrlModal';
import SingleDownload from '../SingleDownload';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({
	variant,
	product,
	updateVariant,
	downloads,
	downloadsFetching,
	isCustomDownloads,
}) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [showArchived, setShowArchived] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [modal, setModal] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);
	const { isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	// Check if the product has any downloads (used to show override hint).
	const { hasProductDownloads } = useSelect(
		(select) => {
			if (!product?.id) {
				return {
					hasProductDownloads: false,
				};
			}
			const queryArgs = [
				'surecart',
				'download',
				{
					context: 'edit',
					product_ids: [product.id],
					per_page: 1,
				},
			];
			const records = select(coreStore).getEntityRecords(...queryArgs);
			return {
				hasProductDownloads: (records || []).length > 0,
			};
		},
		[product?.id]
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
			variant: variant.id,
			enabled: true,
		};

		if (isExternal) {
			payload.name = media.name;
			payload.url = media.url;
		} else {
			payload.media = media?.id;
		}

		try {
			setError(null);
			setIsSaving(true);
			await saveEntityRecord('surecart', 'download', payload, {
				throwOnError: true,
			});
			createSuccessNotice(__('Download added.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			setError(e);
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

	const onToggleDownloads = (checked) => {
		updateVariant(getUpdateValue({ downloads_enabled: !!checked }));
	};

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
							product={product}
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
								product={product}
							/>
						))}
				</ScStackedList>
			</ScCard>
		);
	};

	return (
		<>
			<DrawerSection
				title={__('Downloads', 'surecart')}
				suffix={
					<ResetOverridesDropdown
						fields={[
							{
								key: 'downloads_enabled',
								label: __('Enable Downloads', 'surecart'),
							},
						]}
						isOverridden={isOverridden}
						onReset={(fieldKey) =>
							updateVariant({
								[fieldKey]: null,
							})
						}
					/>
				}
			>
				<ScSwitch
					checked={isCustomDownloads}
					onScChange={(e) => onToggleDownloads(e.target.checked)}
				>
					{__('Enable downloads', 'surecart')}
				</ScSwitch>

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

						{hasProductDownloads && (
							<div
								css={css`
									font-size: var(
										--sc-input-help-text-font-size-medium
									);
									color: var(--sc-input-help-text-color);
									margin-top: var(--sc-spacing-small);
								`}
							>
								{__(
									'Downloads added here will replace the product downloads for this variant.',
									'surecart'
								)}
							</div>
						)}

						{(downloadsFetching || isSaving) && (
							<ScBlockUi spinner />
						)}
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
