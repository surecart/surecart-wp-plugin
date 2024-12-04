/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScButton, ScIcon } from '@surecart/components-react';
import { CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _n } from '@wordpress/i18n';

export default ({ country, value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const territories = (country[2] || []).filter(
		(region) => region[1] && region[1] !== 'undefined'
	);
	const territoriesCount = territories.length || 0;

	// when the country is selected, set states as empty array
	const onSelectCountry = (checked) => {
		if (checked) {
			onChange({
				country: country[1],
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
				.map((territory) => territory[1])
				.filter((state) => state !== region);

			onChange({
				country: country[1],
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
					country: country[1],
					states: [],
				});
			} else {
				onChange({
					country: country[1],
					states: newStates,
				});
			}
		} else {
			onChange({
				country: country[1],
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
					label={country[0]}
					css={css`
						padding: var(--sc-spacing-large);
					`}
					__nextHasNoMarginBottom
					checked={
						value?.country === country[1] &&
						(value?.states?.length === 0 ||
							value?.states?.length === territoriesCount)
					}
					onChange={onSelectCountry}
				/>

				{territoriesCount > 1 && (
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
				)}
			</div>

			{isOpen && (
				<div>
					{territories.map((region) => {
						return (
							<CheckboxControl
								label={region[0]}
								checked={
									isCountryFullySelected ||
									(value?.states || []).includes(region[1])
								}
								onChange={(checked) =>
									onChangeTerritory(checked, region[1])
								}
								__nextHasNoMarginBottom
								css={css`
									padding: var(--sc-spacing-medium);
									padding-left: var(--sc-spacing-xxx-large);
									&:last-child {
										margin-bottom: var(--sc-spacing-medium);
									}
								`}
								key={region[0]}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
