import { ScCard, ScDashboardModule } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

import ChartSummary from './ChartSummary';

export default (props) => {
	const { data, previousData, loading, className, reportBy, ...rest } = props;

	const formatData = (item) => {
		return {
			y: item.average_amount,
			x: item.interval_at,
		};
	};

	const totals = (data, key) => {
		return (
			data.reduce((sum, item) => sum + parseFloat(item[key]), 0) /
				data?.length || 1
		);
	};

	return (
		<ScDashboardModule
			heading={__('Average Order Value', 'surecart')}
			className={className}
		>
			<ScCard
				style={{ '--sc-card-padding': 'var(--sc-spacing-xx-large)' }}
			>
				<ChartSummary
					loading={loading}
					data={data.map(formatData)}
					previousData={previousData.map(formatData)}
					total={totals(data, 'average_amount')}
					previousTotal={totals(previousData, 'average_amount')}
					type="currency"
					reportBy={reportBy}
					{...rest}
				/>
			</ScCard>
		</ScDashboardModule>
	);
};
