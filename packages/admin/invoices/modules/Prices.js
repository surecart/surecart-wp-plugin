/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import expand from '../checkout-query';
import Price from './Price';
import NewPrice from './NewPrice';
import Box from '../../ui/Box';
import { checkoutExpands } from '../Invoice';
import { useInvoice } from '../hooks/useInvoice';
import { ScEmpty, ScTable, ScTableCell } from '@surecart/components-react';

export default () => {
	const {
		invoice,
		checkout,
		loading,
		isDraftInvoice,
		receiveInvoice,
		onRemovePrice,
		onChangePrice,
	} = useInvoice();

	const line_items = checkout?.line_items?.data || [];
	const [modal, setModal] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { deleteEntityRecord } = useDispatch(coreStore);

	// const onRemove = async (id) => {
	// 	try {
	// 		setBusy(true);

	// 		// delete the entity record.
	// 		await deleteEntityRecord('surecart', 'line_item', id, null, {
	// 			throwOnError: true,
	// 		});

	// 		// get the checkouts endpoint.
	// 		const { baseURL } = select(coreStore).getEntityConfig(
	// 			'surecart',
	// 			'draft-checkout'
	// 		);

	// 		// fetch the updated checkout.
	// 		const data = await apiFetch({
	// 			path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
	// 				expand,
	// 			}),
	// 		});

	// 		receiveInvoice({
	// 			...invoice,
	// 			checkout: data,
	// 		});
	// 	} catch (e) {
	// 		console.error(e);
	// 		createErrorNotice(e);
	// 	} finally {
	// 		setBusy(false);
	// 	}
	// };

	// const onChange = async (id, data) => {
	// 	try {
	// 		setBusy(true);
	// 		// get the line items endpoint.
	// 		const { baseURL } = select(coreStore).getEntityConfig(
	// 			'surecart',
	// 			'line_item'
	// 		);

	// 		const { checkout: updatedCheckout } = await apiFetch({
	// 			method: 'PATCH',
	// 			path: addQueryArgs(`${baseURL}/${id}`, {
	// 				expand: checkoutExpands,
	// 			}),
	// 			data,
	// 		});

	// 		receiveInvoice({
	// 			...invoice,
	// 			checkout: updatedCheckout,
	// 		});
	// 	} catch (e) {
	// 		console.error(e);
	// 		createErrorNotice(e);
	// 	} finally {
	// 		setBusy(false);
	// 	}
	// };

	const renderPrices = () => {
		if (!line_items?.length && isDraftInvoice) {
			return (
				<ScEmpty icon="shopping-bag">
					<p>
						{__('Add some products to this invoice.', 'surecart')}
					</p>
				</ScEmpty>
			);
		}

		return (
			<ScTable
				style={{
					'--shadow': 'none',
					'--border-radius': '0',
					borderLeft: '0',
					borderRight: '0',
				}}
			>
				<ScTableCell style={{ width: '40%' }} slot="head">
					<div>{__('Product', 'surecart')}</div>
				</ScTableCell>
				<ScTableCell style={{ width: '20%' }} slot="head">
					<div>{__('Quantity', 'surecart')}</div>
				</ScTableCell>
				<ScTableCell style={{ width: '20%' }} slot="head">
					<div>{__('Total', 'surecart')}</div>
				</ScTableCell>
				<ScTableCell style={{ width: '20%' }} slot="head"></ScTableCell>

				{(line_items || []).map((line_item) => {
					const {
						id,
						price,
						quantity,
						subtotal_amount,
						ad_hoc_amount,
						fees,
						variant_options,
					} = line_item;

					return (
						<Price
							key={id}
							price={price}
							lineItem={line_item}
							fees={fees?.data || []}
							quantity={quantity}
							subtotal_amount={subtotal_amount}
							ad_hoc_amount={ad_hoc_amount}
							onRemove={() => onRemovePrice(id)}
							onChange={(data) => onChangePrice(id, data)}
							checkout={checkout}
							variant_options={variant_options}
						/>
					);
				})}
			</ScTable>
		);
	};

	return (
		<div
			css={css`
				sc-table-cell:first-of-type {
					padding-left: 30px;
				}
				sc-table-cell:last-of-type {
					padding-right: 30px;
				}
				.components-card__body {
					padding: ${loading ? '24px' : '0 !important'};
				}
				--sc-table-cell-spacing: var(--sc-spacing-large);
			`}
		>
			<Box
				title={__('Products', 'surecart')}
				loading={loading}
				footer={
					!loading &&
					isDraftInvoice && (
						<NewPrice
							open={modal}
							onRequestClose={() => setModal(false)}
						/>
					)
				}
			>
				{renderPrices()}
			</Box>
		</div>
	);
};
