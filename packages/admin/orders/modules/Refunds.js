import {
	ScFormatDate,
	ScFormatNumber,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __, _n } from '@wordpress/i18n';
import DataTable from '../../components/DataTable';

export default ({ chargeId }) => {
	const { refunds, loading } = useSelect(
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
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[chargeId]
	);

	// don't render anything if loading.
	if (loading || !refunds?.length) {
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
				items={refunds?.map((refund) => {
					return {
						amount: (
							<sc-text
								style={{
									'--font-weight':
										'var(--sc-font-weight-bold)',
								}}
							>
								<ScFormatNumber
									type="currency"
									currency={refund?.currency || 'usd'}
									value={refund?.amount}
								/>
							</sc-text>
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
						status: <ScTag type="warning">{refund?.status}</ScTag>,
					};
				})}
			/>
		</>
	);
};
