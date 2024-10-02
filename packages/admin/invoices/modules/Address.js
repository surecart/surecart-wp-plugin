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
	ScDivider,
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
			return (
				<div>
					{renderAddressHeader(
						__('Shipping & Tax Address', 'surecart')
					)}
					<AddressDisplay address={checkout?.shipping_address} />

					<ScDivider style={{ '--spacing': 'var(--sc-spacing-small)' }} />

					{renderAddressHeader(__('Billing Address', 'surecart'))}

					{checkout?.billing_matches_shipping ? (
						<AddressDisplay address={checkout?.shipping_address} />
					) : (
						<AddressDisplay address={checkout?.billing_address} />
					)}
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
				isDraftInvoice &&
				checkout?.shipping_address?.id && (
					<ScDropdown placement="bottom-end">
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
				)
			}
		>
			<div>{renderForm()}</div>
		</Box>
	);
};
