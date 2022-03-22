/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import {
	ScInput,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { translateInterval } from '@scripts/admin/util/translations';
import PriceSelector from './PriceSelector';

export default ({
	choice,
	onUpdate,
	hideQuantity,
	onSelect,
	onRemove,
	onNew,
}) => {
	// get price from choice.
	const price = useSelect(
		(select) => {
			if (!choice?.id) return;
			return select(coreStore).getEntityRecord(
				'root',
				'price',
				choice?.id
			);
		},
		[choice?.id]
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

	const renderPrice = (withQuantity = false) => {
		if (!price?.id) return '—';
		if (price?.ad_hoc) return __('Custom', 'surecart');
		return (
			<sc-format-number
				type="currency"
				value={
					price?.amount * (withQuantity ? choice?.quantity || 1 : 1)
				}
				currency={price?.currency}
			/>
		);
	};

	console.log({ onNew });

	return (
		<sc-table-row>
			<sc-table-cell
				css={css`
					width: 50%;
					max-width: 50%;
				`}
			>
				{!choice?.id ? (
					<PriceSelector ad_hoc={false} onSelect={onSelect} />
				) : (
					product?.name
				)}
			</sc-table-cell>
			{!hideQuantity && (
				<sc-table-cell style={{ width: '70px' }}>
					<ScInput
						type="number"
						value={choice?.quantity}
						onScChange={(e) =>
							onUpdate({ quantity: e.target.value })
						}
					/>
				</sc-table-cell>
			)}
			<sc-table-cell style={{ textAlign: 'right' }}>
				{renderPrice(true)}{' '}
				<span
					css={css`
						color: var(--sc-color-gray-500);
					`}
				>
					{price &&
						translateInterval(
							price?.recurring_interval_count,
							price?.recurring_interval,
							' /',
							'once'
						)}
				</span>
			</sc-table-cell>
			<sc-table-cell>
				<ScDropdown position="bottom-right">
					<ScButton type="text" slot="trigger" circle>
						<sc-icon name="more-horizontal"></sc-icon>
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={onRemove}>
							<sc-icon
								name="trash"
								slot="prefix"
								style={{ opacity: 0.5 }}
							></sc-icon>
							{__('Remove', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</sc-table-cell>
		</sc-table-row>
	);
};
