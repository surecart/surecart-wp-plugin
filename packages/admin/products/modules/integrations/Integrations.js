/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScCard, ScStackedList } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { store as dataStore } from '@surecart/data';

import Box from '../../../ui/Box';
import NewIntegration from './NewIntegration';
import Integration from './Integration';

export default ({ id }) => {
	const [modal, setModal] = useState(false);
	const { addDraft } = useDispatch(dataStore);

	const { integrations, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
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

	// Add to drafts on create.
	const onCreate = ({ provider, item }) => {
		addDraft('integration', {
			model_name: 'product',
			model_id: id,
			integration_id: item,
			provider,
		});
	};
	// selectDrafts.
	const drafts = useSelect((select) => {
		return select(dataStore).selectDrafts('integration');
	}, []);

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
			{!!integrations?.length || !!drafts?.length ? (
				<ScCard noPadding>
					<ScStackedList>
						{(integrations || []).map((integration) => {
							return (
								<Integration
									key={integration?.id}
									integration={integration}
									onRemove={() => {
										deleteIntegration(integration);
									}}
								/>
							);
						})}

						{(drafts || []).map((integration) => {
							return (
								<Integration
									key={integration?.id}
									integration={integration}
									onRemove={() => {
										deleteIntegration(integration);
									}}
								/>
							);
						})}
					</ScStackedList>
				</ScCard>
			) : (
				<p
					css={css`
						opacity: 0.75;
					`}
				>
					{__(
						'To sync purchases of this product, add an integration.',
						'surecart'
					)}
				</p>
			)}

			{!!modal && (
				<NewIntegration
					id={id}
					onCreate={onCreate}
					onRequestClose={() => setModal(false)}
				/>
			)}
		</Box>
	);
};
