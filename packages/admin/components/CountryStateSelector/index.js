/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { SearchControl } from '@wordpress/components';
import { ScSkeleton, ScTag } from '@surecart/components-react';
import Country from './Country';
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default ({ value, onChange }) => {
	const [search, setSearch] = useState('');
	const [fetching, setFetching] = useState(false);
	const [allCountries, setAllCountries] = useState([]);
	const { createErrorNotice } = useDispatch(noticesStore);

	useEffect(() => {
		fetchAllCountries();
	}, []);

	const fetchAllCountries = async () => {
		try {
			setFetching(true);
			const countries = await apiFetch({
				path: `surecart/v1/public/atlas?locale=${
					window?.scData?.locale || 'en'
				}`,
			});
			setAllCountries(countries?.data);
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setFetching(false);
		}
	};

	const countries = useMemo(() => {
		if (!allCountries?.length) return [];

		const searchLower = search.toLowerCase();
		return allCountries.filter((country) =>
			country?.name?.toLowerCase().includes(searchLower)
		);
	}, [allCountries, search]);

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

	if (fetching) {
		return (
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
		);
	}

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
			{value?.length > 0 && (
				<div
					css={css`
						padding: 0 var(--sc-spacing-medium)
							var(--sc-spacing-medium);
						display: flex;
						flex-wrap: wrap;
						gap: var(--sc-spacing-x-small);
					`}
				>
					{value.map((item) => {
						const country = allCountries.find(
							(c) => c.code === item.country
						);
						return (
							<ScTag
								key={item.country}
								size="small"
								clearable
								pill
								onScClear={() =>
									onChangeSelection(null, item.country)
								}
							>
								{country?.name || item.country}
							</ScTag>
						);
					})}
				</div>
			)}
			<div
				css={css`
					height: 300px;
					overflow-y: auto;
				`}
				role="listbox"
				aria-label={__('Countries and regions list', 'surecart')}
			>
				{countries.map((country) => (
					<Country
						key={country?.code}
						countryIsoCode={country?.code}
						countryName={country?.name}
						value={value.find((v) => v.country === country?.code)}
						onChange={(newValue) =>
							onChangeSelection(newValue, country?.code)
						}
						statesCount={country?.states_count}
					/>
				))}
			</div>
		</div>
	);
};
