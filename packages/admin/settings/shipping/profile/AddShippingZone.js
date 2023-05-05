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
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import Error from '../../../components/Error';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { countryChoices } from '@surecart/components';

export default ({ open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [zoneName, setZoneName] = useState('');
	const [zoneCountries, setZoneCountries] = useState({});
	const [formattedChoices, setFormattedChoices] = useState({});

	useEffect(() => {
		if (open) {
			setFormattedChoices(
				countryChoices.reduce((acc, curr) => {
					acc[curr.value] = curr;
					return acc;
				}, {})
			);
		}

		return () => {
			setZoneCountries({});
		};
	}, [open]);

	const onSubmit = () => {};

	const onCountrySelect = (e) => {
		const value = e.target.value;
		setZoneCountries({
			...zoneCountries,
			[value]: formattedChoices[value],
		});

		delete formattedChoices[value];
		setFormattedChoices({ ...formattedChoices });
	};

	const onRemoveZoneCountry = (value) => {
		formattedChoices[value] = zoneCountries[value];
		delete zoneCountries[value];
		setZoneCountries({ ...zoneCountries });
		setFormattedChoices({ ...formattedChoices });
	};

	return (
		<ScDialog
			open={open}
			label={__('Add Zone')}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
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
						{Object.values(zoneCountries).map((zoneCountry) => (
							<ScTag
								key={`zone-country-${zoneCountry.value}`}
								pill
								clearable
								onScClear={() =>
									onRemoveZoneCountry(zoneCountry.value)
								}
							>
								{zoneCountry.label}
							</ScTag>
						))}
					</ScFlex>
					<ScSelect
						search
						onScChange={onCountrySelect}
						choices={Object.values(formattedChoices)}
						required
						value=""
					/>
				</ScFormControl>
			</ScFlex>
			<ScFlex justifyContent="flex-start" slot="footer">
				<ScButton type="primary" disabled={loading} onClick={onSubmit}>
					{__('Add', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScFlex>
		</ScDialog>
	);
};
