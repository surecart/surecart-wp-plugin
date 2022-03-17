/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { Fragment } from '@wordpress/element';
import {
	CeInput,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/components-react';
import { Icon, trash, moreHorizontalMobile } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { translateInterval } from '@scripts/admin/util/translations';
import PriceSelector from './PriceSelector';

export default ({ choice, onUpdate, onSelect, onRemove, onNew }) => {
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
		if (price?.ad_hoc) return __('Custom', 'checkout_engine');
		return (
			<ce-format-number
				type="currency"
				value={
					price?.amount * (withQuantity ? choice?.quantity || 1 : 1)
				}
				currency={price?.currency}
			/>
		);
	};

	return (
		<ce-table-row>
			<ce-table-cell
				css={css`
					width: 50%;
					max-width: 50%;
				`}
			>
				{!choice?.id ? (
					<PriceSelector
						ad_hoc={false}
						createNew={true}
						onNewProduct={onNew}
						onSelect={onSelect}
					/>
				) : (
					product?.name
				)}
			</ce-table-cell>
			<ce-table-cell style={{ width: '70px' }}>
				<CeInput
					type="number"
					value={choice?.quantity}
					onCeChange={(e) => onUpdate({ quantity: e.target.value })}
				/>
			</ce-table-cell>
			<ce-table-cell style={{ textAlign: 'right' }}>
				{renderPrice(true)}{' '}
				<span
					css={css`
						color: var(--ce-color-gray-500);
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
			</ce-table-cell>
			<ce-table-cell>
				<CeDropdown position="bottom-right">
					<CeButton type="text" slot="trigger" circle>
						<ce-icon name="more-horizontal"></ce-icon>
					</CeButton>
					<CeMenu>
						<CeMenuItem onClick={onRemove}>
							<ce-icon
								name="trash"
								slot="prefix"
								style={{ opacity: 0.5 }}
							></ce-icon>
							{__('Remove', 'checkout_engine')}
						</CeMenuItem>
					</CeMenu>
				</CeDropdown>
			</ce-table-cell>
		</ce-table-row>
	);
};
