import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { store } from '@checkout-engine/data';
import { addQueryArgs } from '@wordpress/url';
import { CeInvoiceStatusBadge } from '@checkout-engine/components-react';
import useEntities from '../../../mixins/useEntities';
import { Flex } from '@wordpress/components';
import InfinitePaginationButton from '@admin/ui/InfinitePaginationButton';
import { useEffect, useState } from 'react';

export default ({ subscriptionId }) => {
	const [page, setPage] = useState(1);
	const { invoices, fetchInvoices, pagination, isLoading, isFetching } =
		useEntities('invoice');

	useEffect(() => {
		if (subscriptionId) {
			fetchInvoices({
				query: {
					context: 'edit',
					subscription_ids: [subscriptionId],
					expand: ['charge'],
					page,
					per_page: 10,
				},
			});
		}
	}, [subscriptionId, page]);

	const getCustomer = (invoice) => {
		const customer = select(store).selectRelation(
			'invoice',
			invoice?.id,
			'customer'
		);
		return customer?.name || customer?.email;
	};

	return (
		<div>
			<DataTable
				loading={isLoading}
				title={__('Invoices', 'checkout_engine')}
				footer={
					<Flex justify="space-between">
						<div>
							Showing <strong>{invoices?.length}</strong> of{' '}
							<strong>{pagination?.total}</strong> total
						</div>
						<InfinitePaginationButton
							page={page}
							totalPages={pagination?.total_pages}
							loading={isFetching}
							button_text={__('Load More', 'checkout_engine')}
							onClick={() => setPage(page + 1)}
						/>
					</Flex>
				}
				columns={{
					amount: {
						label: __('Amount', 'checkout_engine'),
					},
					status: {
						label: __('Status', 'checkout_engine'),
					},
					created: {
						label: __('Created', 'checkout_engine'),
					},
					number: {
						label: __('Invoice Number', 'checkout_engine'),
					},
					customer: {
						label: __('Customer', 'checkout_engine'),
					},
					actions: {
						width: '100px',
					},
				}}
				items={(invoices || [])
					.slice()
					.sort((a, b) => b.created_at - a.created_at)
					.map((invoice) => {
						return {
							amount: (
								<ce-format-number
									type="currency"
									currency={invoice?.currency}
									value={invoice?.amount_due}
								></ce-format-number>
							),
							status: (
								<CeInvoiceStatusBadge
									invoice={invoice}
								></CeInvoiceStatusBadge>
							),
							created: (
								<ce-format-date
									type="timestamp"
									date={invoice?.created_at}
									month="long"
									day="numeric"
									year="numeric"
								></ce-format-date>
							),
							number: invoice.number,
							customer: getCustomer(invoice),
							actions: (
								<ce-button
									size="small"
									disabled
									href={addQueryArgs('admin.php', {
										page: 'ce-invoices',
										action: 'edit',
										id: invoice?.id,
									})}
								>
									View
								</ce-button>
							),
						};
					})}
			/>
		</div>
	);
};
