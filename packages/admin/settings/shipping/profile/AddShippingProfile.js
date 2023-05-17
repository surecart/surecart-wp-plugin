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
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import Error from '../../../components/Error';

export default ({ open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [profileName, setProfileName] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		if (!profileName) {
			setError({
				message: __('The profile name is required.', 'surecart'),
			});
			return;
		}

		setLoading(true);
		try {
			const response = await saveEntityRecord(
				'surecart',
				'shipping-profile',
				{
					name: profileName,
				}
			);

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
			setError(error);
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
