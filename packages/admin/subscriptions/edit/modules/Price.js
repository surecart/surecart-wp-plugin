/** @jsx jsx */
import DataTable from '../../../components/DataTable';
import { intervalString } from '../../../util/translations';
import PriceSelector from '@admin/components/PriceSelector';
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScInput,
	ScPriceInput,
	ScFormatNumber,
	ScIcon,
	ScButton,
} from '@surecart/components-react';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ subscription, updateSubscription, upcoming, loading }) => {
	const [price, setPrice] = useState(null);
	const [open, setOpen] = useState(false);
	const lineItem = upcoming?.checkout?.line_items?.data?.[0];

	useEffect(() => {
		if (lineItem?.price?.id) {
			setPrice(lineItem?.price);
		}
	}, [lineItem]);

	const changePrice = (e) => {
		updateSubscription({
			ad_hoc_amount: e.target.value,
		});
	};

	const renderChangePriceButton = () => {
		return (
			<ScButton
				size="small"
				onClick={() => {
					if (!open) {
						setOpen(true);
						setPrice(false);
					} else {
						setOpen(false);
						if (lineItem?.price?.id) {
							setPrice(lineItem?.price);
						}
					}
				}}
				css={
					open
						? css`
								margin-left: 20px;
						  `
						: ''
				}
			>
				{!open ? __('Change', 'surecart') : <ScIcon name="x" />}
			</ScButton>
		);
	};

	return (
		<div
			css={css`
				position: relative;
			`}
		>
			<DataTable
				loading={price === null}
				title={__('Pricing', 'surecart')}
				tableRowStyle={{
					display: 'grid',
					alignItems: 'center',
					gridTemplateColumns: '4fr 1fr 2fr',
					width: 'auto',
				}}
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
											value={lineItem?.total_amount}
											onScInput={changePrice}
											onScChange={changePrice}
											css={css`
												@media screen and (max-width: 1115px) {
													max-width: 150px;
												}
											`}
										/>
									) : (
										<div>
											{price?.product?.name}
											<div style={{ opacity: 0.5 }}>
												<ScFormatNumber
													type="currency"
													value={price?.amount}
													currency={price?.currency}
												/>
												{intervalString(price, {
													labels: { interval: '/' },
												})}
											</div>
										</div>
									)}

									{renderChangePriceButton()}
								</div>
							</div>
						) : (
							<div
								css={css`
									display: grid;
									align-items: center;
									grid-template-columns: 4fr 1fr;
								`}
							>
								<PriceSelector
									open={open}
									required
									value={price?.id}
									onSelect={(price) => {
										if (price) {
											updateSubscription({
												price,
											});
										}
									}}
									requestQuery={{
										archived: false,
										recurring: true,
									}}
								/>

								{renderChangePriceButton()}
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
		</div>
	);
};
