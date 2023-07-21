/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Price from './Price';
import NewPrice from './NewPrice';
import {
	ScBlockUi,
	ScEmpty,
	ScTable,
	ScTableCell,
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
	const [busyPrices, setBusyPrices] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);

	const onRemove = async (id) => {
		try {
			setBusyPrices(true);

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
			setBusyPrices(false);
		}
	};

	const onChange = async (id, data) => {
		try {
			setBusyPrices(true);
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
					} = line_item;

					return (
						<Price
							key={id}
							price={price}
							fees={fees?.data || []}
							quantity={quantity}
							subtotal_amount={subtotal_amount}
							ad_hoc_amount={ad_hoc_amount}
							onRemove={() => onRemove(id)}
							onChange={(data) => onChange(id, data)}
							checkout={checkout}
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
				footer={<NewPrice checkout={checkout} />}
			>
				{renderPrices()}

				{(!!busy || !!busyPrices) && <ScBlockUi spinner />}
			</Box>
		</div>
	);
};
