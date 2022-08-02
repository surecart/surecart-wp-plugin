/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { css, jsx } from '@emotion/core';
import { ScInput, ScPriceInput } from '@surecart/components-react';
import PriceSelector from '@admin/components/PriceSelector';
import { intervalString } from '../../../util/translations';
import useEntity from '../../../hooks/useEntity';

export default ({ subscription, updateSubscription, upcoming, priceId }) => {
	const { price, hasLoadedPrice } = useEntity('price', priceId, {
		expand: ['product'],
	});

	console.log({ upcoming });

	const items = (upcoming?.line_items?.data || []).map((line_item) => {
		const { price } = line_item;
		return {
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
									subscription?.ad_hoc_amount || price?.amount
								}
								onScChange={(e) =>
									updateSubscription({
										ad_hoc_amount: e.target.value,
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
							onClick={() => updateSubscription({ price: null })}
						>
							{__('Change', 'surecart')}
						</sc-button>
					</div>
				</div>
			) : (
				<PriceSelector
					open
					value={price?.id}
					onSelect={(price) => {
						updateSubscription({ price });
					}}
					requestQuery={{
						archived: false,
						recurring: true,
					}}
				/>
			),
		};
	});

	return (
		<DataTable
			loading={!hasLoadedPrice}
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
					product: subscription?.price ? (
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
												ad_hoc_amount: e.target.value,
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
									onClick={() =>
										updateSubscription({ price: null })
									}
								>
									{__('Change', 'surecart')}
								</sc-button>
							</div>
						</div>
					) : (
						<PriceSelector
							open
							value={price?.id}
							onSelect={(price) => {
								updateSubscription({ price });
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
									value={
										subscription?.ad_hoc_amount ||
										price?.amount * subscription?.quantity
									}
									currency={price?.currency}
								/>{' '}
								{intervalString(price, {
									labels: { interval: '/' },
								})}
							</div>
						</div>
					),
				},
			]}
		/>
	);
};
