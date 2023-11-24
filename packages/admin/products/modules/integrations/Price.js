/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import { ScFormatNumber, ScSkeleton } from '@surecart/components-react';
import { intervalString } from '../../../util/translations';
import { getSKUTextByVariantAndPrice } from '../../../util/products';

export default ({ price_id, variant_id }) => {
	const { price, hasLoadedPrice } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'price',
				price_id,
				{
					expand: ['product'],
					t: '1', // clear any cache to fetch fresh.
				},
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
				{
					t: '1', // clear any cache to fetch fresh.
				},
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

	if (!price) {
		return null;
	}

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

	const variantLabel = [
		variant?.option_1,
		variant?.option_2,
		variant?.option_3,
	]
		.filter(Boolean)
		.join(' / ');

	const productSku = getSKUTextByVariantAndPrice(variant, price);

	return (
		<div
			css={css`
				padding: 0 30px;
				width: 200px;
			`}
		>
			{!!variantLabel && <div>{variantLabel}</div>}
			{!!productSku && (
				<div>
					{__('SKU:', 'surecart')} {productSku}
				</div>
			)}
			<div>
				<ScFormatNumber
					type="currency"
					currency={price?.currency || 'usd'}
					value={!!price?.ad_hoc ? !!price?.ad_hoc : price?.amount}
				/>
				{intervalString(price)}
			</div>
			<>
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

					{!!price?.trial_duration_days && (
						<div
							css={css`
								opacity: 0.65;
								font-size: 12px;
								line-height: 1.2;
							`}
						>
							{sprintf(
								_n(
									'Starting in %s day',
									'Starting in %s days',
									price.trial_duration_days,
									'surecart'
								),
								price.trial_duration_days
							)}
						</div>
					)}
				</div>
			</>
		</div>
	);
};
