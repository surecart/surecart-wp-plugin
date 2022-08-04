import { __ } from '@wordpress/i18n';
import { ScCard, ScDashboardModule } from '@surecart/components-react';
import ChartSummary from './ChartSummary';

export default (props) => {
	const { data, previousData, loading, className, ...rest } = props;

	const formatData = (item) => {
		return {
			y: item.count,
			x: item.interval_at,
		};
	};

	const totals = (data, key) => {
		return data.reduce((sum, item) => sum + parseInt(item[key]), 0);
	};

	return (
		<ScDashboardModule
			heading={__('Orders', 'surecart')}
			className={className}
		>
			<ScCard
				style={{ '--sc-card-padding': 'var(--sc-spacing-xx-large)' }}
			>
				<ChartSummary
					loading={loading}
					data={data.map(formatData)}
					previousData={previousData.map(formatData)}
					total={totals(data, 'count')}
					previousTotal={totals(previousData, 'count')}
					{...rest}
				/>
			</ScCard>
		</ScDashboardModule>
	);
};
