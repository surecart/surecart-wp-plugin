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
import PrevNextButtons from '../../ui/PrevNextButtons';
import ReferralsDataTable from '../../components/data-tables/ReferralsDataTable';

export default ({ referrals, loading }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	// TODO: After Handle the Clicks API
	// Get the clicks data from the API by calling from here instead props.

	return (
		<ReferralsDataTable
			title={__('Referrals', 'surecart')}
			columns={{
				status: {
					label: __('Status', 'surecart'),
				},
				description: {
					label: __('Description', 'surecart'),
				},
				order: {
					label: __('Order', 'surecart'),
				},
				commission_amount: {
					label: __('Commission', 'surecart'),
				},
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
			}}
			data={referrals?.data || []}
			isLoading={loading}
			isFetching={loading}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more referrals.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				<PrevNextButtons
					data={referrals?.data ?? []}
					page={page}
					setPage={setPage}
					perPage={perPage}
					loading={loading}
				/>
			}
		/>
	);
};
