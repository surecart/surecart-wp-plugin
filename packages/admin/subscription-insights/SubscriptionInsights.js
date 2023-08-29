/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import Error from '../components/Error';
import InsightsPeriodFilter from '../ui/InsightsPeriodFilter';
import Stat from '../ui/Stat';
import { getFilterData } from '../util/filter';
import { averageProperties, totalProperties } from '../util/stats';
import { ScFormatNumber } from '@surecart/components-react';

export default () => {
	const [data, setData] = useState([]);
	const [previous, setPrevious] = useState([]);
	const [error, setError] = useState(false);
	const [filter, setFilter] = useState('30days');
	const [loading, setLoading] = useState(false);
	const liveMode = getQueryArg(window.location.href, 'live_mode') !== 'false';

	const fetchData = async ({ startDate, endDate, interval }) => {
		const { data } = await apiFetch({
			path: addQueryArgs('surecart/v1/stats/subscriptions', {
				start_at: startDate.format(),
				end_at: endDate.format(),
				interval,
				live_mode: liveMode,
			}),
		});

		return data;
	};

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

	const getSubscriptionsStatsData = async () => {
		const { startDate, endDate, prevEndDate, prevStartDate, interval } =
			getFilterData(filter);
		setError(false);
		setLoading(true);

		try {
			await Promise.all([
				fetchCurrent({ startDate, endDate, interval }),
				fetchPrevious({
					startDate: prevStartDate,
					endDate: prevEndDate,
					interval,
				}),
			]);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getSubscriptionsStatsData();
	}, [filter, liveMode]);

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
			<InsightsPeriodFilter filter={filter} setFilter={setFilter} />
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
						grid-template-columns: repeat(4, 1fr);
					}
					gap: 1.5em;
				`}
			>
				<Stat
					title={__('Subscriptions', 'surecart')}
					description={__('Number Of Subscriptions', 'surecart')}
					loading={loading}
					compare={{
						current: totalProperties('total_count', data),
						previous: totalProperties('total_count', previous),
					}}
				>
					{totalProperties('total_count', data)}
				</Stat>
				<Stat
					title={__('New Subscriptions', 'surecart')}
					description={__('Number Of New Subscriptions', 'surecart')}
					loading={loading}
					compare={{
						current: totalProperties('new_count', data),
						previous: totalProperties('new_count', previous),
					}}
				>
					{totalProperties('new_count', data)}
				</Stat>
				<Stat
					title={__('Trial Conversion', 'surecart')}
					description={__(
						'Conversion Rate From Trial To Paid',
						'surecart'
					)}
					compare={{
						current: averageProperties(
							'trial_conversion_rate',
							data
						),
						previous: averageProperties(
							'trial_conversion_rate',
							previous
						),
					}}
					loading={loading}
				>
					<ScFormatNumber
						value={averageProperties('trial_conversion_rate', data)}
						type="percent"
					/>
				</Stat>
				<Stat
					title={__('Trials', 'surecart')}
					description={__('Total Trials', 'surecart')}
					loading={loading}
					compare={{
						current: totalProperties('total_trial_count', data),
						previous: totalProperties(
							'total_trial_count',
							previous
						),
					}}
				>
					{totalProperties('total_trial_count', data)}
				</Stat>
				<Stat
					title={__('Monthly Recurring Revenue', 'surecart')}
					description={__(
						'Total Monthly Recurring Revenue',
						'surecart'
					)}
					loading={loading}
					compare={{
						current: totalProperties('total_mrr_amount', data),
						previous: totalProperties('total_mrr_amount', previous),
					}}
				>
					<ScFormatNumber
						type="currency"
						currency={data[0]?.currency || scData?.currency_code}
						value={totalProperties('total_mrr_amount', data)}
					/>
				</Stat>
				<Stat
					title={__('Churn Rate', 'surecart')}
					description={__('Subscription Churn Rate', 'surecart')}
					loading={loading}
					compare={{
						current: averageProperties('mrr_churn_rate', data),
						previous: averageProperties('mrr_churn_rate', previous),
					}}
				>
					<ScFormatNumber
						value={averageProperties('mrr_churn_rate', data)}
						type="percent"
						maximumFractionDigits={2}
					/>
				</Stat>
				<Stat
					title={__('Lost Revenue', 'surecart')}
					description={__('Revenue Lost From Churn', 'surecart')}
					loading={loading}
					compare={{
						current: totalProperties('lost_mrr_amount', data),
						previous: totalProperties('lost_mrr_amount', previous),
					}}
					reverse
				>
					<ScFormatNumber
						value={totalProperties('lost_mrr_amount', data)}
						type="currency"
						currency={data[0]?.currency || scData?.currency_code}
					/>
				</Stat>
				<Stat
					title={__('Outstanding Installments', 'surecart')}
					description={__(
						'Total Of Installment Payments Remaining',
						'surecart'
					)}
					loading={loading}
					compare={{
						current: totalProperties(
							'total_remaining_amount',
							data
						),
						previous: totalProperties(
							'total_remaining_amount',
							previous
						),
					}}
				>
					<ScFormatNumber
						type="currency"
						currency={data[0]?.currency || scData?.currency_code}
						value={totalProperties('total_remaining_amount', data)}
					></ScFormatNumber>
				</Stat>
			</div>
		</div>
	);
};
