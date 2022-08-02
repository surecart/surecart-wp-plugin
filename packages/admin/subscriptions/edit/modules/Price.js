/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { css, jsx } from '@emotion/core';
import { ScBlockUi, ScInput, ScPriceInput } from '@surecart/components-react';
import PriceSelector from '@admin/components/PriceSelector';
import { intervalString } from '../../../util/translations';
import { useEffect, useState } from '@wordpress/element';

export default ({ subscription, updateSubscription, upcoming, loading }) => {
	const [price, setPrice] = useState(null);
	const [open, setOpen] = useState(false);
	const lineItem = upcoming?.checkout?.line_items?.data?.[0];

	useEffect(() => {
		if (lineItem?.price?.id) {
			setPrice(lineItem?.price);
		}
	}, [lineItem]);

	console.log({ price });
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
						width: '75px',
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
						product: price ? (
							<div>
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 1em;
									`}
								>
									{price?.ad_hoc ? (
										<ScPriceInput
											label={price?.product?.name}
											value={
												subscription?.ad_hoc_amount ||
												price?.amount
											}
											onScChange={(e) =>
												updateSubscription({
													ad_hoc_amount:
														e.target.value,
												})
											}
										/>
									) : (
										<div>
											{price?.product?.name}
											<div style={{ opacity: 0.5 }}>
												<sc-format-number
													type="currency"
													value={
														subscription?.ad_hoc_amount ||
														price?.amount
													}
													currency={price?.currency}
												/>
												{intervalString(price, {
													labels: { interval: '/' },
												})}
											</div>
										</div>
									)}

									<sc-button
										size="small"
										onClick={() => {
											setPrice(false);
											setOpen(true);
										}}
									>
										{__('Change', 'surecart')}
									</sc-button>
								</div>
							</div>
						) : (
							<PriceSelector
								open={open}
								required
								value={price?.id}
								onSelect={(price) => {
									if (price) {
										updateSubscription({ price });
									}
								}}
								requestQuery={{
									archived: false,
									recurring: true,
								}}
							/>
						),
						quantity: (
							<ScInput
								type="number"
								value={subscription?.quantity}
								onScChange={(e) => {
									updateSubscription({
										price,
										quantity: e.target.value,
									});
								}}
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
									<sc-format-number
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
		</div>
	);
};
