import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { ScSkeleton } from '@surecart/components-react';
import { css } from '@emotion/react';

export default ({ address = {} }) => {
	const [fetching, setFetching] = useState(false);
	const [countryDetails, setCountryDetails] = useState(false);
	const { name, line_1, line_2, city, state, postal_code, country } =
		address || {};

	// Mock API call to get address format for country
	useEffect(() => {
		if (!country) return;
		fetchCountryDetails();
	}, [country]);

	const fetchCountryDetails = async () => {
		try {
			setFetching(true);
			const response = await apiFetch({
				path: `surecart/v1/public/atlas/${country}`,
			});
			setCountryDetails(response);
		} catch (e) {
			console.error(e);
		} finally {
			setFetching(false);
		}
	};

	const formatAddressFromString = () => {
		if (!countryDetails) return [];

		const lines =
			countryDetails?.address_formats?.show
				?.match(/{([^}]+)}/g)
				.map((match) => match.slice(1, -1)) || [];

		// Map of placeholders to actual values
		const addressMap = {
			name: name || '',
			line_1: line_1 || '',
			line_2: line_2 || '',
			city: city || '',
			state: state || '',
			postal_code: postal_code || '',
			country: countryDetails?.full_name || country || '',
		};

		return lines
			.map((line) => {
				// Replace all placeholders in the line
				let formattedLine = line;
				Object.keys(addressMap).forEach((placeholder) => {
					if (!addressMap[placeholder]) {
						return;
					}
					formattedLine = formattedLine.replace(
						placeholder,
						addressMap[placeholder]
					);
				});
				return formattedLine.trim();
			})
			.filter((line) => line.length > 0); // Remove empty lines
	};

	const parsedAddress = formatAddressFromString();

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
		<>
			{parsedAddress.map((attribute, index) => {
				const isLast = parsedAddress.length === index + 1;
				return (
					<Fragment key={index}>
						{!isLast ? (
							<>
								{attribute}
								<br />
							</>
						) : (
							attribute
						)}
					</Fragment>
				);
			})}
		</>
	);
};
