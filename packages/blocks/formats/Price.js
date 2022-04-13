/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { translateInterval } from '@scripts/admin/util/translations';

export default ({ id, quantity }) => {
	// get price from choice.
	const price = useSelect(
		(select) => {
			if (!id) return;
			return select(coreStore).getEntityRecord('root', 'price', id);
		},
		[id]
	);

	// get product from price.
	const product = useSelect(
		(select) => {
			if (!price?.product) return;
			return select(coreStore).getEntityRecord(
				'root',
				'product',
				price.product
			);
		},
		[price]
	);

	if (!price || !product) {
		return (
			<sc-stacked-list-row style={{ '--columns': '2' }}>
				<sc-skeleton style={{ width: '45%' }}></sc-skeleton>
				<sc-skeleton style={{ width: '25%' }}></sc-skeleton>
			</sc-stacked-list-row>
		);
	}

	return (
		<sc-stacked-list-row style={{ '--columns': '2' }}>
			<strong>
				{product?.name} x{quantity}
			</strong>
			<div>
				<sc-format-number
					type="currency"
					currency={price.currency}
					value={price.amount}
				></sc-format-number>
				{price &&
					translateInterval(
						price?.recurring_interval_count,
						price?.recurring_interval,
						' /',
						' once'
					)}
			</div>
		</sc-stacked-list-row>
	);
};
