/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import Error from '../components/Error';

import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import SaveButton from '../templates/SaveButton';
import UpdateModel from '../templates/UpdateModel';
import Balance from './modules/Balance';
import Charges from './modules/Charges';
import Details from './modules/Details';
import Notifications from './modules/Notifications';
import Orders from './modules/Orders';
import Purchases from './modules/Purchases';
import Subscriptions from './modules/Subscriptions';
import PaymentMethods from './modules/PaymentMethods';
import User from './modules/User';
import ActionsDropdown from './components/ActionsDropdown';
import ShippingAddress from './modules/ShippingAddress';
import EditAddressModal from './modules/ShippingAddress/EditAddressModal';
import ConfirmDeleteAddressModal from './modules/ShippingAddress/ConfirmDeleteAddressModal';
import TaxSettings from './modules/TaxSettings';
import Licenses from './modules/Licenses';
import Affiliates from '../components/affiliates';
import useSave from '../settings/UseSave';
import BillingAddress from './modules/BillingAddress';
import EditBillingAddressModal from './modules/BillingAddress/EditBillingAddressModal';
import ConfirmDeleteBillingAddressModal from './modules/BillingAddress/ConfirmDeleteBillingAddressModal';

const modals = {
	EDIT_SHIPPING_ADDRESS: 'EDIT_SHIPPING_ADDRESS',
	CONFIRM_DELETE_ADDRESS: 'CONFIRM_DELETE_ADDRESS',
	EDIT_BILLING_ADDRESS: 'EDIT_BILLING_ADDRESS',
	CONFIRM_DELETE_BILLING_ADDRESS: 'CONFIRM_DELETE_BILLING_ADDRESS',
};

export default () => {
	const [error, setError] = useState(null);
	const [currentModal, setCurrentModal] = useState(null);
	const { save } = useSave();
	const id = useSelect((select) => select(dataStore).selectPageId());
	const {
		customer,
		editCustomer,
		deleteCustomer,
		hasLoadedCustomer,
		deletingCustomer,
		savingCustomer,
	} = useEntity('customer', id, {
		expand: ['balances', 'shipping_address', 'billing_address'],
	});

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			await save({ successMessage: __('Customer updated.', 'surecart') });
		} catch (e) {
			setError(e);
		}
	};

	/**
	 * Toggle customer delete.
	 */
	const onCustomerDelete = async () => {
		const r = confirm(
			sprintf(
				__(
					'Permanently delete %s? You cannot undo this action.',
					'surecart'
				),
				customer?.name ||
					customer?.email ||
					__('this customer', 'surecart')
			)
		);
		if (!r) return;

		try {
			setError(null);
			await deleteCustomer({ throwOnError: true });
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<ScFlex style={{ gap: '1em' }} align-items="center">
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-customers"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-customers">
							{__('Customers', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Edit Customer', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</ScFlex>
			}
			button={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ActionsDropdown
						customer={customer}
						onDelete={onCustomerDelete}
					/>
					<SaveButton
						loading={!hasLoadedCustomer}
						busy={deletingCustomer || savingCustomer}
					>
						{__('Save Customer', 'surecart')}
					</SaveButton>
				</div>
			}
			sidebar={
				<>
					<Balance customer={customer} loading={!hasLoadedCustomer} />
					<Purchases customerId={id} />
					<Licenses customerId={id} />
					<ShippingAddress
						shippingAddress={customer?.shipping_address}
						loading={!hasLoadedCustomer}
						onEditAddress={() =>
							setCurrentModal(modals.EDIT_SHIPPING_ADDRESS)
						}
						onDeleteAddress={() =>
							setCurrentModal(modals.CONFIRM_DELETE_ADDRESS)
						}
					/>
					<BillingAddress
						billingAddress={
							customer?.billing_matches_shipping
								? customer?.shipping_address
								: customer?.billing_address
						}
						loading={!hasLoadedCustomer}
						onEditAddress={() =>
							setCurrentModal(modals.EDIT_BILLING_ADDRESS)
						}
						onDeleteAddress={() =>
							setCurrentModal(
								modals.CONFIRM_DELETE_BILLING_ADDRESS
							)
						}
					/>
					<TaxSettings
						customer={customer}
						loading={!hasLoadedCustomer}
						updateCustomer={editCustomer}
					/>
					<User customer={customer} customerId={id} />
					<Notifications
						customer={customer}
						updateCustomer={editCustomer}
						loading={!hasLoadedCustomer}
					/>
					<Affiliates
						item={customer}
						updateItem={editCustomer}
						loading={!hasLoadedCustomer}
						commissionText={__(
							'Commissions On All Purchases',
							'surecart'
						)}
					/>
				</>
			}
		>
			<Error error={error} setError={setError} margin="80px" />
			<Details
				customer={customer}
				updateCustomer={editCustomer}
				loading={!hasLoadedCustomer}
			/>

			<Orders customerId={id} />
			<Charges customerId={id} />
			<Subscriptions customerId={id} />
			<PaymentMethods customerId={id} />

			{/* <Fragment>
				<Details
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Prices
					productId={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Integrations id={id} />

				<Downloads
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Licensing
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>
			</Fragment> */}

			{!!currentModal ? (
				<>
					<EditAddressModal
						open={currentModal === modals.EDIT_SHIPPING_ADDRESS}
						shippingAddress={customer?.shipping_address}
						onRequestClose={() => setCurrentModal('')}
						customerId={id}
					/>
					<ConfirmDeleteAddressModal
						open={currentModal === modals.CONFIRM_DELETE_ADDRESS}
						onRequestClose={() => setCurrentModal('')}
						customerId={id}
					/>
					<EditBillingAddressModal
						open={currentModal === modals.EDIT_BILLING_ADDRESS}
						billingAddress={customer?.billing_address}
						onRequestClose={() => setCurrentModal('')}
						customerId={id}
					/>
					<ConfirmDeleteBillingAddressModal
						open={
							currentModal ===
							modals.CONFIRM_DELETE_BILLING_ADDRESS
						}
						onRequestClose={() => setCurrentModal('')}
						customerId={id}
					/>
				</>
			) : null}
		</UpdateModel>
	);
};
