/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScFormatNumber,
	ScPriceInput,
} from '@surecart/components-react';
import { Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../admin/util/translations';
import LineItemLabel from '../../admin/ui/LineItemLabel';

export default ({ choice, onUpdate, hideQuantity, onRemove }) => {
	console.log('choice', choice);
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

	const amount = variant?.amount ?? price?.amount;

	console.log('price', price);

	const renderPrice = (withQuantity = false) => {
		if (!price?.id) return '—';

		// For ad-hoc price, lets add a custom input if needed.
		if (price?.ad_hoc) {
			return (
				<ScPriceInput
					placeholder={__('Enter Custom Amount', 'surecart')}
					currencyCode={scData.currency}
					value={choice?.ad_hoc_amount || price?.ad_hoc_max_amount}
					onScInput={(e) => {
						onUpdate({
							id: choice?.id,
							ad_hoc_amount: e.target.value,
							quantity: choice?.quantity || 1,
							...(choice?.variant_id
								? { variant_id: choice.variant_id }
								: {}),
						});
					}}
					max={price?.ad_hoc_max_amount}
					min={price?.ad_hoc_min_amount}
					css={css`
						max-width: 100px;
					`}
				/>
			);
		}

		return (
			<sc-format-number
				type="currency"
				value={amount * (withQuantity ? choice?.quantity || 1 : 1)}
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
										!!price?.ad_hoc
											? price?.amount
											: variant?.amount ?? price?.amount
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
			<sc-table-cell style={{ textAlign: 'center' }}>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
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
				</div>
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
