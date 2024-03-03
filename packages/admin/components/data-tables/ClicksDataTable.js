/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import DataTable from '../DataTable';
import { ScFormatDate, ScText } from '@surecart/components-react';

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
			title={title || __('Clicks', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map(({ created_at, url, referrer }) => {
					return {
						url: <ScText truncate>{url}</ScText>,

						// TODO: Add referrer while API is ready.
						referrer: <ScText truncate>{referrer}</ScText>,

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
				})}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
