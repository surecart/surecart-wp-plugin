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
import {
	calculateSum,
	calculateAverage,
	calculateTrend,
	getValidReportByOptions,
	getOptimalReportBy,
} from './utils';

export default ({ liveMode, setLiveMode }) => {
	const [startDate, setStartDate] = useState(dayjs().add(-1, 'month'));
	const [endDate, setEndDate] = useState(dayjs());
	const [reportBy, setReportBy] = useState('day');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [previousData, setPreviousData] = useState([]);
	const currency = window?.scData?.currency_code ?? 'usd';
	const [tab, setTab] = useState('amount');
	const [validReportByOptions, setValidReportByOptions] = useState({
		hour: true,
		day: true,
		week: true,
		month: true,
		year: true,
	});

	useEffect(() => {
		// Calculate valid reportBy options based on date range (max 100 data points)
		const validOptions = getValidReportByOptions(startDate, endDate, 100);
		setValidReportByOptions(validOptions);

		// If current reportBy would exceed max data points, auto-adjust to optimal interval
		if (!validOptions[reportBy]) {
			const optimalInterval = getOptimalReportBy(startDate, endDate, 100);
			setReportBy(optimalInterval);
			return; // Exit early, will re-trigger with new reportBy
		}

		// Fetch data for current and previous periods
		// Calculate the time difference in milliseconds to get exact previous period
		const diffMs = endDate.diff(startDate, 'millisecond');
		const previousStart = dayjs(startDate).subtract(diffMs, 'millisecond');

		getOrderStats(startDate.format(), endDate.format());
		getPreviousOrderStats(previousStart.format(), startDate.format());
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

	// Tab navigation

	const handleTabKeyDown = (e, tab) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setTab(tab);
		}
	};

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
							{
								label: __('Hourly', 'surecart'),
								value: 'hour',
							},
							{
								label: __('Daily', 'surecart'),
								value: 'day',
							},
							{
								label: __('Weekly', 'surecart'),
								value: 'week',
							},
							{
								label: __('Monthly', 'surecart'),
								value: 'month',
							},
							{
								label: __('Yearly', 'surecart'),
								value: 'year',
							},
						].filter(
							(choice) => validReportByOptions[choice.value]
						)}
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
					aria-label={__(
						'All Reports (opens in new window)',
						'surecart'
					)}
				>
					<ScIcon
						name="bar-chart-2"
						slot="prefix"
						aria-hidden="true"
					/>
					{__('All Reports', 'surecart')}
					<ScIcon
						name="arrow-up-right"
						slot="suffix"
						aria-hidden="true"
					/>
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
					role="tablist"
					aria-label={__('Chart metrics', 'surecart')}
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
						onKeyDown={(e) => handleTabKeyDown(e, 'amount')}
					/>
					<Tab
						title={__('Orders', 'surecart')}
						value={currentCountTotal.toLocaleString()}
						previous={previousCountTotal.toLocaleString()}
						trend={countTrend}
						selected={tab === 'count'}
						onClick={() => {
							setTab('count');
						}}
						onKeyDown={(e) => handleTabKeyDown(e, 'count')}
					/>
					<Tab
						title={__('Average Order Value', 'surecart')}
						value={formatNumber(currentAverageAmount, currency)}
						previous={formatNumber(previousAverageAmount, currency)}
						trend={averageTrend}
						selected={tab === 'average_amount'}
						onClick={() => setTab('average_amount')}
						onKeyDown={(e) => handleTabKeyDown(e, 'average_amount')}
					/>
				</div>
				<div
					css={css`
						width: 100%;
						position: relative;
					`}
				>
					<LineChart
						data={data}
						previousData={previousData}
						type={tab}
						interval={reportBy}
						css={css`
							aspect-ratio: 3.75/1;
							width: 100%;
							position: relative;
						`}
					/>
					{loading && (
						<div
							role="status"
							aria-live="polite"
							aria-label={__('Loading chart data', 'surecart')}
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
							<span
								css={css`
									position: absolute;
									width: 1px;
									height: 1px;
									padding: 0;
									margin: -1px;
									overflow: hidden;
									clip: rect(0, 0, 0, 0);
									white-space: nowrap;
									border-width: 0;
								`}
							>
								{__(
									'Loading chart data, please wait...',
									'surecart'
								)}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
