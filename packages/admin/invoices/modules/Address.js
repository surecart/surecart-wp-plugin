/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScIcon,
	ScDialog,
	ScAddress,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScForm,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import expand from '../checkout-query';
import Error from '../../components/Error';
import AddressDisplay from '../../components/AddressDisplay';

export default ({ checkout, loading, busy, setBusy, isDraftInvoice }) => {
	const { receiveEntityRecords } = useDispatch(coreStore);
	const [open, setOpen] = useState(false);
	const [error, setError] = useState(false);
	const [customerShippingAddress, setCustomerShippingAddress] = useState(
		checkout?.shipping_address
	);

	// local state when shipping address changes.
	useEffect(() => {
		setCustomerShippingAddress(checkout?.shipping_address);
	}, [checkout?.shipping_address]);

	const onChange = async (shipping_address) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, { expand }),
				data: {
					shipping_address,
				},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'checkout',
				data,
				undefined,
				false,
				checkout
			);

			setOpen(false);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const renderModal = () => {
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
					onScRequestClose={() => setOpen(false)}
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

					<ScButton
						type="text"
						onClick={() => setOpen(false)}
						slot="footer"
					>
						{__('Cancel', 'surecart')}
					</ScButton>

					<ScButton busy={busy} type="primary" submit slot="footer">
						{__('Update', 'surecart')}
					</ScButton>
				</ScDialog>
			</ScForm>
		);
	};

	return (
		<>
			<Box
				title={__('Shipping & Tax Address', 'surecart')}
				loading={loading}
				footer={
					!loading &&
					!checkout?.shipping_address?.id &&
					isDraftInvoice && (
						<ScButton onClick={() => setOpen(true)}>
							{__('Add A Shipping Address', 'surecart')}
						</ScButton>
					)
				}
			>
				{!!checkout?.shipping_address?.id && (
					<div
						css={css`
							display: flex;
							justify-content: space-between;
						`}
					>
						<AddressDisplay address={checkout?.shipping_address} />

						{isDraftInvoice && (
							<ScDropdown placement="bottom-end">
								<ScButton slot="trigger" type="text" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem onClick={() => setOpen(true)}>
										{__('Edit', 'surecart')}
									</ScMenuItem>
									<ScMenuItem onClick={() => onChange(null)}>
										{__('Delete', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						)}
					</div>
				)}
			</Box>

			{renderModal()}
		</>
	);
};
