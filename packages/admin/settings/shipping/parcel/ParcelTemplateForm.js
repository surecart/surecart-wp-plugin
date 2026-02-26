/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
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
	{ label: __('Polymailer (Envelope)', 'surecart'), value: 'polymailer' },
];

export default ({ selectedParcel, isEdit, onRequestClose, open, onSave }) => {
	const [parcel, setParcel] = useState({
		name: '',
		type: 'box',
		dimensions: { length: '', width: '', height: '', unit: 'in' },
		weight: '',
		weight_unit: 'lb',
		is_default: false,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isEdit && selectedParcel) {
			setParcel({ ...selectedParcel });
		} else if (!isEdit) {
			setParcel({
				name: '',
				type: 'box',
				dimensions: { length: '', width: '', height: '', unit: 'in' },
				weight: '',
				weight_unit: 'lb',
				is_default: false,
			});
		}
	}, [selectedParcel, isEdit, open]);

	const onSubmit = async () => {
		setLoading(true);
		setError(null);

		try {
			if (!parcel.name) {
				throw {
					message: __('Parcel name is required.', 'surecart'),
				};
			}

			const templateToSave = isEdit
				? { ...parcel }
				: { ...parcel, id: Date.now() };

			// Clear height when type is polymailer.
			if (templateToSave.type === 'polymailer') {
				templateToSave.dimensions = {
					...templateToSave.dimensions,
					height: '',
				};
			}

			onSave(templateToSave);
			onRequestClose();
		} catch (err) {
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
					? __('Edit Parcel Template', 'surecart')
					: __('Add New Parcel Template', 'surecart')
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
				onScFormSubmit={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
				}}
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-x-large);
					`}
				>
					<ScInput
						required
						label={__('Name', 'surecart')}
						onScInput={(e) =>
							setParcel({
								...parcel,
								name: e.target.value,
							})
						}
						name="parcel-name"
						value={parcel.name}
					/>

					<div
						css={css`
							font-size: 16px;
							--wp-components-color-foreground: var(
								--sc-color-primary-500
							);
							.components-base-control__label {
								color: var(--sc-input-label-color);
								font-weight: var(
									--sc-input-label-font-weight
								);
								font-size: var(
									--sc-input-label-font-size-medium
								);
								text-transform: none;
							}
						`}
					>
						<ToggleGroupControl
							value={parcel.type}
							label={__('Type', 'surecart')}
							onChange={(value) =>
								setParcel({
									...parcel,
									type: value,
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
						hideHeight={parcel.type === 'polymailer'}
						dimensions={parcel.dimensions}
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
							value={parcel.weight}
							type="number"
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

					<ScSwitch
						checked={parcel.is_default}
						onScChange={(e) =>
							setParcel({
								...parcel,
								is_default: e.target.checked,
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
