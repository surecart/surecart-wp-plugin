/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __, sprintf } from '@wordpress/i18n';
import { Popover, ProgressBar } from '@wordpress/components';
import { useRef, useState, useEffect, useMemo } from '@wordpress/element';
import { useCountries, fetchCountryDetails } from '../../../hooks/useAtlas';

export default function ShippingZoneSummary({ shippingZone }) {
	const anchor = useRef();
	const [isVisible, setIsVisible] = useState(false);
	const { countries, loading } = useCountries();
	const [countryDetails, setCountryDetails] = useState({});

	// Fetch country details for territories that have specific states.
	useEffect(() => {
		const territories = shippingZone?.territories || [];
		if (!countries.length || !territories.length) return;

		async function loadCountryDetails() {
			const territoriesWithStates = territories.filter(
				(t) => t?.states?.length > 0
			);

			const newDetails = {};

			for (const territory of territoriesWithStates) {
				const countryCode = territory?.country;
				if (!countryCode || countryDetails[countryCode]) continue;

				try {
					newDetails[countryCode] = await fetchCountryDetails(countryCode);
				} catch (e) {
					console.error(`Failed to fetch details for ${countryCode}:`, e);
				}
			}

			if (Object.keys(newDetails).length > 0) {
				setCountryDetails((prev) => ({ ...prev, ...newDetails }));
			}
		}

		loadCountryDetails();
	}, [countries, shippingZone?.territories]);

	const zoneTerritoriesSummary = useMemo(() => {
		if (loading || !countries.length) return [];

		const territories = shippingZone?.territories || [];

		return territories.map((territory) => {
			const countryCode = territory?.country;
			const country = countries.find((c) => c.code === countryCode);
			const countryName = country?.name || countryCode;
			const statesCount = territory?.states?.length || 0;

			// Single state selected - show state name.
			if (statesCount === 1) {
				const stateCode = territory.states[0];
				const stateName =
					countryDetails[countryCode]?.states?.find(
						(s) => s.code === stateCode
					)?.name || stateCode;
				return `${countryName} (${stateName})`;
			}

			// Multiple states selected (but not all) - show count.
			const totalStates = country?.states_count || 0;
			if (statesCount > 1 && statesCount !== totalStates) {
				return sprintf(
					// translators: %s is the country name, %d is the number of states in the territory, %d is the total number of states in the country.
					__('%s (%d of %d Regions)', 'surecart'),
					countryName,
					statesCount,
					totalStates
				);
			}

			// All states or no states - just show country name.
			return countryName;
		});
	}, [loading, countries, countryDetails, shippingZone?.territories]);

	const firstTwoTerritories = zoneTerritoriesSummary.slice(0, 2);
	const remainingTerritories = zoneTerritoriesSummary.slice(2);

	// Show loading indicator while fetching countries.
	if (loading) {
		return (
			<span style={{ fontWeight: 'normal' }}>
				{' • '}
				<ProgressBar />
			</span>
		);
	}

	return (
		<span style={{ fontWeight: 'normal' }}>
			{' • '}
			{firstTwoTerritories.join(', ')}
			{remainingTerritories.length > 0 && (
				<>
					{', '}
					<span
						onMouseEnter={() => setIsVisible(true)}
						onMouseLeave={() => setIsVisible(false)}
						css={css`
							cursor: pointer;
						`}
					>
						<span
							style={{ textDecoration: 'underline' }}
							ref={anchor}
						>
							{sprintf(
								__('%d more', 'surecart'),
								remainingTerritories.length
							)}
						</span>
						{isVisible && (
							<Popover
								anchor={anchor.current}
								placement="top-start"
							>
								<div
									css={css`
										padding: 1em;
										width: 200px;
										max-height: 200px;
										overflow-y: auto;
									`}
								>
									{remainingTerritories.join(', ')}
								</div>
							</Popover>
						)}
					</span>
				</>
			)}
		</span>
	);
}
