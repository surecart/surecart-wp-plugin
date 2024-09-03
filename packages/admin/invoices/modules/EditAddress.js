/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select } from '@wordpress/data';
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
import expand from '../checkout-query';
import Error from '../../components/Error';
import { useInvoice } from '../hooks/useInvoice';

export default ({ open, onRequestClose }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(false);
	const { invoice, checkout, receiveInvoice } = useInvoice();
	const isDraftInvoice = invoice?.status === 'draft';
	const [customerShippingAddress, setCustomerShippingAddress] = useState(
		checkout?.shipping_address
	);

	// local state when shipping address changes.
	useEffect(() => {
		setCustomerShippingAddress(checkout?.shipping_address);
	}, [checkout?.shipping_address, open]);

	const onChange = async (shipping_address) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, { expand }),
				data: {
					shipping_address,
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

	if (!isDraftInvoice) return null;

	return (
		<ScForm
			onScFormSubmit={(e) => {
				e.preventDefault();
				e.stopImmediatePropagation();
				onChange(customerShippingAddress);
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
					<Error error={error} setError={setError} />
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
