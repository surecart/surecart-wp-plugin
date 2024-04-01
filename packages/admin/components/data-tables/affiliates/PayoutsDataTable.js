/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import {
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
			title={title || __('Payouts', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map(
					({
						status,
						status_display_text,
						payout_email,
						total_commission_amount,
						currency,
						end_date,
						created_at,
					}) => {
						return {
							status: (
								<sc-tag
									type={
										'completed' == status
											? 'success'
											: 'warning'
									}
								>
									{status_display_text}
								</sc-tag>
							),
							total_commission_amount: (
								<ScFormatNumber
									type="currency"
									currency={currency}
									value={total_commission_amount}
								></ScFormatNumber>
							),
							payout_email: (
								<ScText truncate>{payout_email}</ScText>
							),
							end_date: (
								<ScFormatDate
									month="short"
									day="numeric"
									year="numeric"
									date={end_date}
								/>
							),
							date: (
								<ScFormatDate
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
									date={created_at}
								/>
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
