import {
	ScFormatDate,
	ScFormatNumber,
	ScSpacing,
	ScText,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import DataTable from '../../components/DataTable';

export default ({ failures, loading }) => {
	if (!failures?.data?.length) {
		return null;
	}

	return (
		<DataTable
			title={__('Payment Failures', 'surecart')}
			loading={loading}
			columns={{
				amount: {
					label: __('Amount', 'surecart'),
					width: '100px',
				},
				message: {
					label: __('Reason', 'surecart'),
				},
				created: {
					label: __('Attempt', 'surecart'),
					width: '150px',
				},
			}}
			items={(failures?.data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((failure) => {
					const {
						currency,
						amount,
						created_at,
						error_type,
						error_message,
					} = failure;
					return {
						amount: (
							<ScText
								style={{
									'--font-weight':
										'var(--sc-font-weight-bold)',
								}}
							>
								<ScFormatNumber
									type="currency"
									currency={currency}
									value={amount}
								/>
							</ScText>
						),
						created: (
							<div>
								<ScFormatDate
									type="timestamp"
									date={created_at}
									month="short"
									day="numeric"
									year="numeric"
								></ScFormatDate>
								<br />
								<div
									style={{
										color: 'var(--sc-color-gray-600)',
									}}
								>
									<ScFormatDate
										date={created_at}
										hour="numeric"
										minute="numeric"
										type="timestamp"
									/>
								</div>
							</div>
						),
						message: (
							<ScSpacing style={{ '--spacing': '0.5em' }}>
								<div>
									<sc-tag type="danger" size="small">
										{error_type}
									</sc-tag>
								</div>
								<ScText
									style={{
										'--color': 'var(--sc-color-gray-600)',
									}}
								>
									{error_message}
								</ScText>
							</ScSpacing>
						),
					};
				})}
		></DataTable>
	);
};
