import { __ } from '@wordpress/i18n';
import { formatAddress } from 'localized-address-format';
import { useEffect, useState } from 'react';

export default ({ address = {} }) => {
	const [countryName, setCountryName] = useState();
	const { name, line_1, line_2, city, state, postal_code, country } = address;

	useEffect(() => {
		let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
		if (country) {
			setCountryName(regionNames.of(country));
		}
	}, [country]);

	const parsedAddress = formatAddress({
		name,
		postalCountry: country,
		administrativeArea: state,
		locality: city,
		postalCode: postal_code,
		addressLines: [line_1, line_2],
	});

	return (
		<>
			{(parsedAddress || []).map((attribute, index) => {
				const isLast = parsedAddress.length === index + 1;
				return !isLast ? (
					<>
						{attribute}
						<br />
					</>
				) : (
					attribute
				);
			})}
			<br />
			{countryName || country}
		</>
	);
};
