/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
dayjs.extend(duration);
dayjs.extend(utc);
import {
	ScButton,
	ScIcon,
	ScSelect,
	ScSwitch,
} from '@surecart/components-react';
import DatePicker from '../components/DatePicker';
import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import LineChart from '../components/LineChart';
import { formatNumber } from '../../util';
import { __ } from '@wordpress/i18n';
import { ProgressBar } from '@wordpress/components';
import Tab from './Tab';
import { calculateSum, calculateAverage, calculateTrend } from './utils';

export default () => {
	const [startDate, setStartDate] = useState(dayjs().add(-1, 'month'));
	const [endDate, setEndDate] = useState(dayjs());
	const [reportBy, setReportBy] = useState('day');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [previousData, setPreviousData] = useState([]);
	const [liveMode, setLiveMode] = useState(false);
	const currency = 'usd';
	const [tab, setTab] = useState('amount');

	useEffect(() => {
		let diffDays = endDate.diff(startDate, 'day');

		if (diffDays < 366 && 'year' === reportBy) {
			setStartDate(dayjs(startDate).subtract(1, 'year'));
		} else if (diffDays < 32 && 'month' === reportBy) {
			setStartDate(dayjs(startDate).subtract(2, 'month'));
		} else if (diffDays > 200 && 'day' === reportBy) {
			setStartDate(dayjs(endDate).subtract(199, 'day'));
		} else {
			getOrderStats(startDate.format(), endDate.format());
			getPreviousOrderStats(
				dayjs(startDate).subtract(diffDays, 'day').format(),
				startDate.format()
			);
		}
	}, [startDate, endDate, reportBy, liveMode]);

	/**
	 * Get order stats for the range.
	 */
	const getOrderStats = async (startAt, endAt) => {
		try {
			// setError(false);
			setLoading(true);
			const { data } = await apiFetch({
				path: addQueryArgs(`surecart/v1/stats/orders/`, {
					start_at: startAt,
					end_at: endAt,
					interval: reportBy,
					live_mode: liveMode,
					currency,
				}),
			});
			setData(data);
		} catch (e) {
			console.error(e);
			// setError(e);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Get order stats for the previous range
	 */
	const getPreviousOrderStats = async (startAt, endAt) => {
		try {
			// setError(false);
			setLoading(true);
			const { data } = await apiFetch({
				path: addQueryArgs(`surecart/v1/stats/orders/`, {
					start_at: startAt,
					end_at: endAt,
					live_mode: liveMode,
					interval: reportBy,
				}),
			});
			setPreviousData(data);
		} catch (e) {
			console.error(e);
			// setError(e);
		} finally {
			setLoading(false);
		}
	};

	// Calculate current period stats
	const currentAmountTotal = calculateSum(data, 'amount');
	const currentCountTotal = calculateSum(data, 'count');
	const currentAverageAmount = calculateAverage(data, 'average_amount');

	// Calculate previous period stats
	const previousAmountTotal = calculateSum(previousData, 'amount');
	const previousCountTotal = calculateSum(previousData, 'count');
	const previousAverageAmount = calculateAverage(
		previousData,
		'average_amount'
	);

	// Calculate trends
	const amountTrend = calculateTrend(currentAmountTotal, previousAmountTotal);
	const countTrend = calculateTrend(currentCountTotal, previousCountTotal);
	const averageTrend = calculateTrend(
		currentAverageAmount,
		previousAverageAmount
	);

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
					flex-wrap: wrap;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 10px;
						flex-wrap: wrap;
					`}
				>
					<DatePicker
						startDate={startDate}
						endDate={endDate}
						setStartDate={(date) => setStartDate(dayjs(date))}
						setEndDate={(date) => setEndDate(dayjs(date))}
					/>
					<ScSelect
						value={reportBy}
						css={css`
							&::part(panel) {
								width: 150px;
							}
						`}
						choices={[
							{ label: __('Daily', 'surecart'), value: 'day' },
							{ label: __('Weekly', 'surecart'), value: 'week' },
							{
								label: __('Monthly', 'surecart'),
								value: 'month',
							},
							{ label: __('Yearly', 'surecart'), value: 'year' },
						]}
						onScChange={(e) => {
							setReportBy(e.target.value);
						}}
					/>
					<ScSwitch
						checked={!liveMode}
						onScChange={(e) => {
							setLiveMode(!e.target.checked);
						}}
					>
						{__('Test mode', 'surecart')}
					</ScSwitch>
				</div>
				<ScButton
					href={`${scData?.surecart_app_url}?switch_account_id=${scData?.account_id}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<ScIcon name="bar-chart-2" slot="prefix" />
					{__('All Reports', 'surecart')}
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
						flex-direction: column;
						gap: 8px;

						@media (min-width: 640px) {
							flex-direction: row;
							gap: 10px;
						}
					`}
				>
					<Tab
						title={__('Revenue', 'surecart')}
						value={formatNumber(currentAmountTotal, currency)}
						previous={formatNumber(previousAmountTotal, currency)}
						trend={amountTrend}
						selected={tab === 'amount'}
						onClick={() => setTab('amount')}
					/>
					<Tab
						title={__('Orders', 'surecart')}
						value={currentCountTotal.toLocaleString()}
						previous={previousCountTotal.toLocaleString()}
						trend={countTrend}
						selected={tab === 'count'}
						onClick={() => {
							console.log('count');
							setTab('count');
						}}
					/>
					<Tab
						title={__('Average Order Value', 'surecart')}
						value={formatNumber(currentAverageAmount, currency)}
						previous={formatNumber(previousAverageAmount, currency)}
						trend={averageTrend}
						selected={tab === 'average_amount'}
						onClick={() => setTab('average_amount')}
					/>
				</div>
				<div
					css={css`
						aspect-ratio: 3.75/1;
						width: 100%;
						position: relative;
					`}
				>
					<LineChart
						data={data}
						previousData={previousData}
						type={tab}
					/>
					{loading && (
						<div
							css={css`
								position: absolute;
								bottom: 0;
								left: 0;
								right: 0;
								display: flex;
								justify-content: center;
								align-items: center;
								height: 100%;
								background: white;
							`}
						>
							<ProgressBar />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
