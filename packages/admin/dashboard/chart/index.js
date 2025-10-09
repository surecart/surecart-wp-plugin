/** @jsx jsx */
import { css, jsx } from '@emotion/core';
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
import {
	ScButton,
	ScIcon,
	ScSelect,
	ScSwitch,
} from '@surecart/components-react';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip
);

export const options = {
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
};

const labels = [
	['Sept 1', '2025'],
	['February 1', '2025'],
	['March 1', '2025'],
	['April 1', '2025'],
	['September', '2025'],
	['October', '2025'],
	['November', '2025'],
	['December', '2025'],
	['August 1', '2025'],
	['September 1', '2025'],
	['October 1', '2025'],
	['November 1', '2025'],
	['December 1', '2025'],
];

export const data = {
	labels,
	datasets: [
		{
			label: '2025',
			data: [100, 200, 150, 220, 250, 300, 175, 200, 150, 220, 250, 300],
			borderColor: '#00824C',
			fill: true,
			fill: 'start',
			backgroundColor: (ctx) => {
				const canvas = ctx.chart.ctx;
				const gradient = canvas.createLinearGradient(0, -160, 0, 120);

				gradient.addColorStop(0, '#00824cd9');
				gradient.addColorStop(1, '#16a34a00');

				return gradient;
			},
		},
		{
			label: '2024',
			data: [
				150, 210, 100, 200, 225, 250, 150, 210, 100, 200, 225, 250, 100,
			],
			borderColor: '#00824c87',
			borderDash: [10, 10],
		},
	],
};

const Tab = ({ title, value, previous, trend = 'up', selected }) => {
	const isUp = trend === 'up';

	return (
		<div
			css={css`
				background: ${selected
					? 'var(--sc-color-gray-100)'
					: 'transparent'};
				padding: 16px;
				border-radius: 10px;
				flex: 1;
				cursor: pointer;
				transition: background 0.2s ease;

				&:hover {
					background: var(--sc-color-gray-100);
				}
			`}
		>
			<div
				css={css`
					color: var(--sc-color-gray-600);
					margin-bottom: 8px;
				`}
			>
				{title}
			</div>
			<div
				css={css`
					font-size: 18px;
					font-weight: 600;
					color: var(--sc-color-gray-900);
					display: flex;
					align-items: center;
					gap: 6px;
					margin-bottom: 4px;
				`}
			>
				{value}
				<ScIcon
					name={isUp ? 'arrow-up-right' : 'arrow-down-right'}
					css={css`
						color: ${isUp
							? '#16A34A'
							: 'var(--sc-color-danger-500)'};
						font-size: 18px;
					`}
				/>
			</div>
			<div
				css={css`
					font-size: 12px;
					color: var(--sc-color-gray-500);
				`}
			>
				vs. {previous} last period
			</div>
		</div>
	);
};

export default () => {
	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: 20px;
			`}
		>
			<div
				css={css`
					display: flex;
					justify-content: space-between;
					align-items: center;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 10px;
					`}
				>
					<ScSelect
						value="daily"
						css={css`
							&::part(panel) {
								width: 150px;
							}
						`}
						choices={[
							{ label: 'Daily', value: 'daily' },
							{ label: 'Weekly', value: 'weekly' },
							{ label: 'Monthly', value: 'monthly' },
							{ label: 'Yearly', value: 'yearly' },
						]}
					/>
					<ScSwitch>Test mode</ScSwitch>
				</div>
				<ScButton>
					<ScIcon name="bar-chart-2" slot="prefix" />
					All Reports
					<ScIcon name="arrow-up-right" slot="suffix" />
				</ScButton>
			</div>
			<div
				css={css`
					background-color: rgb(255, 255, 255);
					color: rgb(30, 30, 30);
					position: relative;
					box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;
					outline: none;
					border-radius: var(
						--sc-card-border-radius,
						var(--sc-border-radius-x-large)
					);
					display: flex;
					flex-direction: column;
					gap: 20px;
					padding: var(--sc-spacing-small);
				`}
			>
				<div
					css={css`
						display: flex;
						justify-content: stretch;
						align-items: stretch;
						gap: 10px;
					`}
				>
					<Tab
						title="Revenue"
						value="$1,234.00"
						previous="$978.00"
						trend="up"
						selected
					/>
					<Tab title="Orders" value="567" previous="456" trend="up" />
					<Tab
						title="Average Order Value"
						value="$19.00"
						previous="$22.00"
						trend="down"
					/>
				</div>
				<div
					css={css`
						aspect-ratio: 3.75/1;
						width: 100%;
					`}
				>
					<Line options={options} data={data} />
				</div>
			</div>
		</div>
	);
};
