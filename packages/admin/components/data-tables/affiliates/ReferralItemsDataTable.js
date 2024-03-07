/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import { ScFormatDate, ScFormatNumber } from '@surecart/components-react';
import ProductLineItem from '../../../ui/ProductLineItem';

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
			title={title || __('Referral Items', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map(({ created_at, commission_amount, line_item }) => {
					return {
						purchase: (
							<ProductLineItem lineItem={line_item}>
								<span>
									{__('Qty:', 'surecart')} {quantity}
								</span>
							</ProductLineItem>
						),
						commission_amount: (
							<ScFormatNumber
								type="currency"
								currency={line_item?.price?.currency}
								value={commission_amount}
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
				})}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
