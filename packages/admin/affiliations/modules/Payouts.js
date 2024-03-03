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
import PayoutsDataTable from '../../components/data-tables/affiliates/PayoutsDataTable';

export default ({ payouts, loading }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	// TODO: After Handle the Payouts API
	// Get the clicks data from the API by calling from here instead props.

	return (
		<PayoutsDataTable
			title={__('Payouts', 'surecart')}
			columns={{
				status: {
					label: __('Status', 'surecart'),
				},
				payout_email: {
					label: __('Payout Email', 'surecart'),
				},
				total_commission_amount: {
					label: __('Commission', 'surecart'),
				},
				end_date: {
					label: __('Period End', 'surecart'),
					width: '100px',
				},
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
			}}
			data={payouts?.data || []}
			isLoading={loading}
			isFetching={loading}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more payouts.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				<PrevNextButtons
					data={payouts?.data ?? []}
					page={page}
					setPage={setPage}
					perPage={perPage}
					loading={loading}
				/>
			}
		/>
	);
};
