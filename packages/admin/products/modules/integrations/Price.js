/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import { ScFormatNumber, ScSkeleton } from '@surecart/components-react';
import { intervalString } from '../../../util/translations';
import { getSKUTextByVariantAndPrice } from '../../../util/products';

export default ({ price_id, variant_id, product, total_integrations }) => {
	const { price, hasLoadedPrice } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'price',
				price_id,
			];
			return {
				price: select(coreStore)?.getEditedEntityRecord?.(
					...entityData
				),
				hasLoadedPrice: select(coreStore)?.hasFinishedResolution?.(
					'getEditedEntityRecord',
					[...entityData]
				),
			};
		},
		[price_id]
	);

	const { variant, hasLoadedVariant } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'variant',
				variant_id,
			];
			return {
				variant: select(coreStore)?.getEditedEntityRecord?.(
					...entityData
				),
				hasLoadedVariant: select(coreStore)?.hasFinishedResolution?.(
					'getEditedEntityRecord',
					[...entityData]
				),
			};
		},
		[variant_id]
	);

	if (!hasLoadedPrice || !hasLoadedVariant) {
		return (
			<div
				css={css`
					display: grid;
					gap: 1em;
					width: 200px;
				`}
			>
				<ScSkeleton
					style={{ width: '80px', display: 'inline-block' }}
				></ScSkeleton>
				<ScSkeleton
					style={{ width: '60px', display: 'inline-block' }}
					slot="price"
				></ScSkeleton>
			</div>
		);
	}

	const totalPrices = product?.prices?.data?.length;
	const totalVariants = product?.variants?.length;
	const hasAllPrices = !price_id && totalPrices > 1 && total_integrations > 1;
	const hasAllVariants = !variant_id && totalVariants > 1 && total_integrations > 1;

	const renderPrice = () => {
		if (hasAllPrices) {
			return (
				<div
					css={css`
						opacity: 0.9;
					`}
				>
					{__('All Prices', 'surecart')}
				</div>
			);
		}

		if (!price || totalPrices < 2) {
			return null;
		}

		return (
			<div>
				{price?.name ? price?.name : (
					<Fragment>
						<ScFormatNumber
							type="currency"
							currency={price?.currency || 'usd'}
							value={!!price?.ad_hoc ? !!price?.ad_hoc : price?.amount || variant?.amount}
						/>
						{intervalString(price)}
					</Fragment>
				)}
			</div>
		);
	}

	const renderVariant = () => {
		if (hasAllVariants) {
			return (
				<div
					css={css`
						opacity: 0.9;
					`}
				>
					{__('All Variants', 'surecart')}
				</div>
			);
		}

		if (!variant || totalVariants < 2) {
			return null;
		}

		const variantLabel = [
			variant?.option_1,
			variant?.option_2,
			variant?.option_3,
		]
			.filter(Boolean)
			.join(' / ');
		const productSku = getSKUTextByVariantAndPrice(variant, price);
		return (
			<div>
				{!!variantLabel && <div>{variantLabel}</div>}
				{!!productSku && (
					<div>
						{__('SKU:', 'surecart')} {productSku}
					</div>
				)}

				<div
					css={css`
						display: grid;
						gap: 0.5em;
					`}
				>
					<div
						css={css`
							display: flex;
							gap: 10px;
							align-items: center;
						`}
					>
						<ScFormatNumber
							type="currency"
							currency={price?.currency || 'usd'}
							value={price?.ad_hoc}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			css={css`
				padding: 0 30px;
				width: 200px;
			`}
		>
			{renderPrice()}
			{renderVariant()}
		</div>
	);
};
