/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
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

	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticeStore);

	const { records: parcels, isResolving: loading } = useEntityRecords(
		'surecart',
		'parcel-template',
		{
			per_page: 100, // Upper bound; pagination not expected for parcel templates.
		}
	);

	const handleDelete = async (id) => {
		setBusy(true);
		try {
			await deleteEntityRecord('surecart', 'parcel-template', id, {
				throwOnError: true,
			});
			createSuccessNotice(
				__('Parcel template removed', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (err) {
			console.error(err);
			setError(err);
		} finally {
			setBusy(false);
			setDeleteTarget(null);
		}
	};

	return (
		<SettingsBox
			title={__('Parcel Templates', 'surecart')}
			description={__(
				'Create reusable parcel templates for shipping.',
				'surecart'
			)}
			loading={loading}
			noButton
			wrapperTag="div"
		>
			<Error error={error} setError={setError} />

			{!!(parcels || []).length && (
				<ScCard noPadding>
					<ScStackedList>
						{parcels.map((parcel) => (
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
								<div>
									<div
										css={css`
											display: flex;
											align-items: center;
											gap: var(--sc-spacing-x-small);
										`}
									>
										<strong>{parcel.name}</strong>
										{parcel.default && (
											<ScTag
												type="primary"
												size="small"
											>
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
										</ScMenu>
									</ScDropdown>
								</div>
							</ScStackedListRow>
						))}
					</ScStackedList>
				</ScCard>
			)}

			{!(parcels || []).length && !loading && (
				<ScCard noPadding>
					<ScEmpty>
						{__(
							'No parcel templates yet. Create one to get started.',
							'surecart'
						)}
					</ScEmpty>
				</ScCard>
			)}

			<div
				css={css`
					margin-top: var(--sc-spacing-medium);
				`}
			>
				<ScButton
					onClick={() => setCurrentModal(modals.MODAL_ADD)}
				>
					<ScIcon name="plus" slot="prefix" />
					{__('Add New Template', 'surecart')}
				</ScButton>
			</div>

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
