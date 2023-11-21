/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

/**
 * External dependencies
 */
import { ScButton, ScForm } from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { ScFormControl } from '@surecart/components-react';
import Error from '../../../components/Error';
import SelectIntegration from './SelectIntegration';
import SelectPrice from '../../../components/SelectPrice';

export default ({ onRequestClose, id, product }) => {
	const [provider, setProvider] = useState(null);
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [priceId, setPriceId] = useState(null);
	const [variantId, setVariantId] = useState(null);
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
					price_id: priceId || null,
					variant_id: variantId || null,
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

	const products = [
		{
			...product,
			variants: {
				data: product.variants,
			},
		}
	]


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

					{!!item && !!product?.prices?.data?.length && (
						<Fragment>
							<div>
								<ScFormControl
									label={__('Select A Price', 'surecart')}
								>
									<SelectPrice
										required={false}
										css={css`
											flex: 0 1 50%;
										`}
										open={false}
										value={priceId}
										ad_hoc={false}
										variable={false}
										loading={false}
										products={[product]}
										onSelect={({ price_id }) => setPriceId(price_id)}
										placeholder={__(
											'All Prices',
											'surecart'
										)}
									/>
								</ScFormControl>
							</div>

							{!!priceId && !!product?.variants?.length && (
								<div>
									<ScFormControl
										label={__('Select A Variant', 'surecart')}
									>
										<SelectPrice
											required={false}
											css={css`
												flex: 0 1 50%;
											`}
											open={false}
											value={variantId}
											ad_hoc={false}
											variable={true}
											loading={false}
											products={products}
											onSelect={({ variant_id }) => setVariantId(variant_id)}
											placeholder={__(
												'All Variants',
												'surecart'
											)}
										/>
									</ScFormControl>
								</div>
							)}
						</Fragment>
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
