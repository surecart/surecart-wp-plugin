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
	ScCouponForm,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';
import Payment from './Payment';

export default ({ checkout, loading, busy }) => {
	const line_items = checkout?.line_items?.data || [];
	const [busyPrices, setBusyPrices] = useState(false);

	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);

	const onRemove = async (id) => {
		try {
			setBusyPrices(true);

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
			setBusyPrices(false);
		}
	};

	const onQuantityChange = async (id, quantity) => {
		
		try {
			setBusyPrices(true);
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
					quantity, // update the quantity.
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
			setBusyPrices(false);
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
					<ScTableCell
						style={{ width: '20%', textAlign: 'center' }}
						slot="head"
					>
						<div>{__('Total', 'surecart')}</div>
					</ScTableCell>
					<ScTableCell
						style={{ width: '20%' }}
						slot="head"
					></ScTableCell>

					{(line_items || []).map((line_item) => {
						const { id, price, quantity, full_amount } = line_item;
						
						return (
							<Price
								key={id}
								price={price}
								quantity={quantity}
								full_amount={full_amount}
								onRemove={() => onRemove(id)}
								onQuantityChange={(quantity) =>
									onQuantityChange(id, quantity)
								}
							/>
						);
					})}
				</ScTable>
			</ScCard>
		);
	};

	return (
		<>
			<Box
				title={__('Add Prices', 'surecart')}
				loading={loading}
				footer={<NewPrice checkout={checkout} />}
			>
				{renderPrices()}

				{(!!busy || !!busyPrices ) && (
					<ScBlockUi spinner />
				)}
			</Box>
			{
				0 !== line_items?.length && (
					<Payment checkout={checkout} loading={loading} busy={busy} busyPrices={busyPrices} />
				)
			}
			
		</>
	);
};
