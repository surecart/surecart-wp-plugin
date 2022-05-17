/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useState, Fragment } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { ScAlert, ScButton, ScForm } from '@surecart/components-react';
import SelectIntegration from './SelectIntegration';
import { useDispatch } from '@wordpress/data';

export default ({ id, onRequestClose }) => {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [provider, setProvider] = useState(null);
	const [item, setItem] = useState(null);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const onSubmit = async () => {
		try {
			setSaving(true);
			const integration = await apiFetch({
				method: 'POST',
				path: `surecart/v1/integrations`,
				data: {
					model_name: 'product',
					model_id: id,
					integration_id: item,
					provider,
				},
			});
			receiveEntityRecords(
				'surecart',
				'integration',
				integration,
				{
					context: 'edit',
					model_ids: [id],
				},
				true
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e?.message || __('An error occurred', 'surecart'));
		} finally {
			setSaving(false);
		}
	};

	return (
		<Fragment>
			<Global
				styles={css`
					.sc-modal-overflow .components-modal__frame {
						overflow: visible !important;
					}
				`}
			/>
			<Modal
				title={__('Add Integration', 'surecart')}
				css={css`
					max-width: 500px !important;
					.components-modal__content {
						overflow: visible !important;
					}
				`}
				overlayClassName={'sc-modal-overflow'}
				onRequestClose={() => {
					if (saving) return;
					onRequestClose();
				}}
				shouldCloseOnClickOutside={false}
			>
				<ScForm
					onScFormSubmit={onSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-large);
					`}
				>
					<ScAlert open={error} type="danger">
						{error}
					</ScAlert>

					<SelectIntegration
						model="product"
						providerName={provider}
						setProvider={setProvider}
						item={item}
						setItem={setItem}
					/>

					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScButton
							type="primary"
							style={{
								'--button-border-radius':
									'--sc-input-border-radius-small',
							}}
							submit
							disabled={saving}
							loading={saving}
						>
							{__('Add Integration', 'surecart')}
						</ScButton>
						<Button onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</Button>
					</div>
				</ScForm>
			</Modal>
		</Fragment>
	);
};
