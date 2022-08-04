/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScBlockUi } from '@surecart/components-react';
import Chart from 'react-apexcharts';
import { getFormattedPrice } from '../../../../util';

export default ({
	loading,
	data,
	total,
	currency,
	previousTotal,
	className,
	type = 'number',
}) => {
	if (loading) {
		return (
			<div
				css={css`
					height: 295px;
				`}
			>
				<ScBlockUi spinner />
			</div>
		);
	}

	const formatYAxis = (value) => {
		if (type === 'currency') {
			return getFormattedPrice({
				amount: parseInt(value || 0),
				currency,
			});
		}
		return value;
	};

	return (
		<>
			{total !== null && (
				<div
					css={css`
						font-size: 16px;
					`}
				>
					{type === 'currency'
						? getFormattedPrice({
								amount: parseInt(total || 0),
								currency,
						  })
						: total}{' '}
					{previousTotal !== null && (
						<span style={{ color: '#64748B', 'font-size': '14px' }}>
							{sprintf(
								__('vs %s last period', 'surecart'),
								type === 'currency'
									? getFormattedPrice({
											amount: parseInt(
												previousTotal || 0
											),
											currency,
									  })
									: previousTotal
							)}
						</span>
					)}
				</div>
			)}
			<Chart
				style={{ minHeight: '295px' }}
				className={className}
				options={{
					chart: {
						toolbar: {
							show: false,
						},
						width: '100%',
						type: 'area',
						events: {
							mounted: (chart) => {
								chart.windowResizeHandler();
							},
						},
					},
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: 'smooth',
					},
					yaxis: {
						labels: {
							formatter: formatYAxis,
						},
					},
					xaxis: {
						type: 'date',
						labels: {
							formatter: function (value) {
								if (isNaN(value)) return 0;
								return new Intl.DateTimeFormat('default', {
									day: 'numeric',
									month: 'short',
								}).format(value * 1000);
							},
						},
					},
					colors: ['#08BA4F', '#999999'],
					tooltip: {
						x: {
							format: 'dd/MM/yy HH:mm',
						},
					},
					fill: {
						type: 'gradient',
						gradient: {
							shadeIntensity: 1,
							opacityFrom: 0.7,
							opacityTo: 0.9,
							stops: [0, 90, 100],
						},
					},
				}}
				series={[
					{
						name: 'Current',
						data,
					},
				]}
				type="area"
				height={295}
			/>
		</>
	);
};
