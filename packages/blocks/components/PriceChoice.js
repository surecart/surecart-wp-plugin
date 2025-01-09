/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScFormatNumber,
} from '@surecart/components-react';
import { Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../admin/util/translations';
import LineItemLabel from '../../admin/ui/LineItemLabel';

export default ({ choice, onUpdate, hideQuantity, onRemove }) => {
	// get price from choice.
	const price = useSelect(
		(select) => {
			if (!choice?.id) return;
			return select(coreStore).getEntityRecord(
				'surecart',
				'price',
				choice?.id
			);
		},
		[choice?.id]
	);

	const variant = useSelect(
		(select) => {
			if (!choice?.variant_id) return;
			return select(coreStore).getEntityRecord(
				'surecart',
				'variant',
				choice?.variant_id
			);
		},
		[choice?.variant_id]
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

	return (
		<sc-table-row>
			<sc-table-cell
				css={css`
					width: 50%;
					max-width: 50%;
				`}
			>
				{!choice?.id || !price ? (
					<Spinner />
				) : (
					<>
						<strong>{product?.name}</strong>
						<LineItemLabel
							lineItem={{
								price,
								variant_options: [
									variant?.option_1,
									variant?.option_2,
									variant?.option_3,
								],
							}}
						>
							<div>
								<ScFormatNumber
									type="currency"
									currency={price?.currency || 'usd'}
									value={
										!!price?.ad_hoc && price?.ad_hoc_amount
											? price?.ad_hoc_amount
											: price?.amount
									}
								/>
								{intervalString(price)}
							</div>
						</LineItemLabel>
					</>
				)}
			</sc-table-cell>
			{!hideQuantity && (
				<sc-table-cell style={{ width: '100px' }}>
					<ScInput
						type="number"
						value={choice?.quantity}
						onScChange={(e) =>
							onUpdate({
								id: choice?.id,
								quantity: e.target.value,
								...(choice?.variant_id
									? { variant_id: choice.variant_id }
									: {}),
							})
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
						intervalString(price, {
							showOnce: true,
							labels: { interval: '/' },
						})}
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
