/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScCard, ScStackedList } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

import Box from '../../../ui/Box';
import NewIntegration from './NewIntegration';
import IntegrationHelp from './IntegrationHelp';
import Integration from './Integration';
import useSave from '../../../settings/UseSave';

export default ({ product, id }) => {
	const [modal, setModal] = useState(false);
	const [guide, setGuide] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { save } = useSave();

	const isDirty = useSelect(
		(select) =>
			select(coreStore).__experimentalGetDirtyEntityRecords()?.length > 0,
		[]
	);

	const addIntegration = async () => {
		if (isDirty) {
			const r = confirm(
				__(
					'You have unsaved changes that need to be saved before adding a new integration. Do you want to save your product now?',
					'surecart'
				)
			);
			if (!r) {
				return;
			}
			try {
				await save({
					successMessage: __('Product updated.', 'surecart'),
				});
			} catch (e) {
				console.error(e);
				// save failed.
				createErrorNotice(__('Product update failed.', 'surecart'), {
					type: 'snackbar',
				});
			}
		}
		setModal(true);
	};

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
		<>
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
					<ScButton onClick={() => addIntegration()}>
						<sc-icon name="plus" slot="prefix"></sc-icon>
						{__('Add New Integration', 'surecart')}
					</ScButton>
				}
			>
				{!!integrations?.length ? (
					<ScCard noPadding>
						<ScStackedList>
							{(integrations || []).map(({ id }) => (
								<Integration
									key={id}
									id={id}
									total={integrations?.length}
									product={product}
								/>
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
			</Box>

			{!!modal && (
				<NewIntegration
					id={id}
					onRequestClose={() => setModal(false)}
					product={product}
				/>
			)}

			<IntegrationHelp
				open={guide}
				onRequestClose={() => setGuide(false)}
			/>
		</>
	);
};
