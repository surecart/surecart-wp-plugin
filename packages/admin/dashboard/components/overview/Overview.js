/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScDivider, ScFlex, ScSwitch } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import Error from '../../../components/Error';
import DatePicker from '../../DatePicker';
import AverageOrderValue from './charts/AverageOrderValue';
import Orders from './charts/Orders';
import Revenue from './charts/Revenue';
import ReportByDropdown from './parts/ReportByDropdown';

dayjs.extend(duration);
dayjs.extend(utc);

export default ({ liveMode, setLiveMode }) => {
	const currency = scData?.currency_code;
	const [endDate, setEndDate] = useState(dayjs());
	const [startDate, setStartDate] = useState(dayjs().add(-1, 'month'));
	const [data, setData] = useState([]);
	const [previousData, setPreviousData] = useState([]);
	const [reportBy, setReportBy] = useState('day');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

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
			setError(false);
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
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Get order stats for the previous range
	 */
	const getPreviousOrderStats = async (startAt, endAt) => {
		try {
			setError(false);
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
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const chartCSS = css`
		flex: 1;
		min-width: 420px;
		@media screen and (max-width: 782px) {
			width: 100%;
		}
	`;

	return (
		<Fragment>
			<Fragment>
				<h3
					css={css`
						font-weight: 600;
						font-size: 28px;
						line-height: 28px;
						margin-top: 0px;
						color: #334155;
					`}
				>
					{__('Overview', 'surecart')}
				</h3>
				<ScFlex>
					<DatePicker
						startDate={startDate}
						endDate={endDate}
						setStartDate={(date) => setStartDate(dayjs(date))}
						setEndDate={(date) => setEndDate(dayjs(date))}
					/>

					<ScFlex alignItems={'center'}>
						<ScSwitch
							checked={!liveMode}
							onScChange={(e) => {
								setLiveMode(!e.target.checked);
							}}
							reversed
						>
							{__('Test Mode', 'surecart')}
						</ScSwitch>
						<ReportByDropdown
							value={reportBy}
							setValue={setReportBy}
						/>
					</ScFlex>
				</ScFlex>
				<ScDivider style={{ '--spacing': '0.5em' }} />
			</Fragment>

			<Error error={error} setError={setError} margin="80px" />

			<ScFlex style={{ '--sc-flex-column-gap': '2em' }} flexWrap="wrap">
				<Revenue
					css={chartCSS}
					loading={loading}
					currency={currency}
					data={data}
					reportBy={reportBy}
					previousData={previousData}
				/>
				<Orders
					css={chartCSS}
					loading={loading}
					currency={currency}
					data={data}
					reportBy={reportBy}
					previousData={previousData}
				/>
				<AverageOrderValue
					css={chartCSS}
					loading={loading}
					currency={currency}
					data={data}
					reportBy={reportBy}
					previousData={previousData}
				/>
			</ScFlex>
		</Fragment>
	);
};
