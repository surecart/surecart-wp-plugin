/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import {
	ScButton,
	ScFormatDate,
	ScFormatNumber,
	ScText,
} from '@surecart/components-react';
import StatusBadge from '../../StatusBadge';

export default ({
	data,
	isLoading,
	title,
	error,
	isFetching,
	page,
	setPage,
	pagination,
	columns,
	footer,
	empty,
	...props
}) => {
	return (
		<DataTable
			title={title || __('Referrals', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map(
					({
						id,
						created_at,
						status,
						description,
						commission_amount,
						currency,
						checkout: { order },
					}) => {
						return {
							status: <StatusBadge status={status} />,
							description: (
								<ScText truncate>{description}</ScText>
							),
							order: (
								<ScText truncate>
									{!!order?.id ? (
										<ScButton
											href={addQueryArgs('admin.php', {
												page: 'sc-orders',
												action: 'edit',
												id: order?.id,
											})}
											size="small"
											type="link"
										>
											#{order?.number ?? order?.id}
										</ScButton>
									) : (
										'-'
									)}
								</ScText>
							),
							commission_amount: (
								<ScFormatNumber
									type="currency"
									currency={currency}
									value={commission_amount}
								></ScFormatNumber>
							),
							date: (
								<ScFormatDate
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
									date={created_at}
								></ScFormatDate>
							),
							view: (
								<ScButton
									href={addQueryArgs('admin.php', {
										page: 'sc-referrals',
										action: 'edit',
										id,
									})}
									size="small"
								>
									{__('View', 'surecart')}
								</ScButton>
							),
						};
					}
				)}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
