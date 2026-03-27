/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Price from './Price';
import NewPrice from './NewPrice';
import { ScEmpty, ScTable, ScTableCell } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

export default ({ checkout, loading, setBusy }) => {
	const line_items = checkout?.line_items?.data || [];
	const [modal, setModal] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);

	const onRemove = async (id) => {
		try {
			setBusy(true);

			// delete the entity record.
			await deleteEntityRecord('surecart', 'line_item', id, null, {
				throwOnError: true,
			});

			// get the draft checkouts endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			// fetch the updated checkout.
			const data = await apiFetch({
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
					context: 'edit',
				}),
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
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
			setBusy(false);
		}
	};

	const onChange = async (id, data) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			const { checkout } = await apiFetch({
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
					context: 'edit',
				}),
				data,
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				checkout,
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
			setBusy(false);
		}
	};

	const renderPrices = () => {
		if (!line_items?.length) {
			return (
				<ScEmpty icon="shopping-bag">
					<p>{__('Add some products to this order.', 'surecart')}</p>
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
							onRemove={() => onRemove(id)}
							onChange={(data) => onChange(id, data)}
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
					!loading && (
						<NewPrice
							checkout={checkout}
							open={modal}
							setBusy={setBusy}
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
