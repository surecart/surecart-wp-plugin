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
					<ScCard
						css={css`
							flex: 1 1 200px;
						`}
					>
						<ScFormControl
							label={__('Ship to', 'surecart')}
							css={css`
								height: 100%;
								display: flex;
								min-height: 120px;
							`}
						>
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
						<ScFormControl
							label={__('Bill to', 'surecart')}
							css={css`
								height: 100%;
								display: flex;
								min-height: 120px;
							`}
						>
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
				<ScText
					tag="h3"
					style={{
						'--font-weight': 'var(--sc-font-weight-bold)',
						'--font-size': 'var(--sc-font-size-medium)',
						paddingBottom: 'var(--sc-spacing-large)',
						borderBottom: '1px solid var(--sc-color-gray-100)',
					}}
				>
					{__('Set Default Addresses', 'surecart')}
				</ScText>

				<p
					dangerouslySetInnerHTML={{
						__html: sprintf(
							/* translators: %1$s: shipping (bold), %2$s: billing (bold) */
							__(
								"📍 This will set the %1$s and %2$s to the customer's default.",
								'surecart'
							),
							`<strong>${__('shipping', 'surecart')}</strong>`,
							`<strong>${__('billing', 'surecart')}</strong>`
						),
					}}
				/>
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={modal === 'clear'}
				onConfirm={clearAddress}
				onCancel={() => setModal(null)}
				confirmButtonText={__('Clear', 'surecart')}
			>
				{__(
					'This will remove the shipping and billing addresses from the invoice. Are you sure you want to continue?',
					'surecart'
				)}
			</ConfirmDialog>
		</>
	);
};
