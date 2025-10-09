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

const Tab = ({ title, value, previous, trend = 'up', selected, ...props }) => {
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
			{...props}
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
	const [startDate, setStartDate] = useState(dayjs().add(-1, 'month'));
	const [endDate, setEndDate] = useState(dayjs());
	const [reportBy, setReportBy] = useState('day');
	const [data, setData] = useState([]);
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
	}, [startDate, endDate, reportBy]);

	/**
	 * Get order stats for the range.
	 */
	const getOrderStats = async (startAt, endAt) => {
		try {
			// setError(false);
			// setLoading(true);
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
			// setLoading(false);
		}
	};

	/**
	 * Get order stats for the previous range
	 */
	const getPreviousOrderStats = async (startAt, endAt) => {
		try {
			// setError(false);
			// setLoading(true);
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
			// setLoading(false);
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
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 10px;
					`}
				>
					<DatePicker
						startDate={startDate}
						endDate={endDate}
						setStartDate={(date) => setStartDate(dayjs(date))}
						setEndDate={(date) => setEndDate(dayjs(date))}
					/>
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
					<ScSwitch
						checked={!liveMode}
						onScChange={(e) => {
							setLiveMode(!e.target.checked);
						}}
					>
						Test mode
					</ScSwitch>
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
						selected={tab === 'amount'}
						onClick={() => setTab('amount')}
					/>
					<Tab
						title="Orders"
						value="567"
						previous="456"
						trend="up"
						selected={tab === 'count'}
						onClick={() => {
							console.log('count');
							setTab('count');
						}}
					/>
					<Tab
						title="Average Order Value"
						value="$19.00"
						previous="$22.00"
						trend="down"
						selected={tab === 'average_amount'}
						onClick={() => setTab('average_amount')}
					/>
				</div>
				<div
					css={css`
						aspect-ratio: 3.75/1;
						width: 100%;
					`}
				>
					<LineChart
						data={data}
						previousData={previousData}
						type={tab}
					/>
				</div>
			</div>
		</div>
	);
};
