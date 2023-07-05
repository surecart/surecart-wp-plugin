/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useState } from '@wordpress/element';
import Error from '../../../components/Error';
import { removeQueryArgs } from '@wordpress/url';
import { useDispatch } from '@wordpress/data';

export default ({ shippingProfileId, open, onRequestClose }) => {
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const onDeleteProfile = async () => {
		setLoading(true);
		try {
			await deleteEntityRecord(
				'surecart',
				'shipping-profile',
				shippingProfileId,
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Shipping profile deleted', 'surecart'), {
				type: 'snackbar',
			});
			window.location.assign(
				removeQueryArgs(window.location.href, 'type', 'profile')
			);
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
			label={__('Delete Shipping Profile', 'surecart')}
		>
			<Error error={error} setError={setError} />
			<div>
				{__(
					'Are you sure you want to delete shipping profile? Deleting the shipping profile will remove associated shipping rates and shipping zones.',
					'surecart'
				)}
			</div>
			<ScFlex justifyContent="flex-start" slot="footer">
				<ScButton
					type="primary"
					disabled={loading}
					onClick={onDeleteProfile}
				>
					{__('Delete', 'surecart')}
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
