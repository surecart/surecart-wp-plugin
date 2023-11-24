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
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { ScFormControl } from '@surecart/components-react';
import Error from '../../../components/Error';
import SelectIntegration from './SelectIntegration';
import SelectPrice from '../../../components/SelectPrice';
import { formatNumber } from '../../../util';
import { intervalString } from '../../../util/translations';

export default ({ onRequestClose, id, product }) => {
	const [provider, setProvider] = useState(null);
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [price, setPrice] = useState(product?.prices?.data?.[0] || null);
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

	const getFormattedVariants = () => {
		if (!product?.variants?.length) return [];

		return product.variants
			.sort((a, b) => a?.position - b?.position)
			.map((variant) => {
				const variantUnavailable =
					product?.stock_enabled &&
					!product?.allow_out_of_stock_purchases &&
					0 >= variant?.available_stock;
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
					(${variantLabel}) ${intervalString(
						price,
						{ showOnce: true }
					)} - ${formatNumber(
						variant?.amount ?? price.amount,
						price.currency
					)}${price?.archived ? ' (Archived)' : ''}`,
					suffixDescription: product?.stock_enabled
						? sprintf(
							__('%s available', 'surecart'),
							variant?.available_stock
						)
						: null,
					disabled: variantUnavailable,
					variant_id: variant?.id,
				};
			});
	}

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

					{!!item && !!product?.prices?.data?.length > 1 && (
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
									value={price?.id}
									ad_hoc={false}
									variable={false}
									loading={false}
									products={[product]}
									onSelect={(value) => setPrice(value)}
									placeholder={__(
										'All Prices',
										'surecart'
									)}
								/>
							</ScFormControl>
						</div>
					)}

					{!!item && !!getFormattedVariants().length && (
						<div>
							<ScSelect
								label={__('Select a variant', 'surecart')}
								value={variantId}
								choices={getFormattedVariants()}
								onScChange={(e) =>
									setVariantId(e.target.value)
								}
								placeholder={__(
									'All Variants',
									'surecart'
								)}
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
