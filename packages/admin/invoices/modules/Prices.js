/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Price from './Price';
import NewPrice from './NewPrice';
import Box from '../../ui/Box';
import { useInvoice } from '../hooks/useInvoice';
import { ScEmpty, ScTable, ScTableCell } from '@surecart/components-react';

export default () => {
	const {
		checkout,
		loading,
		isDraftInvoice,
		removeLineItem,
		updateLineItem,
	} = useInvoice();
	const line_items = checkout?.line_items?.data || [];
	const [modal, setModal] = useState(false);

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
					'--sc-table-cell-vertical-align': 'top',
					borderLeft: '0',
					borderRight: '0',
				}}
			>
				<ScTableCell style={{ width: '45%' }} slot="head">
					<div>{__('Product', 'surecart')}</div>
				</ScTableCell>
				<ScTableCell style={{ width: '20%' }} slot="head">
					<div>{__('Price', 'surecart')}</div>
				</ScTableCell>
				<ScTableCell style={{ width: '15%' }} slot="head">
					<div>{__('Quantity', 'surecart')}</div>
				</ScTableCell>
				<ScTableCell style={{ width: '5%' }} slot="head">
					<div>{__('Total', 'surecart')}</div>
				</ScTableCell>
				<ScTableCell style={{ width: '5%' }} slot="head"></ScTableCell>

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
							onRemove={() => removeLineItem(id)}
							onChange={(data) => updateLineItem(id, data)}
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
