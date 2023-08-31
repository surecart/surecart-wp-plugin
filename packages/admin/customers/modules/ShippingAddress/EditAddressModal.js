import {
	ScAddress,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Error from '../../../components/Error';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

export default ({ customerId, shippingAddress, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [address, setAddress] = useState(shippingAddress);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		setAddress(shippingAddress);
	}, [shippingAddress]);

	const isEdit = () => !!shippingAddress?.id;

	const onEditAddress = async () => {
		try {
			setBusy(true);
			const customer = await apiFetch({
				path: addQueryArgs(`/surecart/v1/customers/${customerId}`, {
					expand: ['shipping_address', 'balances'],
				}),
				method: 'PATCH',
				data: {
					shipping_address: address,
				},
			});
			receiveEntityRecords('surecart', 'customer', customer);
			createSuccessNotice(__('Address Updated', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScDialog
			label={
				isEdit()
					? __('Update Shipping Address', 'surecart')
					: __('Add Shipping Address', 'surecart')
			}
			open={open}
			onScRequestClose={onRequestClose}
			style={{
				'--dialog-body-overflow': 'visible',
			}}
		>
			<Error error={error} setError={setError} />
			<ScForm
				onScSubmit={onEditAddress}
				onScFormSubmit={(e) => {
					e.stopImmediatePropagation();
				}}
			>
				<ScAddress
					address={address}
					onScChangeAddress={(e) => setAddress(e.detail)}
					required
				/>
				<ScFlex justifyContent="flex-end">
					<ScButton
						type="text"
						onClick={onRequestClose}
						disabled={busy}
					>
						{__('Cancel', 'surecart')}
					</ScButton>{' '}
					<ScButton type="primary" disabled={busy} submit>
						{isEdit()
							? __('Update Address', 'surecart')
							: __('Save Address', 'surecart')}
					</ScButton>
				</ScFlex>
			</ScForm>
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ScDialog>
	);
};
