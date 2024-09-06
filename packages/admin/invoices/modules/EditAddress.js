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
	ScDialog,
	ScAddress,
	ScForm,
} from '@surecart/components-react';
import Error from '../../components/Error';
import { useInvoice } from '../hooks/useInvoice';

export default ({ open, onRequestClose }) => {
	const { checkout, busy, isDraftInvoice, error, updateCheckout } =
		useInvoice();
	const [customerShippingAddress, setCustomerShippingAddress] = useState(
		checkout?.shipping_address
	);

	// local state when shipping address changes.
	useEffect(() => {
		setCustomerShippingAddress(checkout?.shipping_address);
	}, [checkout?.shipping_address, open]);

	if (!isDraftInvoice) return null;

	return (
		<ScForm
			onScFormSubmit={async (e) => {
				e.preventDefault();
				e.stopImmediatePropagation();

				const data = await updateCheckout({
					shipping_address: customerShippingAddress,
				});
				if (!!data) {
					onRequestClose();
				}
			}}
		>
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
