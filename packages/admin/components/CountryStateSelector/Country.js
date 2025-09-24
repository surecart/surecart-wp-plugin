/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScButton, ScIcon, ScSkeleton } from '@surecart/components-react';
import { CheckboxControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default ({ countryIsoCode, countryName, value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [country, setCountry] = useState(false);
	const [territories, setTerritories] = useState([]);

	useEffect(() => {
		if (!isOpen) return;

		fetchTerritories();
	}, [isOpen]);

	const fetchTerritories = async () => {
		try {
			setFetching(true);
			const country = await apiFetch({
				path: `surecart/v1/public/atlas/${countryIsoCode}`,
			});
			const territories = (country?.states || []).filter(
				(region) => !!region?.iso_code
			);
			setTerritories(territories);
			setCountry(country);
		} catch (e) {
			console.error(e);
		} finally {
			setFetching(false);
		}
	};

	const territoriesCount = territories.length || 0;

	// when the country is selected, set states as empty array
	const onSelectCountry = (checked) => {
		if (checked) {
			onChange({
				country: countryIsoCode,
				states: [],
			});
		} else {
			onChange(null);
		}
	};

	const onChangeTerritory = (checked, region) => {
		// If country is fully selected and we're unchecking a state
		if (isCountryFullySelected && !checked) {
			// Select all states except the one being unchecked
			const allStatesExceptCurrent = territories
				.map((territory) => territory?.iso_code)
				.filter((state) => state !== region);

			onChange({
				country: countryIsoCode,
				states: allStatesExceptCurrent,
			});
			return;
		}

		if (checked) {
			// Get new states array
			const newStates = [...(value?.states || []), region];

			// If all states are selected, set to empty array
			if (newStates.length === territoriesCount) {
				onChange({
					country: countryIsoCode,
					states: [],
				});
			} else {
				onChange({
					country: countryIsoCode,
					states: newStates,
				});
			}
		} else {
			onChange({
				country: countryIsoCode,
				states: (value?.states || []).filter(
					(state) => state !== region
				),
			});
		}
	};

	// Helper to determine if all states are selected
	const isCountryFullySelected = value?.states?.length === 0;

	return (
		<div
			css={css`
				border-bottom: 1px solid var(--sc-color-gray-100);
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
				`}
			>
				<CheckboxControl
					indeterminate={
						value?.states?.length > 0 &&
						value?.states?.length < territoriesCount
					}
					label={countryName}
					css={css`
						padding: var(--sc-spacing-large);
					`}
					__nextHasNoMarginBottom
					checked={
						value?.country === countryIsoCode &&
						(value?.states?.length === 0 ||
							value?.states?.length === territoriesCount)
					}
					onChange={onSelectCountry}
				/>

				<ScButton
					type="text"
					onClick={() => setIsOpen(!isOpen)}
					css={css`
						&::part(base) {
							font-size: 400;
						}
					`}
				>
					{sprintf(
						_n(
							'%d region',
							'%d regions',
							territoriesCount,
							'surecart'
						),
						territoriesCount
					)}
					<ScIcon
						slot="suffix"
						name={isOpen ? 'chevron-up' : 'chevron-down'}
					/>
				</ScButton>
			</div>

			{isOpen && !fetching && (
				<div>
					{(territories || [])?.map((region) => {
						return (
							<CheckboxControl
								label={region?.name}
								checked={
									isCountryFullySelected ||
									(value?.states || []).includes(
										region?.iso_code
									)
								}
								onChange={(checked) =>
									onChangeTerritory(checked, region?.iso_code)
								}
								__nextHasNoMarginBottom
								css={css`
									padding: var(--sc-spacing-medium);
									padding-left: var(--sc-spacing-xxx-large);
									&:last-child {
										margin-bottom: var(--sc-spacing-medium);
									}
								`}
								key={region?.name}
							/>
						);
					})}
				</div>
			)}
			{fetching && (
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: 1.5em;
						margin-bottom: 2em;
						padding: 1em;
					`}
				>
					<ScSkeleton style={{ width: '45%' }}></ScSkeleton>
					<ScSkeleton style={{ width: '65%' }}></ScSkeleton>
				</div>
			)}
		</div>
	);
};
