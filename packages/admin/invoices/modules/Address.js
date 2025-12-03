/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
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
} from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';

export default ({ checkout }) => {
	if (!checkout?.id) {
		return null;
	}

	const [modal, setModal] = useState(false);
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

	const clearAddress = () => {
		setCustomerShippingAddress(null);
		setCustomerBillingAddress(null);
		setBillingMatchesShipping(true);
		setModal(null);
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
		setModal(null);
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
					<div
						css={css`
							flex: 1 1 200px;
							padding: var(
								--sc-card-padding,
								var(--sc-spacing-large)
							);
							background: var(
								--sc-card-background-color,
								var(--sc-color-white)
							);
							border: 1px solid
								var(
									--sc-card-border-color,
									var(--sc-color-gray-300)
								);
							border-radius: var(--sc-input-border-radius-medium);
						`}
					>
						<ScFormControl
							label={__('Ship to', 'surecart')}
							css={css`
								height: 100%;
								display: flex;
							`}
						>
							{!!checkout?.shipping_address?.country ? (
								<AddressDisplay
									address={
										checkout?.shipping_address
											?.formatted_string
									}
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
					</div>

					<div
						css={css`
							flex: 1 1 200px;
							padding: var(
								--sc-card-padding,
								var(--sc-spacing-large)
							);
							background: var(
								--sc-card-background-color,
								var(--sc-color-white)
							);
							border: 1px solid
								var(
									--sc-card-border-color,
									var(--sc-color-gray-300)
								);
							border-radius: var(--sc-input-border-radius-medium);
						`}
					>
						<ScFormControl
							label={__('Bill to', 'surecart')}
							css={css`
								height: 100%;
								display: flex;
							`}
						>
							{!!billingAddress?.country ? (
								<AddressDisplay
									address={billingAddress?.formatted_string}
								/>
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
					</div>
				</div>
			);
		}

		return (
			<>
				<ScAddress
					label={__('Shipping & Tax Address', 'surecart')}
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
					<ScAddress
						label={__('Billing Address', 'surecart')}
						showName={true}
						showLine2={true}
						required={checkout?.shipping_address_required || false}
						address={customerBillingAddress}
						onScChangeAddress={(e) =>
							setCustomerBillingAddress(e?.detail)
						}
					/>
				)}
			</>
		);
	};

	return (
		<>
			<Box
				title={__('Address', 'surecart')}
				loading={loading}
				header_action={
					isDraftInvoice && (
						<>
							{checkout?.customer?.shipping_address?.id && (
								<ScButton
									css={css`
										margin: -12px 0;
									`}
									type="link"
									title={__(
										'Fill Customer Address',
										'surecart'
									)}
									onclick={() => setModal('fill')}
								>
									{__('Fill Customer Address', 'surecart')}
								</ScButton>
							)}

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
										<ScMenuItem
											onClick={() => setModal('clear')}
										>
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

			<ConfirmDialog
				isOpen={modal === 'fill'}
				onConfirm={fillAddressFromCustomer}
				onCancel={() => setModal(null)}
				confirmButtonText={__('Confirm', 'surecart')}
			>
				<p
					css={css`
						font-weight: var(--sc-font-weight-bold);
					`}
				>
					{__('Are you sure?', 'surecart')}
				</p>
				<p
					css={css`
						max-width: 300px;
					`}
				>
					{__(
						"This will set the shipping and billing addresses to the customer's default.",
						'surecart'
					)}
				</p>
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={modal === 'clear'}
				onConfirm={clearAddress}
				onCancel={() => setModal(null)}
				confirmButtonText={__('Clear', 'surecart')}
			>
				<p
					css={css`
						font-weight: var(--sc-font-weight-bold);
					`}
				>
					{__('Are you sure?', 'surecart')}
				</p>
				<p
					css={css`
						max-width: 300px;
					`}
				>
					{__(
						'This will remove the shipping and billing addresses from the invoice.',
						'surecart'
					)}
				</p>
			</ConfirmDialog>
		</>
	);
};
