/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

/**
 * External dependencies
 */
import { ScButton, ScForm, ScSelect } from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { ScFormControl } from '@surecart/components-react';
import Error from '../../../components/Error';
import SelectIntegration from './SelectIntegration';
import SelectPrice from '../../../components/SelectPrice';
import { formatNumber } from '../../../util';
import useSelectPrices from '../../hooks/useSelectPrices';

export default ({ onRequestClose, id, product }) => {
	const [provider, setProvider] = useState(null);
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [price, setPrice] = useState(null);
	const [variantId, setVariantId] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);

	const { active } = useSelectPrices({ productId: id });

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
					price_id: price?.id || null,
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

	const getVariants = () => {
		// If no variants, don't process further.
		if (!product?.variants?.length) return [];

		// If price is not set, then get the first price to get fallback variant amount.
		const priceData = price || active?.[0];

		// Process the variants for the select.
		return product.variants
			.sort((a, b) => a?.position - b?.position)
			.filter((variant) => !!variant?.id) // filter out variants without an id
			.map((variant) => {
				const variantLabel = [
					variant?.option_1,
					variant?.option_2,
					variant?.option_3,
				]
					.filter(Boolean)
					.join(' / ');
				return {
					value: variant.id,
					label: `
					(${variantLabel}) ${
						variant?.amount
							? ` - ${formatNumber(
									variant?.amount,
									priceData?.currency || 'usd'
							  )}`
							: ''
					}`,
					suffixDescription: product?.stock_enabled
						? sprintf(
								__('%s available', 'surecart'),
								variant?.available_stock
						  )
						: null,
					variant_id: variant?.id,
				};
			});
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
					width: 600px !important;
					.components-modal__content {
						overflow: visible !important;
					}

					@media (max-width: 782px) {
						width: 100% !important;

						.components-modal__content {
							overflow: visible !important;
						}
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

					{!!item && active?.length > 1 && (
						<div>
							<ScFormControl
								label={__('Select A Price', 'surecart')}
								help={__(
									'Optionally select a price to sync with this integration.',
									'surecart'
								)}
							>
								<SelectPrice
									required={false}
									css={css`
										flex: 0 1 50%;
									`}
									style={{
										'--sc-input-placeholder-color':
											'var(--sc-input-label-color)',
									}}
									open={false}
									value={price?.id}
									ad_hoc={false}
									variable={false}
									includeVariants={false}
									showOutOfStock={true}
									loading={false}
									products={[
										{
											...product,
											prices: {
												data: active, // merge active prices with product data
											},
										},
									]}
									onSelect={({ price_id }) => {
										// find the price and set it.
										setPrice(
											active?.find(
												(p) => p.id === price_id
											)
										);
									}}
									placeholder={__('All Prices', 'surecart')}
								/>
							</ScFormControl>
						</div>
					)}

					{!!item && getVariants().length > 1 && (
						<div>
							<ScSelect
								label={__('Select A Variant', 'surecart')}
								help={__(
									'Optionally select a variant to sync with this integration.',
									'surecart'
								)}
								value={variantId}
								choices={getVariants()}
								onScChange={(e) => setVariantId(e.target.value)}
								placeholder={__('All Variants', 'surecart')}
								style={{
									'--sc-input-placeholder-color':
										'var(--sc-input-label-color)',
								}}
							/>
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
