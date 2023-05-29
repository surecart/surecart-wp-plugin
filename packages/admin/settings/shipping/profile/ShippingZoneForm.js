/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScInput,
	ScFlex,
	ScFormControl,
	ScSelect,
	ScTag,
	ScForm,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import Error from '../../../components/Error';
import { countryChoices } from '@surecart/components';

export default ({
	open,
	onRequestClose,
	shippingProfileId,
	selectedZone,
	isEdit,
}) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [zoneName, setZoneName] = useState('');
	const [zoneCountries, setZoneCountries] = useState([]);
	const { saveEntityRecord } = useDispatch(coreStore);

	useEffect(() => {
		return () => {
			setZoneCountries([]);
			setZoneName('');
			setError();
		};
	}, [open]);

	useEffect(() => {
		if (isEdit) {
			setZoneName(selectedZone?.name || '');
			setZoneCountries(selectedZone?.countries || []);
		}
	}, [isEdit]);

	const addShippingZone = async () => {
		await saveEntityRecord(
			'surecart',
			'shipping-zone',
			{
				name: zoneName,
				shipping_profile_id: shippingProfileId,
				countries: zoneCountries,
			},
			{ throwOnError: true }
		);
	};

	const editShippingZone = async () => {
		await saveEntityRecord(
			'surecart',
			'shipping-zone',
			{
				id: selectedZone.id,
				name: zoneName,
				countries: zoneCountries,
			},
			{ throwOnError: true }
		);
	};

	const onSubmit = async () => {
		if (!zoneCountries.length) {
			setError({
				message: __(
					'Select at least one country to create zone.',
					'surecart'
				),
			});
			return;
		}

		setLoading(true);
		try {
			if (isEdit) {
				await editShippingZone();
			} else {
				await addShippingZone();
			}

			onRequestClose();
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	const onCountrySelect = (e) => {
		const value = e.target.value;
		if (!value) return;

		setZoneCountries([...zoneCountries, value]);
	};

	const onRemoveZoneCountry = (value) => {
		setZoneCountries(
			zoneCountries.filter((zoneCountry) => zoneCountry !== value)
		);
	};

	const renderCountryPill = (zoneCountry) => {
		const country = countryChoices.find(
			(countryChoice) => countryChoice.value === zoneCountry
		);
		return (
			<ScTag
				key={`zone-country-${country.value}`}
				pill
				clearable
				onScClear={() => onRemoveZoneCountry(country.value)}
			>
				{country.label}
			</ScTag>
		);
	};

	return (
		<ScDialog
			open={open}
			label={
				isEdit
					? __('Edit Zone', 'surecart')
					: __('Add Zone', 'surecart')
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
				<ScFlex
					flexDirection="column"
					css={css`
						gap: var(--sc-spacing-medium);
					`}
				>
					<ScInput
						required
						label={__('Zone Name', 'surecart')}
						onScInput={(e) => setZoneName(e.target.value)}
						name="zone-name"
						value={zoneName}
						placeholder={__(
							'United States,  United Kingdom, Global ...',
							'surecart'
						)}
					/>
					<ScFormControl label={__('Select Countries', 'surecart')}>
						{!!zoneCountries.length ? (
							<ScFlex
								columnGap="1em"
								justifyContent="flex-start"
								css={css`
									padding: 0.44em 0;
									margin-bottom: var(--sc-spacing-medium);
								`}
								flexWrap="wrap"
							>
								{zoneCountries.map((zoneCountry) =>
									renderCountryPill(zoneCountry)
								)}
							</ScFlex>
						) : null}
						<ScSelect
							search
							onScChange={onCountrySelect}
							choices={countryChoices.filter(
								(countryChoice) =>
									!zoneCountries.includes(countryChoice.value)
							)}
							value=""
						/>
					</ScFormControl>
				</ScFlex>
				<ScFlex justifyContent="flex-start">
					<ScButton type="primary" disabled={loading} submit={true}>
						{isEdit
							? __('Save', 'surecart')
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
