/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { SearchControl } from '@wordpress/components';
import { allCountries } from 'country-region-data';
import { useState } from 'react';
import Country from './Country';
import { __ } from '@wordpress/i18n';

export default ({ value, onChange }) => {
	const [search, setSearch] = useState('');

	const countries = allCountries.filter(
		(country) =>
			country[0].toLowerCase().includes(search.toLowerCase()) ||
			country[2].find((state) => {
				return state[0].toLowerCase().includes(search.toLowerCase());
			})
	);

	const onChangeSelection = (newValue, country) => {
		// country removed.
		if (newValue === null) {
			return onChange((prev) =>
				prev.filter((v) => v.country !== country)
			);
		}

		// Find the country in the array
		const index = value.findIndex((v) => v.country === country);

		onChange((prev) => {
			if (index === -1) {
				// Country not found, add it to the array
				return [...prev, newValue];
			} else {
				// Country found, update it
				const newValues = [...prev];
				newValues[index] = newValue;
				return newValues;
			}
		});
	};

	return (
		<div
			css={css`
				border: 1px solid var(--sc-color-gray-200);
				border-radius: var(--sc-input-border-radius-medium);
				background: #fff;
			`}
		>
			<div
				css={css`
					padding: var(--sc-spacing-medium);
					position: sticky;
				`}
			>
				<SearchControl
					value={search}
					placeholder={__(
						'Search countries and regions to ship to',
						'surecart'
					)}
					onChange={setSearch}
					__nextHasNoMarginBottom
				/>
			</div>
			<div
				css={css`
					height: 400px;
					overflow-y: auto;
				`}
			>
				{countries.map((country) => (
					<Country
						key={country[0]}
						country={country}
						value={value.find((v) => v.country === country[1])}
						onChange={(newValue) =>
							onChangeSelection(newValue, country[1])
						}
					/>
				))}
			</div>
		</div>
	);
};
