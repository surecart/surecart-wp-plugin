/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScButton, ScIcon, ScSkeleton } from '@surecart/components-react';
import { CheckboxControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { _n, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';

export default ({
	countryIsoCode,
	countryName,
	statesCount = 0,
	value,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [territories, setTerritories] = useState([]);
	const { createErrorNotice } = useDispatch(noticesStore);

	useEffect(() => {
		if (!isOpen) return;

		fetchTerritories();
	}, [isOpen]);

	const fetchTerritories = useCallback(async () => {
		try {
			setFetching(true);
			const country = await apiFetch({
				path: `surecart/v1/public/atlas/${countryIsoCode}`,
			});
			const territories = (country?.states || []).filter(
				(region) => !!region?.code
			);
			setTerritories(territories);
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setFetching(false);
		}
	}, [countryIsoCode, apiFetch, createErrorNotice]);

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
				.map((territory) => territory?.code)
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
			if (newStates.length === statesCount) {
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
						value?.states?.length < statesCount
					}
					label={countryName}
					css={css`
						padding: var(--sc-spacing-large);
					`}
					__nextHasNoMarginBottom
					checked={
						value?.country === countryIsoCode &&
						(value?.states?.length === 0 ||
							value?.states?.length === statesCount)
					}
					onChange={onSelectCountry}
				/>
				{statesCount > 0 && (
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
								statesCount,
								'surecart'
							),
							statesCount
						)}
						<ScIcon
							slot="suffix"
							name={isOpen ? 'chevron-up' : 'chevron-down'}
						/>
					</ScButton>
				)}
			</div>

			{isOpen && !fetching && (
				<div>
					{(territories || [])?.map((region) => {
						return (
							<CheckboxControl
								label={region?.name}
								checked={
									isCountryFullySelected ||
									(value?.states || []).includes(region?.code)
								}
								onChange={(checked) =>
									onChangeTerritory(checked, region?.code)
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
