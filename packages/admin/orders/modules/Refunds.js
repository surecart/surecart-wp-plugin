import { ScFormatDate, ScFormatNumber, ScTag } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, _n } from '@wordpress/i18n';
import { useState } from 'react';

import ChargesDataTable from '../../components/data-tables/charges-data-table';
import DataTable from '../../components/DataTable';

export default ({ chargeId }) => {
	// const [refundCharge, setRefundCharge] = useState(false);
	const { invalidateResolution } = useDispatch(coreStore);
	const { refunds, loading, invalidateCharges } = useSelect(
		(select) => {
			if (!chargeId) {
				return {
					refunds: [],
					loading: true,
				};
			}

			const entityData = [
				'surecart',
				'refund',
				{
					charge_ids: chargeId ? [chargeId] : null,
				},
			];

			return {
				refunds: select(coreStore)?.getEntityRecords?.(...entityData),
				invalidateCharges: () =>
					invalidateResolution('getEntityRecords', [...entityData]),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[chargeId]
	);

  console.log(refunds);

	// empty, don't render anything.
	if (!loading && !refunds?.length) {
		return null;
	}

	return (
		<>
      <DataTable
        title={__('Refund', 'surecart')}
        empty={__('None found.', 'surecart')}
        loading={loading}
        columns={{
					amount: {
						label: __('Amount', 'surecart'),
					},
					date: {
						label: __('Date', 'surecart'),
					},
					status: {
						label: __('Status', 'surecart'),
						width: '100px',
					},
				}}
        items={refunds?.map((refund) =>{
          return {
            amount: (
              <ScFormatNumber
                type="currency"
								currency={refund?.currency || 'usd'}
								value={refund?.amount}
              />
            ),
            date: (
              <ScFormatDate
                date={refund?.updated_at}
                month="long"
                day="numeric"
                year="numeric"
                type="timestamp"
              />
            ),
            status: (
              <ScTag
                type="warning"
              >{refund?.status}</ScTag>
            )
          }
        })}
      />
		</>
	);
};
