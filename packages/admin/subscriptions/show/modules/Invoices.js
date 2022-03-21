import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { store } from '@checkout-engine/data';
import { addQueryArgs } from '@wordpress/url';
import { CeOrderStatusBadge } from '@checkout-engine/components-react';
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
								<ce-format-number
									type="currency"
									currency={invoice?.currency}
									value={invoice?.amount_due}
								></ce-format-number>
							),
							status: (
								<CeOrderStatusBadge
									status={invoice?.status}
								></CeOrderStatusBadge>
							),
							created: (
								<ce-format-date
									type="timestamp"
									date={invoice?.created_at}
									month="short"
									day="numeric"
									year="numeric"
								></ce-format-date>
							),
							number: invoice.number,
							actions: (
								<ce-button
									size="small"
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
