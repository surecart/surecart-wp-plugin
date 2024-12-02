/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScInput,
	ScFormatNumber,
	ScIcon,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import LineItemLabel from '../../components/LineItemLabel';
import DataTable from '../../../components/DataTable';
import UpdateAmount from './Modals/UpdateAmount';
import UpdatePrice from './Modals/UpdatePrice';
import UpdateRecentPrice from './Modals/UpdateRecentPrice';
import { getHumanDiscount } from '../../../util';
import { intervalString } from '../../../util/translations';

export default ({
	subscription,
	updateSubscription,
	setRefresh,
	setUpdateBehavior,
	setSkipProration,
	upcoming,
	loading,
}) => {
	const [price, setPrice] = useState(null);
	const [dialog, setDialog] = useState(null);
	const lineItem = upcoming?.checkout?.line_items?.data?.[0];

	useEffect(() => {
		if (lineItem?.price?.id) {
			setPrice(lineItem?.price);
		}
	}, [lineItem]);

	const coupon =
		upcoming?.checkout?.discount?.coupon || subscription?.discount?.coupon;

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
									<div>{price?.product?.name}</div>
									<LineItemLabel lineItem={lineItem}>
										<div>
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
											{!price?.current_version && (
												<ScTag type="info" pill>
													{__(
														'Previous Price Version',
														'surecart'
													)}
												</ScTag>
											)}
										</div>
									</LineItemLabel>
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
											{__('Change', 'surecart')}
										</ScMenuItem>
										{!price?.current_version && (
											<ScMenuItem
												onClick={() =>
													setDialog('recent_price')
												}
											>
												{__(
													'Use Current Version',
													'surecart'
												)}
											</ScMenuItem>
										)}
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
					...(!!coupon?.id
						? [
								{
									product: (
										<ScTag type="default">
											{coupon?.name}
										</ScTag>
									),
									total: (
										<>
											{getHumanDiscount(
												coupon,
												coupon?.currency
											)}
										</>
									),
								},
						  ]
						: []),
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
				onUpdatePrice={(priceId, variantId) => {
					updateSubscription({
						price: priceId,
						variant: variantId || null,
					});
				}}
				open={dialog === 'price'}
				onRequestClose={() => setDialog(null)}
			/>

			<UpdateRecentPrice
				price={price}
				subscription={subscription}
				onUpdateRecentVersion={(
					updateBehavior = null,
					skipProration
				) => {
					setRefresh(true);
					setSkipProration(skipProration);
					if (updateBehavior) {
						setUpdateBehavior('immediate');
					}
				}}
				open={dialog === 'recent_price'}
				onRequestClose={() => setDialog(null)}
			/>
		</div>
	);
};
