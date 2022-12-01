import {
	ScFormatDate,
	ScFormatNumber,
	ScTag,
	ScTooltip,
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
					per_page: 100,
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

	const renderRefundStatusBadge = (status) => {
		switch (status) {
			case 'pending':
				return (
					<ScTag type="warning">{__('Pending', 'surecart')}</ScTag>
				);
			case 'succeeded':
				return (
					<ScTag type="success">{__('Succeeded', 'surecart')}</ScTag>
				);
			case 'failed':
				return <ScTag type="danger">{__('Failed', 'surecart')}</ScTag>;
			case 'canceled':
				return (
					<ScTag type="danger">{__('Canceled', 'surecart')}</ScTag>
				);
		}
		return <ScTag>{status || __('Unknown', 'surecart')}</ScTag>;
	};

	// don't render anything if loading.
	if (loading || !refunds?.length) {
		return null;
	}

	return (
		<>
			<DataTable
				title={__('Refunds', 'surecart')}
				loading={loading}
				columns={{
					date: {
						label: __('Date', 'surecart'),
					},
					amount: {
						label: __('Amount Refunded', 'surecart'),
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
								-
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
								hour="numeric"
								minute="numeric"
								type="timestamp"
							/>
						),
						status: (
							<>
								<ScTooltip
									type="danger"
									text={
										refund?.failure_reason ===
										'insufficient_funds'
											? __(
													'Insufficient Funds',
													'surecart'
											  )
											: null
									}
								>
									{renderRefundStatusBadge(refund?.status)}
								</ScTooltip>
							</>
						),
					};
				})}
			/>
		</>
	);
};
