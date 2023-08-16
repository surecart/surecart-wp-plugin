/** @jsx jsx */
import DataTable from '../../../components/DataTable';
import { intervalString, productNameWithPrice } from '../../../util/translations';
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScInput,
	ScFormatNumber,
	ScIcon,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import UpdateAmount from './Modals/UpdateAmount';
import UpdatePrice from './Modals/UpdatePrice';

export default ({ subscription, updateSubscription, upcoming, loading }) => {
	const [price, setPrice] = useState(null);
	const [dialog, setDialog] = useState(null);
	const lineItem = upcoming?.checkout?.line_items?.data?.[0];

	useEffect(() => {
		if (lineItem?.price?.id) {
			setPrice(lineItem?.price);
		}
	}, [lineItem]);

	return (
		<div
			css={css`
				position: relative;
			`}
		>
			<DataTable
				loading={price === null}
				title={__('Pricing', 'surecart')}
				columns={{
					product: {
						label: __('Price', 'surecart'),
					},
					quantity: {
						label: __('Qty', 'surecart'),
					},
					total: {
						label: (
							<div
								css={css`
									display: flex;
									justify-content: flex-end;
								`}
							>
								{__('Total', 'surecart')}
							</div>
						),
					},
				}}
				items={[
					{
						product: !!price && (
							<div
								css={css`
									display: flex;
									align-items: center;
									gap: 1em;
								`}
							>
								<div>
									{productNameWithPrice(price)}
									<div style={{ opacity: 0.5 }}>
										<ScFormatNumber
											type="currency"
											value={
												price?.ad_hoc &&
												subscription?.ad_hoc_amount
													? subscription?.ad_hoc_amount
													: price?.amount
											}
											currency={price?.currency}
										/>
										{intervalString(price, {
											labels: { interval: '/' },
										})}
									</div>
								</div>

								<ScDropdown
									placement="bottom-end"
									css={css`
										margin-left: auto;
									`}
								>
									<ScButton circle type="text" slot="trigger">
										<ScIcon name="more-vertical" />
									</ScButton>
									<ScMenu>
										{price?.ad_hoc && (
											<ScMenuItem
												onClick={() =>
													setDialog('amount')
												}
											>
												{__('Edit Amount', 'surecart')}
											</ScMenuItem>
										)}
										<ScMenuItem
											onClick={() => setDialog('price')}
										>
											{__('Change Price', 'surecart')}
										</ScMenuItem>
									</ScMenu>
								</ScDropdown>
							</div>
						),
						quantity: (
							<ScInput
								type="number"
								value={subscription?.quantity}
								onScChange={(e) => {
									updateSubscription({
										price: price?.id,
										quantity: e.target.value,
									});
								}}
								style={{ maxWidth: 75 }}
								required
							></ScInput>
						),
						total: (
							<div
								css={css`
									display: flex;
									justify-content: flex-end;
								`}
							>
								<div>
									<ScFormatNumber
										type="currency"
										value={lineItem?.total_amount}
										currency={lineItem?.price?.currency}
									/>{' '}
									{intervalString(lineItem?.price, {
										labels: { interval: '/' },
									})}
								</div>
							</div>
						),
					},
				]}
			/>

			{loading && price !== null && <ScBlockUi spinner />}

			<UpdateAmount
				amount={lineItem?.ad_hoc_amount || price?.amount}
				onUpdateAmount={(ad_hoc_amount) =>
					updateSubscription({ ad_hoc_amount })
				}
				open={dialog === 'amount'}
				onRequestClose={() => setDialog(null)}
			/>

			<UpdatePrice
				price={price}
				onUpdatePrice={(price) => updateSubscription({ price })}
				open={dialog === 'price'}
				onRequestClose={() => setDialog(null)}
			/>
		</div>
	);
};
