/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import { ScFormatNumber } from '@surecart/components-react';
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
				.map(({ commission_amount, line_item, id }) => {
					return {
						key: id,
						purchase: <ProductLineItem lineItem={line_item} />,
						quantity: <span>{line_item?.quantity}</span>,
						commission_amount: (
							<ScFormatNumber
								type="currency"
								currency={line_item?.price?.currency}
								value={commission_amount}
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
