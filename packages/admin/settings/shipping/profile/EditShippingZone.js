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
import apiFetch from '@wordpress/api-fetch';
import Error from '../../../components/Error';
import { useDispatch } from '@wordpress/data';
import { countryChoices } from '@surecart/components';
import { store as noticesStore } from '@wordpress/notices';

export default ({ open, onRequestClose, selectedZone }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [zoneName, setZoneName] = useState('');
	const [zoneCountries, setZoneCountries] = useState([]);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		if (selectedZone) {
			setZoneName(selectedZone.name);
			setZoneCountries(selectedZone.countries);
		}

		return () => {
			setZoneCountries([]);
			setZoneName('');
			setError();
		};
	}, [open]);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!zoneCountries.length) {
			setError({
				message: 'Select at least one country to edit zone.',
			});
			return;
		}

		setLoading(true);
		try {
			await apiFetch({
				path: `surecart/v1/shipping_zones/${selectedZone.id}`,
				data: {
					name: zoneName,
					countries: zoneCountries,
				},
				method: 'PATCH',
			});
			onRequestClose();
			createSuccessNotice(__('Shipping zone edited.', 'surecart'));
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
				key={`zone-country-${country?.value}`}
				pill
				clearable
				onScClear={() => onRemoveZoneCountry(country?.value)}
			>
				{country?.label}
			</ScTag>
		);
	};

	return (
		<ScDialog
			open={open}
			label={__('Edit Zone')}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScForm onScFormSubmit={onSubmit}>
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
					/>
					<ScFormControl
						label={__('Select Countries', 'surecart')}
						css={css`
							min-height: 20rem;
						`}
					>
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
						{__('Edit', 'surecart')}
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
