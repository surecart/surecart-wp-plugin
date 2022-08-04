/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { sprintf, __ } from '@wordpress/i18n';
import Chart from 'react-apexcharts';
import useChartSettings from './useChartSettings';
import { useEffect, useState } from 'react';

import {
	ScCard,
	ScDashboardModule,
	ScSkeleton,
	ScEmpty,
} from '@surecart/components-react';

export default (props) => {
	const {
		ordersStates,
		currentTotalOrder,
		lastTotalOrder,
		dateRangs,
		getDataArray,
		reportBy,
		errorMsg,
	} = props;
	const [currentAverage, setCurrentAverage] = useState(0);
	const [lastAverage, setLastAverage] = useState(0);
	const chart = useChartSettings({ dateRange: dateRangs, reportBy });
	const [series, setSeries] = useState([
		{
			name: __('Total Average', 'surecart'),
			data: [],
		},
	]);

	useEffect(() => {
		setSeries([
			{
				name: __('Total Average', 'surecart'),
				data: getDataArray,
			},
		]);

		if (currentTotalOrder.length !== 0) {
			setCurrentAverage(currentTotalOrder.average);
		} else {
			setCurrentAverage(0);
		}

		if (lastTotalOrder.length !== 0) {
			setLastAverage(lastTotalOrder.average);
		} else {
			setLastAverage(0);
		}
	}, [ordersStates, currentTotalOrder, lastTotalOrder]);

	function renderEmpty() {
		return (
			<ScCard
				css={css`
					.shopping-bag-empty {
						padding: 100px 0px;
					}
				`}
			>
				<slot name="empty">
					<ScEmpty className="shopping-bag-empty" icon="bar-chart-2">
						{errorMsg}
					</ScEmpty>
				</slot>
			</ScCard>
		);
	}

	function renderLoading() {
		return (
			<ScCard
				css={css`
					height: 360px;
				`}
			>
				{[...Array(3)].map(() => (
					<ScSkeleton
						style={{
							margin: '50px 2% 0px 2%',
							'padding-bottom': '43px',
							width: '96%',
							display: 'inline-block',
						}}
					></ScSkeleton>
				))}
			</ScCard>
		);
	}

	function orderChart() {
		if (ordersStates === 0 || currentTotalOrder === 0) {
			return renderLoading();
		}

		if (ordersStates === 1) {
			return renderEmpty();
		}

		return (
			<ScCard>
				<div className="sc-overview-card__title">
					${currentAverage}{' '}
					<span style={{ color: '#64748B', 'font-size': '14px' }}>
						{sprintf(
							__('vs $%s last period', 'surecart'),
							lastAverage
						)}
					</span>
				</div>
				<div id="chart">
					<Chart
						options={chart.options}
						series={series}
						type="area"
						height={295}
					/>
				</div>
			</ScCard>
		);
	}

	return (
		<ScDashboardModule
			css={css`
				width: 33%;

				.sc-overview-card__title {
					font-size: 16px;
				}
				@media screen and (max-width: 782px) {
					width: 100%;
				}
			`}
		>
			<span slot="heading">{__('Average Order Value', 'surecart')}</span>
			{orderChart()}
		</ScDashboardModule>
	);
};
