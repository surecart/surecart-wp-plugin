/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScSelect, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';

import Multiple from '../../components/price/Multiple';
import OneTime from '../../components/price/OneTime';
import Subscription from '../../components/price/Subscription';

export default ({ prices, product, updateProduct }) => {
	const { editEntityRecord } = useDispatch(coreStore);

	// update the price.
	const updatePrice = (data) => {
		// we have a saved price.
		if (prices?.[0]?.id) {
			updateProduct({ prices: null });
			return editEntityRecord('surecart', 'price', prices?.[0]?.id, data);
		}
		// fake it on the product.
		return updateProduct({ prices: [{ ...price, ...data }] });
	};

	const price = prices?.[0] || product?.prices?.[0] || {};

	const getType = () => {
		if (!!price?.recurring_interval) {
			if (!!price?.recurring_period_count) {
				return 'multiple';
			}
			return 'subscription';
		}
		return 'once';
	};

	const setType = (type) => {
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
	};

	return (
		<>
			<ScSelect
				label={__('Payment Type', 'surecart')}
				required
				unselect={false}
				value={getType()}
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

			{getType() === 'subscription' && (
				<Subscription price={price} updatePrice={updatePrice} />
			)}

			{getType() === 'multiple' && (
				<Multiple price={price} updatePrice={updatePrice} />
			)}

			{getType() === 'once' && (
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
		</>
	);
};
