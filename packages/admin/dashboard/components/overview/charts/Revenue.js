import { __ } from '@wordpress/i18n';
import { ScCard, ScDashboardModule } from '@surecart/components-react';
import ChartSummary from './ChartSummary';

export default (props) => {
	const { data, previousData, loading, className, ...rest } = props;

	const formatData = (item) => {
		return {
			y: item.amount,
			x: item.interval_at,
		};
	};

	const totals = (data, key) => {
		return data.reduce((sum, item) => sum + parseFloat(item[key]), 0);
	};

	return (
		<ScDashboardModule
			heading={__('Revenue', 'surecart')}
			className={className}
		>
			<ScCard
				style={{ '--sc-card-padding': 'var(--sc-spacing-x-large)' }}
			>
				<ChartSummary
					loading={loading}
					data={data.map(formatData)}
					previousData={previousData.map(formatData)}
					type="currency"
					total={totals(data, 'amount')}
					previousTotal={totals(previousData, 'amount')}
					{...rest}
				/>
			</ScCard>
		</ScDashboardModule>
	);
};
