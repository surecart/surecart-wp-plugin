/** @jsx jsx */
import { css, jsx } from '@emotion/core';


/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ClicksDataTable from '../../components/data-tables/ClicksDataTable';
import PrevNextButtons from '../../ui/PrevNextButtons';

export default ({ clicks, loading }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	// TODO: After Handle the Clicks API
	// Get the clicks data from the API by calling from here instead props.

	return (
		<ClicksDataTable
			title={__('Clicks', 'surecart')}
			columns={{
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
				url: {
					label: __('Landing Url', 'surecart'),
				},
				referrer: {
					label: __('Referrer', 'surecart'),
				},
			}}
			data={clicks?.data || []}
			isLoading={loading}
			isFetching={loading}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more clicks.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				<PrevNextButtons
					data={clicks?.data ?? []}
					page={page}
					setPage={setPage}
					perPage={perPage}
					loading={loading}
				/>
			}
		/>
	);
};
