/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { ScPriceInput, ScEmpty } from '@surecart/components-react';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';
import { maybeConvertAmount } from '../../../util';

export default ({ variant, updateVariant, product }) => {
	const { getValue, isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	/**
	 * Get only active prices.
	 */
	const prices = useSelect(
		(select) =>
			(
				select(coreStore).getEntityRecords('surecart', 'price', {
					context: 'edit',
					product_ids: [product?.id],
					per_page: 100,
				}) || []
			).filter((price) => !price?.archived),
		[product?.id]
	);

	const canOverride = (prices || [])?.length <= 1 || variant?.amount !== null;

	const defaultAmount = prices?.[0]
		? maybeConvertAmount(
				prices?.[0]?.amount,
				prices?.[0]?.currency || 'usd'
		  )
		: '';

	const currency = variant?.currency || window?.scData?.currency_code;

	return (
		<DrawerSection
			title={__('Price', 'surecart')}
			suffix={
				canOverride && (
					<ResetOverridesDropdown
						fields={[
							{
								key: 'amount',
								label: __('Price', 'surecart'),
							},
						]}
						isOverridden={isOverridden}
						onReset={(fieldKey) =>
							updateVariant({ [fieldKey]: null })
						}
					/>
				)
			}
		>
			{canOverride ? (
				<ScPriceInput
					type="number"
					min="0"
					value={getValue('amount')}
					placeholder={defaultAmount}
					currencyCode={currency}
					label={__('Price', 'surecart')}
					showLabel={false}
					help={__(
						'Set a custom price for this variant. Leave blank to use the product price.',
						'surecart'
					)}
					onScInput={(e) =>
						updateVariant(
							getUpdateValue({
								amount: e.target.value || null,
							})
						)
					}
				/>
			) : (
				<ScEmpty icon="info">
					{__(
						'To set a custom price on this variant, the product must have only one price.',
						'surecart'
					)}
				</ScEmpty>
			)}
		</DrawerSection>
	);
};
