/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { store } from '../store';
import { css, jsx } from '@emotion/core';
import useCustomerData from '../hooks/useCustomerData';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { CeButton } from '@checkout-engine/components-react';
import DataTable from '../../components/DataTable';

export default () => {
	const { customerId } = useCustomerData();

	const { orders, loading } = useSelect(
		(select) => {
			return {
				orders: select(store).selectOrders(),
				loading: select(store).isResolving('selectOrders'),
			};
		},
		[customerId]
	);

	const footer = <div>total</div>;

	return (
		<DataTable
			title={__('Orders', 'checkout_engine')}
			columns={{
				number: {
					label: __('Order Number', 'checkout_engine'),
				},
				items: {
					label: __('Items', 'checkout_engine'),
				},
				total: {
					label: __('Total', 'checkout_engine'),
				},
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				actions: {
					width: '100px',
				},
			}}
			items={(orders || []).map(
				({ number, id, line_items, total_amount, status }) => {
					return {
						number: (
							<ce-text
								truncate
								style={{
									'--font-weight':
										'var(--ce-font-weight-semibold)',
								}}
							>
								{number || id}
							</ce-text>
						),
						items: (
							<ce-text
								truncate
								style={{
									'--color': 'var(--ce-color-gray-500)',
								}}
							>
								{sprintf(
									_n(
										'%s item',
										'%s items',
										line_items?.pagination?.count || 0,
										'checkout_engine'
									),
									line_items?.pagination?.count || 0
								)}
							</ce-text>
						),
						total: (
							<ce-format-number
								type="currency"
								currency={'USD'}
								value={total_amount}
							></ce-format-number>
						),
						status: (
							<ce-session-status-badge
								status={status}
							></ce-session-status-badge>
						),
						actions: (
							<ce-button size="small">
								{__('View', 'checkout_engine')}
							</ce-button>
						),
					};
				}
			)}
			loading={loading}
			footer={footer}
		/>
	);
};
