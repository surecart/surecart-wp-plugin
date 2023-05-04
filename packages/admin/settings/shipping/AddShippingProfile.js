/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScInput,
	ScFlex,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import Error from '../../components/Error';
import { addQueryArgs } from '@wordpress/url';

export default ({ open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [profileName, setProfileName] = useState('');

	const onSubmit = async (e) => {
		if (!profileName) {
			setError({ message: 'The profile name is required.' });
			return;
		}

		setLoading(true);
		try {
			const response = await apiFetch({
				path: 'surecart/v1/shipping_profiles',
				data: {
					name: profileName,
				},
				method: 'POST',
			});

			if (!!response?.id) {
				onRequestClose();
				window.location.assign(
					addQueryArgs(window.location.href, {
						type: 'shipping_profile',
						profile: response.id,
					})
				);
			}
		} catch (error) {
			console.error(error);
			if (error?.additional_errors?.[0]?.message) {
				setError(error?.additional_errors?.[0]?.message);
			} else {
				setError(
					error?.message ||
						__('Failed to add shipping profile.', 'surecart')
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			open={open}
			onScRequestClose={onRequestClose}
			label={__('Add Shipping Profile', 'surecart')}
		>
			<Error error={error} setError={setError} />
			<ScInput
				required
				label={__('Name', 'surecart')}
				help={__(
					'A name for this bump that will be visible to customers.',
					'surecart'
				)}
				onScInput={(e) => setProfileName(e.target.value)}
				name="name"
			/>
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
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
