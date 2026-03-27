import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { createErrorString } from '../../../util';
import apiFetch from '@wordpress/api-fetch';

export default () => {
	const [loading, setLoading] = useState(null);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const syncProducts = async () => {
		try {
			setLoading(true);
			await apiFetch({
				method: 'POST',
				path: '/surecart/v1/products/sync_all',
			});
			createSuccessNotice(
				__('Product sync started in the background', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), { type: 'snackbar' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScButton onClick={() => syncProducts()} loading={loading}>
			<ScIcon name="refresh-ccw" slot="prefix"></ScIcon>
			{__('Sync', 'surecart')}
		</ScButton>
	);
};
