/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import {
	ScButton,
	ScFormatNumber,
	ScText,
	ScTag,
} from '@surecart/components-react';

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
						created_at_date,
						status_type,
						status_display_text,
						description,
						commission_amount,
						currency,
						checkout: { order } = {},
					}) => {
						return {
							status: (
								<ScTag type={status_type}>
									{status_display_text}
								</ScTag>
							),
							description: (
								<ScText truncate title={description}>
									{description || '-'}
								</ScText>
							),
							order: (
								<ScText truncate>
									{!!order?.id ? (
										<a
											href={addQueryArgs('admin.php', {
												page: 'sc-orders',
												action: 'edit',
												id: order?.id,
											})}
											css={css`
												text-decoration: none;
											`}
										>
											#{order?.number ?? order?.id}
										</a>
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
							date: created_at_date,
							view: (
								<ScButton
									href={addQueryArgs('admin.php', {
										page: 'sc-affiliate-referrals',
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
