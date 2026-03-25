/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticeStore } from '@wordpress/notices';
import SettingsBox from '../../SettingsBox';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScDialog,
	ScDropdown,
	ScEmpty,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScStackedListRow,
	ScTag,
} from '@surecart/components-react';
import ParcelTemplateForm from './ParcelTemplateForm';
import Error from '../../../components/Error';
import PrevNextButtons from '../../../ui/PrevNextButtons';
import usePagination from '../../../hooks/usePagination';

const PER_PAGE = 5;

const TYPE_LABELS = {
	box: __('Box or Tube', 'surecart'),
	poly_mailer: __('Polymailer (Envelope)', 'surecart'),
};

const getDimensionsSummary = (parcel) => {
	const { dimensions, package_type } = parcel;
	if (!dimensions) return null;

	const { length, width, height, unit } = dimensions;
	const parts = [length, width];
	if (package_type !== 'poly_mailer' && height) {
		parts.push(height);
	}

	const hasValues = parts.some((v) => Number(v) > 0);
	if (!hasValues) return null;

	return parts.filter(Boolean).join(' × ') + (unit ? ` ${unit}` : '');
};

const modals = {
	MODAL_ADD: 'add-parcel-template',
	MODAL_EDIT: 'edit-parcel-template',
};

export default () => {
	const [currentModal, setCurrentModal] = useState(null);
	const [selectedParcel, setSelectedParcel] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const {
		deleteEntityRecord,
		saveEntityRecord,
		invalidateResolutionForStore,
	} = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticeStore);

	const { parcels, loading, totalItems } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'parcel-template',
			{
				per_page: PER_PAGE,
				page: currentPage,
			},
		];

		return {
			parcels: select(coreStore).getEntityRecords(...queryArgs) || [],
			loading: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
			totalItems: select(coreStore).getEntityRecordsTotalItems(
				'surecart',
				'parcel-template'
			),
		};
	});

	const { hasPagination } = usePagination({
		data: parcels,
		page: currentPage,
		perPage: PER_PAGE,
		totalItems,
	});

	// Sort default template to top.
	const sortedParcels = [...parcels].sort(
		(a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)
	);

	const handleDelete = async (id) => {
		setBusy(true);
		try {
			await deleteEntityRecord('surecart', 'parcel-template', id, {
				throwOnError: true,
			});
			createSuccessNotice(__('Parcel template removed.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (err) {
			console.error(err);
			setError(err);
		} finally {
			setBusy(false);
			setDeleteTarget(null);
		}
	};

	const handleSetDefault = async (parcel) => {
		setBusy(true);
		try {
			await saveEntityRecord(
				'surecart',
				'parcel-template',
				{ ...parcel, default: true },
				{ throwOnError: true }
			);
			await invalidateResolutionForStore();
			createSuccessNotice(
				__('Default parcel template updated.', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (err) {
			console.error(err);
			setError(err);
		} finally {
			setBusy(false);
		}
	};

	return (
		<SettingsBox
			title={__('Parcel Templates', 'surecart')}
			description={__(
				'Create reusable parcel templates for shipping.',
				'surecart'
			)}
			end={
				parcels.length > 0 && (
					<ScButton
						type="primary"
						onClick={() => setCurrentModal(modals.MODAL_ADD)}
					>
						<ScIcon name="plus" /> {__('Add New', 'surecart')}
					</ScButton>
				)
			}
			loading={loading}
			noButton
			wrapperTag="div"
		>
			<Error error={error} setError={setError} />

			{!!sortedParcels.length && (
				<ScCard noPadding>
					<ScStackedList>
						{sortedParcels.map((parcel) => (
							<ScStackedListRow
								key={parcel.id}
								style={{
									'--columns': '2',
								}}
							>
								<ScIcon
									name={
										parcel.package_type === 'poly_mailer'
											? 'mail'
											: 'package'
									}
									slot="prefix"
									css={css`
										font-size: 20px;
										color: var(--sc-color-gray-500);
									`}
								/>
								<div css={css`min-width: 0;`}>
									<div
										css={css`
											display: flex;
											align-items: center;
											gap: var(--sc-spacing-x-small);
											min-width: 0;
										`}
									>
										<strong
											title={parcel.name}
											css={css`
												overflow: hidden;
												text-overflow: ellipsis;
												white-space: nowrap;
												min-width: 0;
											`}
										>
											{parcel.name}
										</strong>
										{parcel.default && (
											<ScTag type="primary" size="small">
												{__('Default', 'surecart')}
											</ScTag>
										)}
									</div>
									<div
										css={css`
											color: var(--sc-color-gray-500);
											font-size: var(
												--sc-font-size-small
											);
											margin-top: var(
												--sc-spacing-xx-small
											);
										`}
									>
										{[
											TYPE_LABELS[parcel.package_type] ||
												parcel.package_type,
											getDimensionsSummary(parcel),
											parcel.weight &&
												`${parcel.weight} ${parcel.weight_unit}`,
										]
											.filter(Boolean)
											.join(' · ')}
									</div>
								</div>
								<div>
									<ScDropdown
										slot="suffix"
										placement="bottom-end"
									>
										<ScButton
											type="text"
											slot="trigger"
											size="small"
											circle
										>
											<ScIcon name="more-horizontal" />
										</ScButton>
										<ScMenu>
											<ScMenuItem
												onClick={() => {
													setSelectedParcel(parcel);
													setCurrentModal(
														modals.MODAL_EDIT
													);
												}}
											>
												<ScIcon
													slot="prefix"
													name="edit"
												/>
												{__('Edit', 'surecart')}
											</ScMenuItem>
											{!parcel.default && (
												<ScMenuItem
													onClick={() =>
														handleSetDefault(parcel)
													}
												>
													<ScIcon
														slot="prefix"
														name="check-circle"
													/>
													{__(
														'Set as Default',
														'surecart'
													)}
												</ScMenuItem>
											)}
											{!parcel.default && (
												<ScMenuItem
													onClick={() =>
														setDeleteTarget(parcel)
													}
												>
													<ScIcon
														slot="prefix"
														name="trash"
													/>
													{__('Delete', 'surecart')}
												</ScMenuItem>
											)}
										</ScMenu>
									</ScDropdown>
								</div>
							</ScStackedListRow>
						))}
					</ScStackedList>
				</ScCard>
			)}

			{!parcels.length && !loading && (
				<ScCard noPadding>
					<ScEmpty>
						{__(
							'No parcel templates yet. Create one to get started.',
							'surecart'
						)}
						<ScButton
							type="default"
							onClick={() => setCurrentModal(modals.MODAL_ADD)}
						>
							<ScIcon name="plus" /> {__('Add New Template', 'surecart')}
						</ScButton>
					</ScEmpty>
				</ScCard>
			)}

			{hasPagination && (
				<PrevNextButtons
					data={parcels}
					page={currentPage}
					setPage={setCurrentPage}
					perPage={PER_PAGE}
					loading={loading}
				/>
			)}

			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}

			{currentModal && (
				<ParcelTemplateForm
					open={
						currentModal === modals.MODAL_ADD ||
						currentModal === modals.MODAL_EDIT
					}
					isEdit={currentModal === modals.MODAL_EDIT}
					onRequestClose={() => {
						setCurrentModal(null);
						setSelectedParcel(null);
					}}
					selectedParcel={selectedParcel}
				/>
			)}

			{deleteTarget && (
				<ScDialog
					open
					onScRequestClose={() => setDeleteTarget(null)}
					label={__('Delete Parcel Template', 'surecart')}
				>
					{__(
						'Are you sure you want to delete this parcel template? This action cannot be undone.',
						'surecart'
					)}
					<ScFlex justifyContent="flex-start" slot="footer">
						<ScButton
							type="primary"
							disabled={busy}
							onClick={() => handleDelete(deleteTarget.id)}
						>
							{__('Delete', 'surecart')}
						</ScButton>
						<ScButton
							type="text"
							onClick={() => setDeleteTarget(null)}
							disabled={busy}
						>
							{__('Cancel', 'surecart')}
						</ScButton>
					</ScFlex>
					{busy && (
						<ScBlockUi
							style={{ '--sc-block-ui-opacity': '0.75' }}
							spinner
						/>
					)}
				</ScDialog>
			)}
		</SettingsBox>
	);
};
