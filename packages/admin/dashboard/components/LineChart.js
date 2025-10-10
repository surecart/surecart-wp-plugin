import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { __ } from '@wordpress/i18n';
import { formatNumber } from '../../util';
import dayjs from 'dayjs';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip
);

export const options = (type) => ({
	responsive: true,
	maintainAspectRatio: false,
	elements: {
		line: {
			tension: 0.4,
		},
	},
	interaction: {
		mode: 'index',
		intersect: false,
	},
	plugins: {
		tooltip: {
			backgroundColor: 'white',
			titleColor: 'black',
			bodyColor: '#555',
			boxPadding: 5,
			padding: 15,
			borderWidth: 2,
			borderColor: 'rgba(0, 0, 0, 0.05)',
			callbacks: {
				label: function (context) {
					let label = context.dataset.label || '';
					if (label) {
						label += ': ';
					}
					const currency = window?.scData?.currency_code || 'usd';

					if (['amount', 'average_amount'].includes(type)) {
						// Format as currency
						label += formatNumber(context.parsed.y, currency);
					} else {
						// Format as number
						label += context.parsed.y.toLocaleString();
					}
					return label;
				},
			},
		},
	},
	scales: {
		y: {
			grace: '10%', // Add 10% grace area to the Y-axis
			border: {
				display: false, // Hide the left axis border
			},
			grid: {
				display: false, // Hides tick marks on the X-axis
			},
			ticks: {
				callback: function () {
					return '';
				},
			},
		},
		x: {
			title: {
				align: 'start',
			},
			border: {
				display: false, // Hide the bottom axis border line
				dash: [10, 10], // Make grid lines dashed
			},
			grid: {
				color: 'rgba(0, 0, 0, 0.1)',
				drawBorder: false, // Don't draw the border around the chart
			},
			ticks: {
				maxRotation: 0,
				minRotation: 0,
				// For a category axis, the val is the index so the lookup via getLabelForValue is needed
				callback: function (val, index, ticks) {
					// only show first and last tick label
					if (index === 0 || index === ticks.length - 1) {
						return this.getLabelForValue(val);
					}
					return '';
				},
			},
		},
	},
});

export default ({ data, previousData, type = 'amount' }) => {
	const labels = data.map((item) => {
		// Format unix timestamp to short date
		return dayjs.unix(item.interval_at).format('MMM D');
	});

	const datasets = [
		{
			label: __('Current', 'surecart'),
			data: data.map((item) => item[type]),
			borderColor: '#00824C',
			fill: true,
			fill: 'start',
			borderJoinStyle: 'round',
			backgroundColor: (ctx) => {
				const canvas = ctx.chart.ctx;
				const gradient = canvas.createLinearGradient(0, -160, 0, 120);

				gradient.addColorStop(0, '#00824cd9');
				gradient.addColorStop(1, '#16a34a00');

				return gradient;
			},
		},
		{
			label: __('Previous', 'surecart'),
			data: previousData.map((item) => item[type]),
			borderColor: '#00824c87',
			borderJoinStyle: 'round',
			borderDash: [10, 10],
		},
	];

	return <Line options={options(type)} data={{ labels, datasets }} />;
};
