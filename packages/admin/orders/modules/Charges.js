import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, _n } from '@wordpress/i18n';
import { useState } from 'react';

import ChargesDataTable from '../../components/data-tables/charges-data-table';
import Refund from './Refund';

export default ({ checkoutId, purchases, refunds, refundsLoading }) => {
	const [refundCharge, setRefundCharge] = useState(false);
	const { invalidateResolution } = useDispatch(coreStore);
	const { charges, loading, invalidateCharges } = useSelect(
		(select) => {
			if (!checkoutId) {
				return {
					charges: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'charge',
				{
					checkout_ids: checkoutId ? [checkoutId] : null,
					expand: [
						'payment_method',
						'payment_method.card',
						'payment_method.payment_instrument',
						'payment_method.paypal_account',
						'payment_method.bank_account',
					],
				},
			];
			return {
				charges: select(coreStore)?.getEntityRecords?.(...entityData),
				invalidateCharges: () =>
					invalidateResolution('getEntityRecords', [...entityData]),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[checkoutId]
	);

	const onRefunded = () => {
		invalidateCharges();
		setRefundCharge(false);
	};

	// empty, don't render anything.
	if (!loading && !charges?.length) {
		return null;
	}

	return (
		<>
			<ChargesDataTable
				title={__('Charge', 'surecart')}
				columns={{
					amount: {
						label: __('Amount', 'surecart'),
					},
					date: {
						label: __('Date', 'surecart'),
					},
					method: {
						label: __('Method', 'surecart'),
						width: '200px',
					},
					status: {
						label: __('Status', 'surecart'),
						width: '100px',
					},
					refund: {
						width: '100px',
					},
				}}
				showTotal
				onRefundClick={setRefundCharge}
				data={charges}
				isLoading={loading}
			/>
			{!!refundCharge && (
				<Refund
					charge={refundCharge}
					purchases={purchases}
					onRefunded={onRefunded}
					onRequestClose={() => setRefundCharge(false)}
					refunds={refunds}
					refundsLoading={refundsLoading}
				/>
			)}
		</>
	);
};
