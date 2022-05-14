import { ScButton } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

import Box from '../../../ui/Box';
import NewIntegration from './NewIntegration';
import Integration from './Integration';

export default ({ id }) => {
	const [modal, setModal] = useState(false);

	const { integrations, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'root',
				'integration',
				{ context: 'edit', model_ids: [id] },
			];
			return {
				integrations: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

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
			{(integrations || []).map((integration) => (
				<Integration key={integration?.id} integration={integration} />
			))}

			{!!modal && (
				<NewIntegration
					id={id}
					onRequestClose={() => setModal(false)}
				/>
			)}
		</Box>
	);
};
