import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScFormatNumber,
	ScLineItem,
	ScCouponForm,
	ScDivider,
	ScPaymentMethod,
	ScButton,
	ScIcon,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';
import { formatTaxDisplay } from '../../util/tax';
import CollectPayment from './CollectPayment';

export default ({ checkout, loading, setBusy, setPaymentID, paymentID }) => {
	const [paymentMethod, setPaymentMethod] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);

	const onCouponChange = async (e) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
				}),
				data: {
					discount: {
						promotion_code: e?.detail,
					}, // update the coupon.
				},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				data,
				undefined,
				false,
				checkout
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusy(false);
		}
	};

	const renderPaymentDetails = () => {
		return (
			<>
				<ScLineItem>
					<span slot="description">{__('Subtotal', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						style={{
							fontWeight: 'var(--sc-font-weight-semibold)',
							color: 'var(--sc-color-gray-800)',
						}}
						type="currency"
						currency={checkout?.currency}
						value={checkout?.subtotal_amount}
					></ScFormatNumber>
				</ScLineItem>

				{!!checkout?.shipping_amount && (
					<ScLineItem>
						<span slot="description">
							{__('Shipping', 'surecart')}
						</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.shipping_amount}
						></ScFormatNumber>
					</ScLineItem>
				)}

				{!!checkout?.tax_amount && (
					<ScLineItem>
						<span slot="description">{`${formatTaxDisplay(
							__('Order Tax', 'surecart')
						)} (${checkout?.tax_percent}%)`}</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.tax_amount}
						></ScFormatNumber>
					</ScLineItem>
				)}

				<ScCouponForm
					collapsed={true}
					placeholder={__('Enter Coupon Code', 'surecart')}
					label={__('Add Coupon Code', 'surecart')}
					buttonText={__('Apply', 'surecart')}
					onScApplyCoupon={onCouponChange}
					discount={checkout?.discount}
					currency={checkout?.currency}
					discountAmount={checkout?.discount_amount}
				/>

				<ScDivider style={{ '--spacing': 'var(--sc-spacing-small)' }} />

				<ScLineItem>
					<span slot="description">{__('Total', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						style={{
							fontWeight: 'var(--sc-font-weight-semibold)',
							color: 'var(--sc-color-gray-800)',
						}}
						type="currency"
						currency={checkout?.currency}
						value={checkout?.total_amount}
					></ScFormatNumber>
				</ScLineItem>

				{!!checkout?.trial_amount && (
					<ScLineItem>
						<span slot="description">
							{__('Trial', 'surecart')}
						</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.trial_amount}
						></ScFormatNumber>
					</ScLineItem>
				)}

				{checkout?.total_amount !== checkout?.amount_due && (
					<ScLineItem>
						<span slot="title">{__('Amount Due', 'surecart')}</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.amount_due}
						></ScFormatNumber>
					</ScLineItem>
				)}

				{!!paymentMethod && (
					<>
						<ScDivider
							style={{ '--spacing': 'var(--sc-spacing-small)' }}
						/>
						<div
							style={{
								display: 'flex',
								width: '100%',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<ScPaymentMethod paymentMethod={paymentMethod} />
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '2em',
								}}
							>
								{!!paymentMethod?.card?.exp_month && (
									<span>
										{__('Exp.', 'surecart')}
										{paymentMethod?.card?.exp_month}/
										{paymentMethod?.card?.exp_year}
									</span>
								)}
								{!!paymentMethod?.paypal_account?.email &&
									paymentMethod?.paypal_account?.email}

								<ScDropdown placement="bottom-end">
									<ScButton type="text" slot="trigger" circle>
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										<ScMenuItem
											onClick={() => {
												setPaymentID(false);
												setPaymentMethod(false);
											}}
										>
											<ScIcon
												slot="prefix"
												name="trash"
												style={{
													opacity: 0.5,
												}}
											/>
											{__('Remove', 'surecart')}
										</ScMenuItem>
									</ScMenu>
								</ScDropdown>
							</div>
						</div>
					</>
				)}
			</>
		);
	};

	return (
		<Box
			title={__('Payment', 'surecart')}
			loading={loading}
			footer={
				<CollectPayment
					{...{
						checkout,
						setPaymentID,
						paymentID,
						paymentMethod,
						setPaymentMethod,
					}}
				/>
			}
			footerStyle={{
				justifyContent: 'flex-end',
			}}
		>
			{renderPaymentDetails()}
		</Box>
	);
};
