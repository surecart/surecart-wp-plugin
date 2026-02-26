/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import SettingsBox from '../../SettingsBox';
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScEmpty,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScStackedListRow,
} from '@surecart/components-react';
import ParcelTemplateForm from './ParcelTemplateForm';

const STORAGE_KEY = 'sc_parcel_templates';

const getParcelTemplates = () => {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
	} catch {
		return [];
	}
};

const saveParcelTemplates = (templates) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

const TYPE_LABELS = {
	box: __('Box or Tube', 'surecart'),
	polymailer: __('Polymailer (Envelope)', 'surecart'),
};

const getDimensionsSummary = (parcel) => {
	const { dimensions, type } = parcel;
	if (!dimensions) return '\u2013';

	const { length, width, height, unit } = dimensions;
	const parts = [length, width];
	if (type !== 'polymailer' && height) {
		parts.push(height);
	}

	const hasValues = parts.some((v) => v && v !== '0');
	if (!hasValues) return '\u2013';

	return parts.filter(Boolean).join(' × ') + (unit ? ` ${unit}` : '');
};

const modals = {
	MODAL_ADD: 'add-parcel-template',
	MODAL_EDIT: 'edit-parcel-template',
};

export default () => {
	const [parcels, setParcels] = useState(getParcelTemplates);
	const [currentModal, setCurrentModal] = useState(null);
	const [selectedParcel, setSelectedParcel] = useState(null);

	const handleSave = (template) => {
		let updated;

		if (template.is_default) {
			// Unset default on all others.
			updated = parcels.map((p) => ({ ...p, is_default: false }));
		} else {
			updated = [...parcels];
		}

		const existingIndex = updated.findIndex((p) => p.id === template.id);
		if (existingIndex >= 0) {
			updated[existingIndex] = template;
		} else {
			updated.push(template);
		}

		saveParcelTemplates(updated);
		setParcels(updated);
	};

	const handleDelete = (id) => {
		const updated = parcels.filter((p) => p.id !== id);
		saveParcelTemplates(updated);
		setParcels(updated);
	};

	return (
		<SettingsBox
			title={__('Parcel Templates', 'surecart')}
			description={__(
				'Create reusable parcel templates for shipping.',
				'surecart'
			)}
			noButton
			wrapperTag="div"
		>
			{!!parcels.length && (
				<ScCard noPadding>
					<ScStackedList>
						{parcels.map((parcel) => (
							<ScStackedListRow
								key={parcel.id}
								style={{
									'--columns': '4',
								}}
							>
								<strong>
									{parcel.name}
									{parcel.is_default && (
										<span
											css={css`
												margin-left: var(
													--sc-spacing-x-small
												);
												font-size: 0.75em;
												font-weight: normal;
												color: var(
													--sc-color-primary-500
												);
											`}
										>
											({__('Default', 'surecart')})
										</span>
									)}
								</strong>
								<div
									css={css`
										color: var(--sc-color-gray-600);
									`}
								>
									{TYPE_LABELS[parcel.type] || parcel.type}
								</div>
								<div
									css={css`
										color: var(--sc-color-gray-600);
									`}
								>
									{getDimensionsSummary(parcel)}
									{parcel.weight
										? ` · ${parcel.weight} ${parcel.weight_unit}`
										: ''}
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
													handleDelete(parcel.id)
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

			{!parcels.length && (
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
					onSave={handleSave}
				/>
			)}
		</SettingsBox>
	);
};
