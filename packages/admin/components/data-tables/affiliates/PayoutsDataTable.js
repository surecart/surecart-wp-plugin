/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import { ScFormatNumber, ScText } from '@surecart/components-react';
import { ScTag } from '@surecart/components-react';

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
						end_at_date,
						created_at_date,
					}) => {
						return {
							status: (
								<ScTag
									type={
										'completed' == status
											? 'success'
											: 'warning'
									}
								>
									{status_display_text}
								</ScTag>
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
							end_date: end_at_date,
							date: created_at_date,
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
