/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import PaginationFooter from '../PaginationFooter';
import licenseItem from './license-item';

export default ({
	data,
	isLoading,
	error,
	pagination,
	isFetching,
	columns,
	empty,
	page,
	setPage,
	...props
}) => {
	return (
		<DataTable
			title={__('Licenses', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((data) => licenseItem(data))}
			loading={isLoading}
			{...props}
		/>
	);
};
