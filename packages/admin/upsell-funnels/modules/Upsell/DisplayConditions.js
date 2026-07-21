/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScButton,
	ScRadio,
	ScRadioGroup,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default ({ upsell, onUpdate }) => {
	const priceId = upsell?.price?.id || upsell?.price;

	// Determine if the upsell product is a component of any bundle.
	// This is used to warn the merchant that "Always show" can lead to duplicate charges.
	const isBundleComponent = useSelect(
		(select) => {
			if (!priceId) return false;

			const { getEntityRecord, getEntityRecords } = select(coreStore);
			const price = getEntityRecord('surecart', 'price', priceId, {
				expand: ['product'],
			});
			const productId = price?.product?.id || price?.product;
			if (!productId) return false;

			const bundles = getEntityRecords('surecart', 'product', {
				bundle: true,
				per_page: 100,
				expand: ['bundle_items', 'bundle_items.component_product'],
			});
			if (!bundles) return false;

			// Check if any bundle contains this product as a component.
			return bundles.some((bundle) =>
				(bundle?.bundle_items?.data || []).some(
					(item) =>
						(item?.component_product?.id ??
							item?.component_product) === productId
				)
			);
		},
		[priceId]
	);

	// Only "allow" (Always show) risks a duplicate charge; the block options
	// already suppress the offer when the product is in the order.
	const showBundleWarning =
		isBundleComponent && upsell?.duplicate_purchase_behavior === 'allow';

	return (
		<ScRadioGroup label={__('Visibility', 'surecart')} required>
			<div
				css={css`
					display: grid;
					gap: 1em;
					margin-top: 1em;
				`}
			>
				{showBundleWarning && (
					<ScAlert
						type="warning"
						open
						title={__(
							'This product is included in a bundle',
							'surecart'
						)}
					>
						{__(
							'With "Always show", a customer who buys a bundle containing this product can be offered it again and charged twice. Consider "Skip if in order".',
							'surecart'
						)}
						<div
							css={css`
								margin-top: 0.75em;
							`}
						>
							<ScButton
								size="small"
								onClick={() =>
									onUpdate({
										duplicate_purchase_behavior:
											'block_within_checkout',
									})
								}
							>
								{__('Use "Skip if in order"', 'surecart')}
							</ScButton>
						</div>
					</ScAlert>
				)}
				<ScRadio
					checked={upsell?.duplicate_purchase_behavior === 'allow'}
					value="allow"
					onClick={() =>
						onUpdate({
							duplicate_purchase_behavior: 'allow',
						})
					}
				>
					{__('Always show', 'surecart')}
					<span slot="description">
						{__('Show regardless of past purchases.', 'surecart')}
					</span>
				</ScRadio>
				<ScRadio
					checked={
						upsell?.duplicate_purchase_behavior ===
						'block_within_checkout'
					}
					value="block_within_checkout"
					onClick={() =>
						onUpdate({
							duplicate_purchase_behavior:
								'block_within_checkout',
						})
					}
				>
					{__('Skip if in order', 'surecart')}
					<span slot="description">
						{__(
							"Don't show if already being purchased in the current order.",
							'surecart'
						)}
					</span>
				</ScRadio>
				<ScRadio
					checked={upsell?.duplicate_purchase_behavior === 'block'}
					value="block"
					onClick={() =>
						onUpdate({
							duplicate_purchase_behavior: 'block',
						})
					}
				>
					{__('Skip if purchased', 'surecart')}
					<span slot="description">
						{__(
							"Don't show if ever purchased, including the current order.",
							'surecart'
						)}
					</span>
				</ScRadio>
			</div>
		</ScRadioGroup>
	);
};
