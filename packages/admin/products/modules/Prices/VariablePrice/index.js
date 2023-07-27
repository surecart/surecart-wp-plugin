/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScBlockUi, ScSelect, ScSwitch } from '@surecart/components-react';
import { useEffect, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';
import Subscription from '../../../components/price/Subscription';
import Box from '../../../../ui/Box';

export default ({ productId, product, updateProduct }) => {
	const [type, setType] = useState('once');
	const didMountRef = useRef(false);

	// update the price.
	const updatePrice = (data) => updateProduct({ prices: [data] });

	const { active, updating, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [productId], per_page: 100 },
			];

			// get all prices for this product.
			const prices = select(coreStore).getEntityRecords(...queryArgs);

			// are we loading prices?
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// are we saving any prices?
			const saving = (prices || []).some((price) =>
				select(coreStore).isSavingEntityRecord(
					'surecart',
					'price',
					price?.id
				)
			);

			const deleting = (prices || []).some((price) =>
				select(coreStore)?.isDeletingEntityRecord?.(
					'surecart',
					'price',
					price?.id
				)
			);

			// for all prices, merge with edits
			// we always show the edited version of the price.
			const editedPrices = (prices || [])
				.map((price) => {
					return {
						...price,
						...select(coreStore).getRawEntityRecord(
							'surecart',
							'price',
							price?.id
						),
						...select(coreStore).getEntityRecordEdits(
							'surecart',
							'price',
							price?.id
						),
					};
				})
				// sort by position.
				.sort((a, b) => a?.position - b?.position);

			return {
				active: (editedPrices || []).filter((price) => !price.archived),
				// archived: (editedPrices || []).filter(
				// 	(price) => price.archived
				// ),
				loading: loading && !prices?.length,
				updating: (loading && prices?.length) || saving || deleting,
			};
		},
		[productId]
	);

	const price = active?.[0] || product?.prices?.[0] || {};

	useEffect(() => {
		if (loading) return; // don't do this until we load our actual prices.
		if (didMountRef.current) {
			switch (type) {
				case 'subscription':
					updatePrice({
						recurring_interval: 'month',
						recurring_interval_count: 1,
						recurring_period_count: null,
						recurring_end_behavior: 'cancel',
					});
					break;
				case 'multiple':
					updatePrice({
						recurring_interval: 'month',
						recurring_interval_count: 1,
						recurring_period_count: 3,
						recurring_end_behavior: 'complete',
					});
					break;
				case 'once':
					updatePrice({
						recurring_interval: null,
						recurring_interval_count: null,
						recurring_period_count: null,
						recurring_end_behavior: null,
					});
					break;
			}
		}
		didMountRef.current = true;
	}, [type]);

	return (
		<Box title={__('Pricing', 'surecart')} loading={loading}>
			<ScSelect
				label={__('Payment Type', 'surecart')}
				required
				unselect={false}
				value={type}
				onScChange={(e) => setType(e.target.value)}
				choices={[
					{
						value: 'once',
						label: __('One Time', 'surecart'),
					},
					{
						value: 'multiple',
						label: __('Installment', 'surecart'),
					},
					{
						value: 'subscription',
						label: __('Subscription', 'surecart'),
					},
				]}
			/>

			{type === 'subscription' && (
				<Subscription price={price} updatePrice={updatePrice} />
			)}

			{type === 'multiple' && (
				<Multiple price={price} updatePrice={updatePrice} />
			)}

			{type === 'once' && (
				<OneTime price={price} updatePrice={updatePrice} />
			)}

			{product?.tax_enabled && scData?.tax_protocol?.tax_enabled && (
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 0.5em;
						margin-top: var(--sc-spacing-xx-large);
					`}
				>
					<ScSwitch
						style={{
							marginTop: '0.5em',
							display: 'inline-block',
						}}
						checked={price?.tax_behavior === 'inclusive'}
						onScChange={() =>
							updatePrice({
								tax_behavior:
									price?.tax_behavior === 'inclusive'
										? 'exclusive'
										: 'inclusive',
							})
						}
					>
						{__('Tax is included', 'surecart')}
					</ScSwitch>
				</div>
			)}
			{updating && <ScBlockUi spinner />}
		</Box>
	);
};
