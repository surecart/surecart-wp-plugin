import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { store } from '@surecart/data';
import { addQueryArgs } from '@wordpress/url';
import { ScOrderStatusBadge } from '@surecart/components-react';
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

	if (!isLoading && !invoices?.length) {
		return null;
	}

	return (
		<div>
			<DataTable
				loading={isLoading}
				title={__('Invoices', 'surecart')}
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
							button_text={__('Load More', 'surecart')}
							onClick={() => setPage(page + 1)}
						/>
					</Flex>
				}
				columns={{
					amount: {
						label: __('Amount', 'surecart'),
					},
					status: {
						label: __('Status', 'surecart'),
					},
					created: {
						label: __('Created', 'surecart'),
					},
					number: {
						label: __('Number', 'surecart'),
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
								<sc-format-number
									type="currency"
									currency={invoice?.currency}
									value={invoice?.amount_due}
								></sc-format-number>
							),
							status: (
								<ScOrderStatusBadge
									status={invoice?.status}
								></ScOrderStatusBadge>
							),
							created: (
								<sc-format-date
									type="timestamp"
									date={invoice?.created_at}
									month="short"
									day="numeric"
									year="numeric"
								></sc-format-date>
							),
							number: invoice.number,
							actions: (
								<sc-button
									size="small"
									href={addQueryArgs('admin.php', {
										page: 'sc-invoices',
										action: 'edit',
										id: invoice?.id,
									})}
								>
									View
								</sc-button>
							),
						};
					})}
			/>
		</div>
	);
};
