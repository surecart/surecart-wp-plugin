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
		await updateCheckout({
			shipping_address: null,
			billing_address: null,
			billing_matches_shipping: true,
		});
	};

	const saveAddress = async () => {
		if (!isDraftInvoice && !checkout?.id) return;
		console.log(billingMatchesShipping, 'billingMatchesShipping');
		console.log('called saveAddress');

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

	const renderForm = () => {
		if (!checkout?.id) {
			return null;
		}

		if (!isDraftInvoice) {
			return (
				<div>
					<AddressDisplay address={checkout?.shipping_address} />

					<ScText
						tag="h3"
						css={css`
							margin: var(--sc-spacing-medium) 0;
							padding: var(--sc-spacing-medium) 0;
							border-bottom: 1px solid var(--sc-color-gray-300);
						`}
						style={{
							'--font-weight': 'var(--sc-font-weight-bold)',
							'--font-size': 'var(--sc-font-size-medium)',
						}}
					>
						{__('Billing Address', 'surecart')}
					</ScText>

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
						padding: 1em 0;
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
		<Box
			title={__('Shipping & Tax Address', 'surecart')}
			loading={loading}
			header_action={
				isDraftInvoice && (
					<ScDropdown placement="bottom-end">
						<ScButton
							slot="trigger"
							type="text"
							circle
							style={{
								margin: '-10px',
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
