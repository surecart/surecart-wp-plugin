/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticeStore } from '@wordpress/notices';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
	ScInput,
	ScSelect,
	ScSwitch,
} from '@surecart/components-react';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import Dimensions from '../../../ui/Dimensions';
import Error from '../../../components/Error';

const WEIGHT_UNIT_CHOICES = [
	{ label: __('lb', 'surecart'), value: 'lb' },
	{ label: __('kg', 'surecart'), value: 'kg' },
	{ label: __('oz', 'surecart'), value: 'oz' },
	{ label: __('g', 'surecart'), value: 'g' },
];

const PARCEL_TYPE_CHOICES = [
	{ label: __('Box or Tube', 'surecart'), value: 'box' },
	{ label: __('Polymailer (Envelope)', 'surecart'), value: 'poly_mailer' },
];

const DEFAULT_PARCEL = {
	name: '',
	package_type: 'box',
	dimensions: { length: '', width: '', height: '', unit: 'cm' },
	weight: '',
	weight_unit: 'kg',
	default: false,
};

export default ({ selectedParcel, isEdit, onRequestClose, open }) => {
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticeStore);

	const [parcel, setParcel] = useState(() => {
		if (isEdit && selectedParcel) {
			return { ...DEFAULT_PARCEL, ...selectedParcel };
		}
		return { ...DEFAULT_PARCEL };
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const isEditingDefault = isEdit && selectedParcel?.default;

	useEffect(() => {
		if (isEdit && selectedParcel) {
			setParcel({ ...DEFAULT_PARCEL, ...selectedParcel });
		} else if (!isEdit) {
			setParcel({ ...DEFAULT_PARCEL });
		}
	}, [selectedParcel, isEdit, open]);

	const onSubmit = async () => {
		setLoading(true);
		setError(null);

		try {
			const data = { ...parcel };

			// Include ID for edit (triggers PATCH), omit for create (triggers POST).
			if (isEdit && selectedParcel?.id) {
				data.id = selectedParcel.id;
			} else {
				delete data.id;
			}

			// Clean up dimensions — omit if all values are empty, otherwise convert empty strings to undefined.
			if (data.dimensions) {
				const dims = { ...data.dimensions };

				// Clear height when type is poly_mailer.
				if (data.package_type === 'poly_mailer') {
					delete dims.height;
				}

				const { unit, ...values } = dims;
				const hasValues = Object.values(values).some((v) => !!v);

				if (!hasValues) {
					delete data.dimensions;
				} else {
					data.dimensions = {
						...Object.fromEntries(
							Object.entries(dims).filter(([, v]) => !!v)
						),
						unit: unit || 'cm',
					};
				}
			}

			await saveEntityRecord('surecart', 'parcel-template', data, {
				throwOnError: true,
			});

			await invalidateResolutionForStore();

			createSuccessNotice(
				isEdit
					? __('Parcel template updated.', 'surecart')
					: __('Parcel template added.', 'surecart'),
				{ type: 'snackbar' }
			);

			onRequestClose();
		} catch (err) {
			console.error(err);
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			open={open}
			label={
				isEdit
					? __('Edit', 'surecart')
					: __('Add New', 'surecart')
			}
			onScRequestClose={onRequestClose}
			style={{ '--dialog-body-overflow': 'visible' }}
		>
			<Error error={error} setError={setError} />
			<ScForm
				onScSubmit={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					onSubmit();
				}}
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-x-large);
					`}
				>
					<div
						css={css`
							font-size: 16px;
							--wp-components-color-foreground: var(
								--sc-color-primary-500
							);
							.components-base-control__label {
								color: var(--sc-input-label-color);
								font-weight: var(--sc-input-label-font-weight);
								font-size: var(
									--sc-input-label-font-size-medium
								);
								text-transform: none;
							}
						`}
					>
						<ToggleGroupControl
							value={parcel.package_type}
							label={__('Type', 'surecart')}
							onChange={(value) =>
								setParcel({
									...parcel,
									package_type: value,
								})
							}
							isBlock
							__next40pxDefaultSize
						>
							{PARCEL_TYPE_CHOICES.map((option) => (
								<ToggleGroupControlOption
									key={option.value}
									value={option.value}
									label={option.label}
								/>
							))}
						</ToggleGroupControl>
					</div>

					<Dimensions
						hideHeight={parcel.package_type === 'poly_mailer'}
						dimensions={parcel.dimensions}
						required
						updateDimensions={({ dimensions }) =>
							setParcel({
								...parcel,
								dimensions,
							})
						}
					/>

					<div
						css={css`
							display: flex;
							gap: var(--sc-spacing-small);
							align-items: flex-end;
						`}
					>
						<ScInput
							css={css`
								flex: 3;
							`}
							label={__('Weight', 'surecart')}
							name="parcel-weight"
							value={parcel.weight}
							type="number"
							step={0.01}
							placeholder="0"
							min="0"
							onScInput={(e) =>
								setParcel({
									...parcel,
									weight: e.target.value,
								})
							}
						/>
						<ScSelect
							label={__('Unit', 'surecart')}
							css={css`
								flex: 1;
							`}
							unselect={false}
							value={parcel.weight_unit}
							choices={WEIGHT_UNIT_CHOICES}
							onScChange={(e) =>
								setParcel({
									...parcel,
									weight_unit: e.target.value,
								})
							}
						/>
					</div>

					<ScInput
						required
						label={__('Name', 'surecart')}
						maxlength={100}
						onScInput={(e) =>
							setParcel({
								...parcel,
								name: e.target.value,
							})
						}
						name="parcel-name"
						value={parcel.name}
					/>

					{!isEditingDefault && (
						<ScSwitch
							checked={parcel.default}
							onScChange={(e) =>
								setParcel({
									...parcel,
									default: e.target.checked,
								})
							}
						>
							{__('Default Template', 'surecart')}
							<span slot="description">
								{__(
									'Automatically select this parcel template when creating new shipments.',
									'surecart'
								)}
							</span>
						</ScSwitch>
					)}
				</div>

				<ScFlex justifyContent="flex-start">
					<ScButton type="primary" disabled={loading} submit>
						{isEdit
							? __('Update', 'surecart')
							: __('Add', 'surecart')}
					</ScButton>{' '}
					<ScButton
						type="text"
						onClick={onRequestClose}
						disabled={loading}
					>
						{__('Cancel', 'surecart')}
					</ScButton>
				</ScFlex>
			</ScForm>
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
