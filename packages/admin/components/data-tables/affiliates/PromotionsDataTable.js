/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import { ScText, ScTag, ScButton } from '@surecart/components-react';
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
			title={title || __('Promotion Codes', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map(
					({
						code,
						times_redeemed,
						max_redemptions,
						archived,
						coupon: { id, discount_amount },
					}) => {
						return {
							code: <ScText>{code}</ScText>,
							discount_amount: <ScText>{discount_amount}</ScText>,
							status: (
								<StatusBadge
									status={archived ? 'archived' : 'active'}
								/>
							),
							uses: (
								<ScTag>
									{times_redeemed}
									{max_redemptions
										? ` / ${max_redemptions}`
										: ''}{' '}
									{__('Uses', 'surecart')}
								</ScTag>
							),
							view: (
								<ScButton
									href={addQueryArgs(`admin.php`, {
										page: 'sc-coupons',
										action: 'edit',
										id,
									})}
									size="small"
								>
									{__('View Coupon', 'surecart')}
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
