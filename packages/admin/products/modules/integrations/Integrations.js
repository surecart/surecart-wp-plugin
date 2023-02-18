/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScCard, ScStackedList } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

import Box from '../../../ui/Box';
import NewIntegration from './NewIntegration';
import IntegrationHelp from './IntegrationHelp';
import Integration from './Integration';

export default ({ id }) => {
	const [modal, setModal] = useState(false);
	const [guide, setGuide] = useState(false);

	const { integrations, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'integration',
				{ context: 'edit', model_ids: [id], per_page: 50 },
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
			header_action={
				<ScButton
					onClick={() => setGuide(true)}
					size="small"
					circle
					type="text"
				>
					<sc-icon
						name="help-circle"
						style={{ fontSize: '18px' }}
					></sc-icon>
				</ScButton>
			}
			footer={
				<ScButton onClick={() => setModal(true)}>
					<sc-icon name="plus" slot="prefix"></sc-icon>
					{__('Add New Integration', 'surecart')}
				</ScButton>
			}
		>
			{!!integrations?.length ? (
				<ScCard noPadding>
					<ScStackedList>
						{(integrations || []).map(({ id }) => (
							<Integration key={id} id={id} />
						))}
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
					onRequestClose={() => setModal(false)}
				/>
			)}

			<IntegrationHelp
				open={guide}
				onRequestClose={() => setGuide(false)}
			/>
		</Box>
	);
};
