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
	const [zoneCountries, setZoneCountries] = useState([]);

	const onSubmit = () => {};

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
				<ScFormControl label={__('Select Countries', 'surecart')}>
					<ScSelect
						search
						onScChange={(e) => {
							console.log(e.target.value);
						}}
						choices={countryChoices}
						required
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
