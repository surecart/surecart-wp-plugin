/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
import {
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScTag,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import Error from '../components/Error';
import Stat from './Stat';
import Tab from './Tab';
import { averageProperties, totalProperties } from './util';
import { getFormattedPrice, maybeConvertAmount } from '../util';

export default () => {
	const [data, setData] = useState([]);
	const [previous, setPrevious] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [filter, setFilter] = useState('30days');

	const getAbandonedData = async () => {
		// defaults.
		let startDate = dayjs().startOf('day');
		let endDate = dayjs().endOf('day');
		let prevEndDate = startDate;
		let prevStartDate = dayjs(startDate).add(-1, 'day');
		let interval = 'day';

		// change current and previous dates.
		switch (filter) {
			case '30days':
				endDate = dayjs();
				startDate = dayjs().add(-1, 'month');
				prevEndDate = startDate;
				prevStartDate = dayjs().add(-2, 'month');
				break;
			case 'yesterday':
				endDate = dayjs().startOf('day');
				startDate = dayjs().startOf('day').add(-1, 'day');
				prevEndDate = startDate;
				prevStartDate = dayjs(startDate).add(-1, 'day');
				break;
			case 'thisweek':
				startDate = dayjs().startOf('week');
				endDate = dayjs().endOf('day');
				prevEndDate = startDate;
				prevStartDate = dayjs(startDate).add(-1, 'week');
				break;
			case 'lastweek':
				startDate = dayjs().startOf('week').add(-1, 'week');
				endDate = dayjs().startOf('week');
				prevEndDate = startDate;
				prevStartDate = dayjs(startDate).add(-1, 'week');
				break;
			case 'thismonth':
				startDate = dayjs().startOf('month');
				endDate = dayjs().endOf('day');
				prevEndDate = startDate;
				prevStartDate = dayjs(startDate).add(-1, 'month');
				break;
			case 'lastmonth':
				startDate = dayjs().startOf('month').add(-1, 'month');
				endDate = dayjs().startOf('month');
				prevEndDate = startDate;
				prevStartDate = dayjs(startDate).add(-1, 'month');
				break;
		}

		// set interval to hour if day is not enough
		if (endDate.diff(startDate, 'day') < 1) {
			interval = 'hour';
		}

		try {
			setError(false);
			setLoading(true);
			await Promise.all([
				fetchCurrent({ startDate, endDate, interval }),
				fetchPrevious({
					startDate: prevStartDate,
					endDate: prevEndDate,
					interval,
				}),
			]);
		} catch (err) {
			console.error(err);
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getAbandonedData();
	}, [filter]);

	const fetchCurrent = async ({ startDate, endDate, interval }) => {
		const data = await fetchData({ startDate, endDate, interval });
		data && setData(data);
	};

	const fetchPrevious = async ({ startDate, endDate, interval }) => {
		const data = await fetchData({
			startDate,
			endDate,
			interval,
		});
		data && setPrevious(data);
	};

	const fetchData = async ({ startDate, endDate, interval }) => {
		const { data } = await apiFetch({
			path: addQueryArgs('surecart/v1/stats/abandoned_checkouts', {
				start_at: startDate.toISOString(),
				end_at: endDate.toISOString(),
				interval: interval,
			}),
		});
		return data;
	};

	const hasAccess = scData?.entitlements?.abandoned_checkouts;

	const badge = ({ previous, current, currency = false }) => {
		if (!hasAccess) {
			return <ScTag type="success">{__('Pro', 'surecart')}</ScTag>;
		}

		if (loading) return null;

		let percentage;
		if (currency) {
			console.log(Math.abs(current - previous));
			percentage = getFormattedPrice({
				amount: Math.abs(current - previous),
				currency: scData.currency_code,
			});
		} else {
			percentage =
				Math.abs(
					((current - previous) / (previous || 1)) * 100.0
				).toLocaleString('fullwide', { maximumFractionDigits: 0 }) +
				'%';
		}

		let type, icon;
		if (previous === current) {
			type = 'default';
			icon = 'bar-chart';
		} else {
			type = previous < current ? 'success' : 'danger';
			icon = previous < current ? 'arrow-up-right' : 'arrow-down-right';
		}

		return (
			<ScTag type={type}>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.3em;
					`}
				>
					<ScIcon name={icon} />
					{percentage}
				</div>
			</ScTag>
		);
	};

	return (
		<div
			css={css`
				display: grid;
				gap: 1.5em;
				margin: 1.5em auto;

				--sc-color-primary-500: var(--sc-color-brand-primary);
				--sc-focus-ring-color-primary: var(--sc-color-brand-primary);
				--sc-input-border-color-focus: var(--sc-color-brand-primary);
			`}
		>
			<Error error={error} setError={setError} />

			<ScFlex
				alignItems="center"
				justifyContent="flex-start"
				flexWrap="wrap"
			>
				<Tab
					selected={filter === '30days'}
					onClick={() => setFilter('30days')}
				>
					{__('Last 30 Days', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'today'}
					onClick={() => setFilter('today')}
				>
					{__('Today', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'yesterday'}
					onClick={() => setFilter('yesterday')}
				>
					{__('Yesterday', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'thisweek'}
					onClick={() => setFilter('thisweek')}
				>
					{__('This Week', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'lastweek'}
					onClick={() => setFilter('lastweek')}
				>
					{__('Last Week', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'thismonth'}
					onClick={() => setFilter('thismonth')}
				>
					{__('This Month', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'lastmonth'}
					onClick={() => setFilter('lastmonth')}
				>
					{__('Last Month', 'surecart')}
				</Tab>
			</ScFlex>

			<div
				css={css`
					display: grid;
					grid-template-columns: 1fr;

					// 2 col, wide mobile.
					@media screen and (min-width: 720px) {
						grid-template-columns: 1fr 1fr;
					}

					// 3 col, desktop.
					@media screen and (min-width: 1280px) {
						grid-template-columns: 1fr 1fr 1fr;
					}
					gap: 1.5em;
				`}
			>
				<Stat
					title={__('Recoverable Checkouts', 'surecart')}
					description={__('Total Recoverable Checkouts', 'surecart')}
					loading={loading}
					compare={badge({
						current: totalProperties('count', data),
						previous: totalProperties('count', previous),
					})}
				>
					{totalProperties('count', data)}
				</Stat>

				<Stat
					title={
						hasAccess
							? __('Recovered Checkouts', 'surecart')
							: __('Potential Recovered Checkouts', 'surecart')
					}
					description={__('Total recovered checkouts', 'surecart')}
					loading={loading}
					compare={badge({
						current: totalProperties('assisted_count', data),
						previous: totalProperties('assisted_count', previous),
					})}
				>
					{hasAccess
						? totalProperties('assisted_count', data)
						: Math.round(
								(totalProperties('count', data) || 0) * 0.18
						  )}
				</Stat>

				<Stat
					title={
						hasAccess
							? __('Checkout Recovery Rate', 'surecart')
							: __('Potential Checkout Recovery Rate', 'surecart')
					}
					description={__(
						'Percentage of checkouts recovered',
						'surecart'
					)}
					loading={loading}
					compare={badge({
						current: averageProperties('assisted_rate', data),
						previous: averageProperties('assisted_rate', previous),
					})}
				>
					{hasAccess
						? `${Math.round(
								averageProperties('assisted_rate', data) * 100
						  )}%`
						: '18%'}
				</Stat>

				<Stat
					title={__('Recoverable Revenue', 'surecart')}
					description={__('Total recoverable revenue', 'surecart')}
					loading={loading}
					compare={badge({
						current: totalProperties('amount', data),
						previous: totalProperties('amount', previous),
						currency: true,
					})}
				>
					<ScFormatNumber
						type="currency"
						currency={scData?.currency_code || 'usd'}
						value={totalProperties('amount', data)}
					/>
				</Stat>

				<Stat
					title={
						hasAccess
							? __('Recovered Revenue', 'surecart')
							: __('Potential Recovered Revenue', 'surecart')
					}
					description={__('Total recovered revenue', 'surecart')}
					loading={loading}
					compare={badge({
						current: totalProperties('assisted_amount', data),
						previous: totalProperties('assisted_amount', previous),
						currency: true,
					})}
				>
					{hasAccess ? (
						<ScFormatNumber
							type="currency"
							currency="usd"
							value={totalProperties('assisted_amount', data)}
						/>
					) : (
						<ScFormatNumber
							type="currency"
							currency="usd"
							value={totalProperties('amount', data) * 0.18}
						/>
					)}
				</Stat>

				<Stat
					title={
						hasAccess
							? __('Revenue Recovery Rate', 'surecart')
							: __('Potential Revenue Recovery Rate', 'surecart')
					}
					description={__(
						'Percentage of revenue recovered',
						'surecart'
					)}
					loading={loading}
					compare={badge({
						current: averageProperties(
							'assisted_amount_rate',
							data
						),
						previous: averageProperties(
							'assisted_amount_rate',
							previous
						),
					})}
				>
					{hasAccess
						? `${Math.round(
								averageProperties(
									'assisted_amount_rate',
									data
								) * 100
						  )}%`
						: '18%'}
				</Stat>
			</div>
		</div>
	);
};
