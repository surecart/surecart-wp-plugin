import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import Price from './Price';
import NewPrice from './NewPrice';
import {
	ScBlockUi,
	ScCard,
	ScEmpty,
	ScFlex,
	ScStackedList,
	ScStackedListRow,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScFormatNumber,
	ScLineItem,
	ScCouponForm
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';

export default ({ checkout, loading, busy }) => {

	const line_items = checkout?.line_items?.data || [];
	const [updatingQuantity, setUpdatingQuantity] = useState(false);
	const [updatingCoupon, setUpdatingCoupon] = useState(false);

	const [deleting, setDeleting] = useState(false);

	const { createErrorNotice, createSuccessNotice } = useDispatch(noticesStore);
	
	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);

	const onRemove = async (id) => {
		try {
			setDeleting(true);

			// delete the entity record.
			await deleteEntityRecord('surecart', 'line_item', id, null, {
				throwOnError: true,
			});

			// get the checkouts endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			// fetch the updated checkout.
			const data = await apiFetch({
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
				}),
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
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setDeleting(false);
		}
	};

	const onQuantityChange = async (e,id) => {

		try {
			setUpdatingQuantity(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);
			
			const { checkout: data } = await apiFetch({
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
				  quantity: e?.target?.value, // update the quantity.
				},
			});
			console.log(data);
			// // add the line item.
			// const { checkout: data } = await apiFetch({
			// 	method: 'PATCH',
			// 	path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
			// 		expand,
			// 		line_items: [
			// 			{
			// 				price: id,
			// 				quantity: e?.target?.value
			// 			}
			// 		]
			// 	})
			// });

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'checkout',
				data,
				undefined,
				false,
				checkout
			);

			createSuccessNotice(__('Quantity updated.', 'surecart'), {
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
			setUpdatingQuantity(false);
		}

	};

	const onCouponChange = async (e) => {
		
		try {
			setUpdatingCoupon(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);
			
			// add the line item.
			const { checkout: data } = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
					discount: [
						{
							promotion_code: e?.detail,
						}
					]
				})
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

			createSuccessNotice(__('Quantity updated.', 'surecart'), {
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
			setUpdatingCoupon(false);
		}

	};
	const renderPrices = () => {
		if (!line_items?.length) {
			return (
				<ScEmpty icon="shopping-bag">
					{__('Add some prices to this order.', 'surecart')}
				</ScEmpty>
			);
		}

		return (
			<ScCard noPadding>
				<ScTable>
					<ScTableCell style={{ width: '40%' }} slot="head">
						<div>{__('Product', 'surecart')}</div>
					</ScTableCell>
					<ScTableCell style={{ width: '20%' }} slot="head">
						<div>{__('Quantity', 'surecart')}</div>
					</ScTableCell>
					<ScTableCell style={{ width: '20%', textAlign: 'center' }} slot="head">
						<div>{__('Total', 'surecart')}</div>
					</ScTableCell>
					<ScTableCell style={{ width: '20%' }} slot="head">
					</ScTableCell>
							
					{(line_items || []).map(({ id, price }) => (
						<Price
							key={id}
							price={price}
							onRemove={() => onRemove(id)}
							onQuantityChange={(e) => onQuantityChange(e,id)}
						/>
					))}
				</ScTable>
			</ScCard>
		);
	};

	const renderPaymentDetails = () => {
		return (
			<>
			<ScLineItem>
					<span slot="description">{__('Subtotal', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						style={{
							fontWeight: 'var(--sc-font-weight-semibold)',
							color: 'var(--sc-color-gray-800)',
						}}
						type="currency"
						currency={checkout?.currency}
						value={checkout?.subtotal_amount}
					></ScFormatNumber>
				</ScLineItem>
				
				{/* <ScCouponForm
					collapsed={true}
					placeholder={__('Enter Coupon Code', 'surecart')}
					label={__('Add Coupon Code', 'surecart')}
					buttonText={__('Apply', 'surecart')}
					onScApplyCoupon={onCouponChange}	
				/> */}
			</>
		);
	};

	return (
		<>
			<Box
				title={__('Add Prices', 'surecart')}
				loading={loading|| !!busy || !!deleting || !!updatingQuantity}
				footer={<NewPrice checkout={checkout} />}
			>
				{renderPrices()}
			</Box>
			<Box
				title={__('Payment', 'surecart')}
				loading={loading|| !!busy || !!deleting || !!updatingQuantity || !!updatingCoupon}
			>
				{renderPaymentDetails()}
			</Box>
		</>
	);
};
