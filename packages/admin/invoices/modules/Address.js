/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScIcon,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScAddress,
	ScCheckbox,
	ScText,
	ScFormControl,
	ScCard,
	ScTooltip,
} from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';

export default ({ checkout }) => {
	if (!checkout?.id) {
		return null;
	}

	const { loading, isDraftInvoice, updateCheckout } = useInvoice();
	const [customerShippingAddress, setCustomerShippingAddress] = useState(
		checkout?.shipping_address
	);

	const [customerBillingAddress, setCustomerBillingAddress] = useState(
		checkout?.billing_address
	);

	const [billingMatchesShipping, setBillingMatchesShipping] = useState(
		checkout?.billing_matches_shipping
	);

	const clearAddress = async () => {
		const data = await updateCheckout({
			shipping_address: null,
			billing_address: null,
			billing_matches_shipping: true,
		});

		if (data) {
			setCustomerShippingAddress(data.shipping_address);
			setCustomerBillingAddress(data.billing_address);
			setBillingMatchesShipping(data.billing_matches_shipping);
		}
	};

	const saveAddress = async () => {
		if (!isDraftInvoice && !checkout?.id) return;

		await updateCheckout({
			shipping_address: customerShippingAddress,
			...(billingMatchesShipping
				? {}
				: { billing_address: customerBillingAddress }),
			billing_matches_shipping: billingMatchesShipping,
		});
	};

	useEffect(() => {
		saveAddress();
	}, [
		customerShippingAddress,
		customerBillingAddress,
		billingMatchesShipping,
	]);

	const fillAddressFromCustomer = () => {
		if (!!checkout?.customer?.shipping_address?.id) {
			setCustomerShippingAddress(checkout?.customer?.shipping_address);
		}

		if (checkout?.customer?.billing_matches_shipping) {
			setBillingMatchesShipping(true);
		} else if (!!checkout?.customer?.billing_address?.id) {
			setBillingMatchesShipping(false);
			setCustomerBillingAddress(checkout?.customer?.billing_address);
		}
	};

	const renderAddressHeader = (title) => {
		return (
			<ScText
				tag="h3"
				css={css`
					margin-bottom: var(--sc-spacing-small);
					padding: var(--sc-spacing-small) 0;
				`}
				style={{
					'--font-weight': 'var(--sc-font-weight-bold)',
					'--font-size': 'var(--sc-font-size-small)',
				}}
			>
				{title}
			</ScText>
		);
	};

	const renderForm = () => {
		if (!checkout?.id) {
			return null;
		}

		if (!isDraftInvoice) {
			const billingAddress = checkout?.billing_matches_shipping
				? checkout?.shipping_address
				: checkout?.billing_address;

			return (
				<div
					css={css`
						display: flex;
						flex-wrap: wrap;
						gap: var(--sc-spacing-large);
						justify-content: space-between;
						align-items: stretch;
						--sc-input-label-font-weight: var(
							--sc-font-weight-bold
						);
					`}
				>
					<ScCard
						css={css`
							flex: 1 1 200px;
						`}
					>
						<ScFormControl label={__('Ship to', 'surecart')}>
							{!!checkout?.shipping_address?.country ? (
								<AddressDisplay
									address={checkout?.shipping_address}
								/>
							) : (
								<ScText
									style={{
										marginTop: 'var(--sc-spacing-small)',
									}}
								>
									{__(
										'No shipping address has been set.',
										'surecart'
									)}
								</ScText>
							)}
						</ScFormControl>
					</ScCard>

					<ScCard
						css={css`
							flex: 1 1 200px;
						`}
					>
						<ScFormControl label={__('Bill to', 'surecart')}>
							{!!billingAddress?.country ? (
								<AddressDisplay address={billingAddress} />
							) : (
								<ScText
									style={{
										marginTop: 'var(--sc-spacing-small)',
									}}
								>
									{__(
										'No billing address has been set.',
										'surecart'
									)}
								</ScText>
							)}
						</ScFormControl>
					</ScCard>
				</div>
			);
		}

		return (
			<>
				{renderAddressHeader(__('Shipping & Tax Address', 'surecart'))}
				<ScAddress
					showName={true}
					showLine2={true}
					required={checkout?.shipping_address_required || false}
					address={customerShippingAddress}
					onScChangeAddress={(e) =>
						setCustomerShippingAddress(e?.detail)
					}
				/>

				<ScCheckbox
					css={css`
						padding-top: var(--sc-spacing-large);
						padding-bottom: var(--sc-spacing-small);
					`}
					checked={billingMatchesShipping}
					onScChange={(e) =>
						setBillingMatchesShipping(e.target.checked)
					}
				>
					{__(
						'Billing address is same as shipping address',
						'surecart'
					)}
				</ScCheckbox>

				{!billingMatchesShipping && (
					<>
						{renderAddressHeader(__('Billing Address', 'surecart'))}
						<ScAddress
							showName={true}
							showLine2={true}
							required={
								checkout?.shipping_address_required || false
							}
							address={customerBillingAddress}
							onScChangeAddress={(e) =>
								setCustomerBillingAddress(e?.detail)
							}
						/>
					</>
				)}
			</>
		);
	};

	return (
		<Box
			title={__('Address', 'surecart')}
			loading={loading}
			header_action={
				isDraftInvoice && (
					<>
						<ScTooltip
							type="text"
							text={__('Fill Address from Customer', 'surecart')}
							css={css`
								margin-top: -12px;
								margin-bottom: -12px;
							`}
						>
							<ScButton
								type="default"
								title={__('Fill Address', 'surecart')}
								onclick={fillAddressFromCustomer}
							>
								{__('Fill Address', 'surecart')}
							</ScButton>
						</ScTooltip>

						{checkout?.shipping_address?.id && (
							<ScDropdown
								placement="bottom-end"
								css={css`
									margin-left: var(--sc-spacing-x-large);
								`}
							>
								<ScButton
									slot="trigger"
									type="text"
									circle
									style={{
										margin: '-12px',
									}}
								>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem onClick={clearAddress}>
										{__('Clear', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						)}
					</>
				)
			}
		>
			<div>{renderForm()}</div>
		</Box>
	);
};
