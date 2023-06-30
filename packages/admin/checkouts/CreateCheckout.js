/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as dataStore } from '@surecart/data';
import { store as noticesStore } from '@wordpress/notices';
import {
	ScButton,
	ScForm,
	ScBlockUi,
	ScAlert
} from '@surecart/components-react';
import Prices from './modules/Prices';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import expand from './query';
import SelectCustomer from './modules/SelectCustomer';
import Address from './modules/Address';
import Payment from './modules/Payment';
import Error from '../components/Error';

/**
 * Returns the Model Edit URL.
 *
 * @param {number} postId Post ID.
 *
 * @return {string} Post edit URL.
 */
export function getEditURL(id) {
	return addQueryArgs(window.location.href, { id });
}

export default () => {
	const [isSaving, setIsSaving] = useState(false);
	const [historyId, setHistoryId] = useState(null);
	const { saveEntityRecord, receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [checkoutIdLoading, setCheckoutIdLoading] = useState(false);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [busyCustomer, setBusyCustomer] = useState(false);
	const [checkoutError, setCheckoutError] = useState(false);

	const { checkout, loading, busy, error } = useSelect(
		(select) => {
			// we don't yet have a checkout.
			if (!id) {
				return {};
			}
			// our entity query data.
			const entityData = ['surecart', 'checkout', id, { expand }];

			const checkout = select(coreStore).getEditedEntityRecord(
				...entityData
			);
			const loading = !select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...entityData]
			);

			return {
				checkout,
				loading: !checkout?.id && loading,
				busy: checkout?.id && loading,
				error: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
			};
		},
		[id, line_items, checkout?.customer, checkout?.customer_id]
	);

	const customer = checkout?.customer;
	const line_items = checkout?.line_items;

	// we don't yet have a checkout.
	useEffect(() => {
		if (!id) {
			createCheckout();
		}
	}, [id]);

	// create the checkout for the first time.
	const createCheckout = async () => {
		try {
			setCheckoutIdLoading(true);
			const { id } = await saveEntityRecord('surecart', 'checkout', {
				customer_id: false,
			});
			setCheckoutId(id);
		} catch (e) {
			setCheckoutIdLoading(false);
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong.', 'surecart')
			);
		} finally {
			setCheckoutIdLoading(false);
		}
	};

	/**
	 * Replaces the browser URL with a edit link for a given id ID.
	 *
	 * @param {number} id id for the model for which to generate edit URL.
	 */
	const setBrowserURL = (id) => {
		window.history.replaceState({ id }, 'Checkout ' + id, getEditURL(id));
		setHistoryId(id);
	};

	const setCheckoutId = (id) => {
		if (id && id !== historyId) {
			setBrowserURL(id);
		}
	};

	const finalizeCheckout = async ({ id, customer_id }) => {
		return await apiFetch({
			method: 'PATCH',
			path: addQueryArgs(`surecart/v1/checkouts/${id}/finalize`, {
				manual_payment: true,
				skip_spam_check: true,
				customer_id: customer_id,
			}),
		});
	};

	const getErrors = (e) => {

		let errors = {
			message: __( 'Failed to create an order. Please check for below errors & try again.', 'surecart' ),
			additional_errors: []
		}
		const additionalErrors = e?.additional_errors;
		if (additionalErrors) {
			for (const error of additionalErrors) {
				let errorMessage = '';
				switch (error?.code) {
					case 'checkout.line_items.required':
						errorMessage = __( 'Please add at least one product.', 'surecart' );
						errors?.additional_errors?.push({message:errorMessage});
						break;
					case 'checkout.customer.blank':
						errorMessage = __( 'Please select a customer.', 'surecart' );
						errors?.additional_errors?.push({message:errorMessage});
						break;
					case 'checkout.shipping_address.invalid_shipping_address':
						errorMessage = __( 'Please add a valid address with necessary shipping information.', 'surecart' );
						errors?.additional_errors?.push({message:errorMessage});
						break;
					case 'checkout.shipping_address.invalid_tax_address':
						errorMessage = __( 'Please select a valid tax address.', 'surecart' );
						errors?.additional_errors?.push({message:errorMessage});
						break;
					default:
						break;
				}
			}
		}
		
		return errors;
	};

	/**
	 * Handle the form submission
	 */
	 const onSubmit = async () => {
		try {
			setIsSaving(true);
			const checkoutResult = await finalizeCheckout({
				id: checkout?.id,
				customer_id: customer?.id,
			});
			
			createSuccessNotice(__('Order Created.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			const errors = getErrors(e);
			console.log(errors);
			setCheckoutError(errors);
			setIsSaving(false);
		} finally {
			setIsSaving(false);
		}
	};
	
	const onAddressChange = async (address) => {
		try {
			setBusyCustomer(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}`, {
					expand: [
						// expand the checkout and the checkout's required expands.
						...(expand || []).map((item) => {
							return item.includes('.')
								? item
								: `checkout.${item}`;
						}),
						'checkout',
					],
				}),
				data: {
					customer_id: checkout?.customer_id,
					shipping_address: {
						...address,
					}, // update the address.
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

			createSuccessNotice(__('Shipping Address updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusyCustomer(false);
		}
	};

	return (
		<>
			<Error
				error={checkoutError}
				setError={setCheckoutError}
			/>
			<UpdateModel
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 1em;
						`}
					>
						<ScButton
							circle
							size="small"
							href="admin.php?page=sc-orders"
						>
							<sc-icon name="arrow-left"></sc-icon>
						</ScButton>
						<sc-breadcrumbs>
							<sc-breadcrumb>
								<Logo display="block" />
							</sc-breadcrumb>
							<sc-breadcrumb href="admin.php?page=sc-orders">
								{__('Orders', 'surecart')}
							</sc-breadcrumb>
							<sc-breadcrumb>
								<sc-flex style={{ gap: '1em' }}>
									{__('Create Order', 'surecart')}
								</sc-flex>
							</sc-breadcrumb>
						</sc-breadcrumbs>
					</div>
				}
				button={
					<ScForm onScSubmit={onSubmit}>
						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton
								type="primary"
								submit
								loading={isSaving}
							>
								{__('Create', 'surecart')}
							</ScButton>
						</div>
					</ScForm>
				}
				sidebar={
					<>
						<SelectCustomer
							checkout={checkout}
							busy={busy}
							loading={loading}
						/>
						{checkout?.customer_id && (
							<>
								<Address
									label={__(
										'Shipping & Tax Address',
										'surecart'
									)}
									address={checkout?.shipping_address}
									onAddressChange={onAddressChange}
									loading={loading}
									busy={busy}
									busyCustomer={busyCustomer}
								/>
							</>
						)}
					</>
				}
			>
				<Prices checkout={checkout} loading={loading} busy={busy} />

				{!!checkout?.line_items?.data?.length && (
					<Payment
						checkout={checkout}
						loading={loading}
						busy={busy}
					/>
				)}

				{!!checkoutIdLoading && <ScBlockUi spinner />}
			</UpdateModel>
		</>
	);
};
