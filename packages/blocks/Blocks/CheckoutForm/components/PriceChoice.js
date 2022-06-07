/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { Fragment } from '@wordpress/element';
import {
	ScInput,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { Icon, trash, moreHorizontalMobile } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import PriceSelector from './PriceSelector';
import { intervalString } from '../../../../admin/util/translations';

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
		if (price?.ad_hoc) return __('Custom', 'surecart');
		return (
			<Fragment>
				<sc-format-number
					type="currency"
					value={
						price?.amount *
						(withQuantity ? choice?.quantity || 1 : 1)
					}
					currency={price?.currency}
				/>
				{intervalString(price, {
					labels: { interval: '/' },
				})}
			</Fragment>
		);
	};

	const renderDropDown = () => {
		return (
			<ScDropdown slot="suffix" position="bottom-right">
				<ScButton type="text" slot="trigger" circle>
					<Icon icon={moreHorizontalMobile} />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={onRemove}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
							icon={trash}
							size={20}
						/>
						{__('Remove', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		);
	};
	return (
		<tr>
			<td
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
					<div>
						<div>
							{!!product?.name && !!price?.name ? (
								`${product?.name} – ${price?.name}`
							) : (
								<sc-skeleton
									style={{
										width: '120px',
										display: 'inline-block',
									}}
								></sc-skeleton>
							)}
						</div>
						<div
							css={css`
								color: var(--sc-color-gray-500);
							`}
						>
							{renderPrice()}
						</div>
					</div>
				)}
			</td>
			<td
				css={css`
					max-width: 70px;
					width: 70px;
				`}
			>
				<ScInput
					type="number"
					value={choice?.quantity}
					onScChange={(e) => onUpdate({ quantity: e.target.value })}
				/>
			</td>
			<td
				css={css`
					text-align: right;
				`}
			>
				{renderPrice(true)}
			</td>
			<td>{renderDropDown()}</td>
		</tr>
	);
};
