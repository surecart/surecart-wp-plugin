/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __, sprintf } from '@wordpress/i18n';
import { Popover } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { allCountries } from 'country-region-data';

export default ({ shippingZone }) => {
	const anchor = useRef();
	const [isVisible, setIsVisible] = useState(false);
	const zoneTerritoriesSummary = (shippingZone?.territories || []).map(
		(territory) => {
			const countryName = allCountries.find(
				(country) => country[1] === territory?.country
			)[0];

			if (territory?.states?.length === 1) {
				const stateName = allCountries
					.find((country) => country[1] === territory?.country)[2]
					.find((state) => state[1] === territory?.states[0])?.[0];
				return `${countryName} (${stateName})`;
			}

			const total = allCountries.find(
				(country) => country[1] === territory?.country
			);
			const totalStates = total[2]?.length || 0;

			if (
				territory?.states?.length > 1 &&
				totalStates !== territory?.states?.length
			) {
				return sprintf(
					// translators: %s is the country name, %d is the number of states in the territory, %d is the total number of states in the country.
					__('%s (%d of %d Regions)', 'surecart'),
					countryName,
					territory?.states?.length,
					totalStates
				);
			}

			return countryName;
		}
	);

	const firstTwoTerritories = zoneTerritoriesSummary.slice(0, 2);
	const remainingTerritories = zoneTerritoriesSummary.slice(2);

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
};
