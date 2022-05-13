import { ScButton } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import Box from '../../../ui/Box';
import New from './new';

export default ({ id }) => {
	const [modal, setModal] = useState(false);
	const [integrations, setIntegrations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (id) {
			fetchIntegrations(id);
		}
	}, [id]);

	const fetchIntegrations = async (id) => {
		try {
			setLoading(true);
			const response = await apiFetch({
				path: addQueryArgs('/surecart/v1/integrations', {
					surecart_model_ids: [id],
				}),
			});
			console.log({ response });
			setIntegrations(response);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('An error occurred', 'surecaret'));
		} finally {
			setLoading(false);
		}
	};

	const renderIntegrations = () => {
		if (error) {
			return (
				<sc-alert open type="danger">
					{error}
				</sc-alert>
			);
		}
		if (loading) {
			return 'loading...';
		}
		return (integrations || []).map((integration) => {
			return <p>{integration?.id}</p>;
		});
	};

	return (
		<Box
			loading={loading}
			title={__('Integrations', 'surecart')}
			footer={
				<ScButton onClick={() => setModal(true)}>
					<sc-icon name="plus" slot="prefix"></sc-icon>
					{__('Add New Integration', 'surecart')}
				</ScButton>
			}
		>
			{renderIntegrations()}
			{!!modal && <New onRequestClose={() => setModal(false)} />}
		</Box>
	);
};
