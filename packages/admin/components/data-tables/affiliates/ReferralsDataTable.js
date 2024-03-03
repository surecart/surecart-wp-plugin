/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import { ScFormatDate, ScFormatNumber, ScText } from '@surecart/components-react';
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
						created_at,
						status,
						description,
						commission_amount,
						currency,
					}) => {
						return {
							status: <StatusBadge status={status} />,
							description: (
								<ScText truncate>{description}</ScText>
							),
							// TODO: Order while API is ready.
							order: <ScText>-</ScText>,
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
