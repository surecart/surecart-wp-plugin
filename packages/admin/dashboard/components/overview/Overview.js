/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { dateI18n, date } from '@wordpress/date';
import { Fragment, useState, useEffect } from '@wordpress/element';

import Revenue from './charts/Revenue';
import Orders from './charts/Orders';
import AverageOrderValue from './charts/AverageOrderValue';
import DatePicker from '../../DatePicker';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import { ScDivider, ScFlex } from '@surecart/components-react';
import ReportByDropdown from './parts/ReportByDropdown';

export default () => {
	const [startDate, setStartDate] = useState(
		new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
	);
	const [data, setData] = useState([]);
	const [currency, setCurrency] = useState(scData?.currency_code);
	const [previousData, setPreviousData] = useState([]);
	const [endDate, setEndDate] = useState(new Date());
	const [reportBy, setReportBy] = useState('day');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		getOrderStats();
		getPreviousOrderStats();
	}, [startDate, endDate, reportBy]);

	/**
	 * Get order stats for the range.
	 */
	const getOrderStats = async () => {
		let startDateObj = new Date(startDate);
		let endDateObj = new Date(endDate);

		try {
			setError(false);
			setLoading(true);
			const { data } = await apiFetch({
				path: addQueryArgs(`surecart/v1/stats/orders/`, {
					start_at: dateI18n(
						'Y-m-d H:i:s a',
						startDateObj.getTime(),
						true
					),
					end_at: dateI18n(
						'Y-m-d H:i:s a',
						endDateObj.getTime(),
						true
					),
					interval: reportBy,
					currency,
				}),
			});
			setData(data);
		} catch (e) {
			setError(e?.message || __('Something went wrong', 'surecart'));
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Get order stats for the previous range
	 */
	const getPreviousOrderStats = async () => {
		let startDateObj = new Date(startDate);
		let lastStartDateObj = new Date(startDate);
		let endDateObj = new Date(endDate);
		let diffDays =
			(endDateObj.getTime() - startDateObj.getTime()) /
				(1000 * 3600 * 24) +
			1;
		lastStartDateObj.setDate(startDateObj.getDate() - diffDays);

		try {
			setError(false);
			setLoading(true);
			const { data } = await apiFetch({
				path: addQueryArgs(`surecart/v1/stats/orders/`, {
					start_at: dateI18n('Y-m-d H:i:s a', lastStartDateObj, true),
					end_at: dateI18n('Y-m-d H:i:s a', startDateObj, true),
					interval: reportBy,
				}),
			});
			setPreviousData(data);
		} catch (e) {
			setError(e?.message || __('Something went wrong', 'surecart'));
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
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
					/>
					<ReportByDropdown value={reportBy} setValue={setReportBy} />
				</ScFlex>
				<ScDivider style={{ '--spacing': '0.5em' }} />
			</Fragment>

			<ScFlex style={{ '--sc-flex-column-gap': '2em' }} flexWrap="wrap">
				<Revenue
					css={chartCSS}
					loading={loading}
					currency={currency}
					data={data}
					previousData={previousData}
				/>
				<Orders
					css={chartCSS}
					loading={loading}
					currency={currency}
					data={data}
					previousData={previousData}
				/>
				<AverageOrderValue
					css={chartCSS}
					loading={loading}
					currency={currency}
					data={data}
					previousData={previousData}
				/>
				{/* <Revenue
					loading={loading}
					currentTotalOrder={currentTotalOrder}
					lastTotalOrder={lastTotalOrder}
					dateRangs={dateRangs}
					getDataArray={dataArrayAvenue}
					reportBy={reportBy}
					errorMsg={error}
				/>
				<Orders
					loading={loading}
					ordersStates={ordersStates}
					currentTotalOrder={currentTotalOrder}
					lastTotalOrder={lastTotalOrder}
					dateRangs={dateRangs}
					getDataArray={dataArrayOrders}
					reportBy={reportBy}
					errorMsg={error}
				/>
				<AverageOrderValue
					loading={loading}
					ordersStates={ordersStates}
					currentTotalOrder={currentTotalOrder}
					lastTotalOrder={lastTotalOrder}
					dateRangs={dateRangs}
					getDataArray={dataArrayAverage}
					reportBy={reportBy}
					errorMsg={error}
				/> */}
			</ScFlex>
		</Fragment>
	);
};
