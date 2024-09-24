/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDialog,
	ScAddress,
	ScForm,
	ScCheckbox,
} from '@surecart/components-react';
import Error from '../../components/Error';
import { useInvoice } from '../hooks/useInvoice';

export default ({ open, onRequestClose }) => {
	const {
		invoice,
		receiveInvoice,
		checkout,
		busy: checkoutBusy,
		isDraftInvoice,
		checkoutExpands,
	} = useInvoice();
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(checkoutBusy);
	const [customerShippingAddress, setCustomerShippingAddress] = useState(
		checkout?.shipping_address
	);

	const [customerBillingAddress, setCustomerBillingAddress] = useState(
		checkout?.billing_address
	);

	const [billingMatchesShipping, setBillingMatchesShipping] = useState(
		checkout?.billing_matches_shipping
	);

	// local state when shipping address changes.
	useEffect(() => {
		setCustomerShippingAddress(checkout?.shipping_address);
	}, [checkout?.shipping_address, open]);

	useEffect(() => {
		setCustomerBillingAddress(checkout?.billing_address);
	}, [checkout?.billing_address, open]);

	useEffect(() => {
		setBillingMatchesShipping(checkout?.billing_matches_shipping);
	}, [checkout?.billing_matches_shipping, open]);

	if (!isDraftInvoice) return null;

	const saveAddress = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();

		try {
			setBusy(true);
			setError(null);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand: checkoutExpands,
				}),
				data: {
					shipping_address: customerShippingAddress,
					...(billingMatchesShipping
						? {}
						: { billing_address: customerBillingAddress }),
					billing_matches_shipping: billingMatchesShipping,
				},
			});

			receiveInvoice({
				...invoice,
				checkout: data,
			});

			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScForm onScFormSubmit={saveAddress}>
			<ScDialog
				label={__('Edit Shipping & Tax Address', 'surecart')}
				open={open}
				style={{ '--dialog-body-overflow': 'visible' }}
				onScRequestClose={onRequestClose}
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-form-row-spacing);
					`}
				>
					<Error error={error} />
					<ScAddress
						showName={true}
						showLine2={true}
						required={open}
						address={customerShippingAddress}
						onScInputAddress={(e) =>
							setCustomerShippingAddress(e?.detail)
						}
					/>

					<ScCheckbox
						css={css`
							padding: 0.5em 0;
						`}
						checked={billingMatchesShipping}
						onScChange={(e) => {
							setBillingMatchesShipping(e.target.checked);
						}}
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
							required={open}
							address={customerBillingAddress}
							onScInputAddress={(e) =>
								setCustomerBillingAddress(e?.detail)
							}
						/>
					)}
				</div>

				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>

				<ScButton busy={busy} type="primary" submit slot="footer">
					{__('Update', 'surecart')}
				</ScButton>
			</ScDialog>
		</ScForm>
	);
};
