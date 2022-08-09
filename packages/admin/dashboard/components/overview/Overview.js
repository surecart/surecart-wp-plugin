/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { dateI18n, date } from '@wordpress/date';
import { Fragment, useState, useEffect } from '@wordpress/element';

import Revenue from './charts/Revenue';
import Orders from './charts/Orders';
import AverageOrderValue from './charts/AverageOrderValue';
import Error from '../../../components/Error';
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
		let startDateObj = new Date(startDate);
		let endDateObj = new Date(endDate);
		let diffDays =
			(endDateObj.getTime() - startDateObj.getTime()) /
				(1000 * 3600 * 24) +
			1;

		if (diffDays < 366 && 'year' === reportBy) {
			setStartDate(startDateObj.getTime() - 365 * 24 * 60 * 60 * 1000);
		} else if (diffDays < 32 && 'month' === reportBy) {
			setStartDate(startDateObj.getTime() - 60 * 24 * 60 * 60 * 1000);
		} else if (diffDays > 200 && 'day' === reportBy) {
			setStartDate(new Date(Date.now() - 199 * 24 * 60 * 60 * 1000));
		} else {
			getOrderStats();
			getPreviousOrderStats();
		}
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
					start_at: new Date(startDateObj).toISOString(),
					end_at: new Date(endDateObj).toISOString(),
					interval: reportBy,
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
					start_at: new Date(lastStartDateObj).toISOString(),
					end_at: new Date(startDateObj).toISOString(),
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
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
					/>
					<ReportByDropdown value={reportBy} setValue={setReportBy} />
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
