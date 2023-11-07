/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

/**
 * External dependencies
 */
import { ScButton, ScForm } from '@surecart/components-react';
import { Button, Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { ScFormControl } from '@surecart/components-react';
import PriceSelector from '@admin/components/PriceSelector';
import Error from '../../../components/Error';
import SelectIntegration from './SelectIntegration';

export default ({ onRequestClose, id }) => {
	const [provider, setProvider] = useState(null);
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [price, setPrice] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { saveEntityRecord } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		try {
			setError(null);
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'integration',
				{
					model_name: 'product',
					model_id: id,
					integration_id: item,
					price_id: price?.priceId || null,
					variant_id: price?.variantId || null,
					provider,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(__('Integration saved.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
			setLoading(false);
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
				onRequestClose={onRequestClose}
				shouldCloseOnClickOutside={false}
			>
				<ScForm
					onScFormSubmit={onSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-large);
					`}
				>
					<Error error={error} setError={setError} />

					<SelectIntegration
						model="product"
						providerName={provider}
						setProvider={setProvider}
						item={item}
						setItem={setItem}
					/>

					{!!item && (
						<div>
							<ScFormControl
								label={__('Select A Price', 'surecart')}
							>
								<PriceSelector
									value={price?.priceId}
									ad_hoc={false}
									onSelect={({ price_id, variant_id }) =>
										setPrice({
											priceId: price_id,
											variantId: variant_id,
										})
									}
									requestQuery={{
										archived: false,
										// ids: [id],
									}}
									allowOutOfStockSelection={true}
								/>
							</ScFormControl>
						</div>
					)}

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
							busy={loading}
							disabled={loading}
							submit
						>
							{__('Add Integration', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
					{loading && <sc-block-ui></sc-block-ui>}
				</ScForm>
			</Modal>
		</Fragment>
	);
};
