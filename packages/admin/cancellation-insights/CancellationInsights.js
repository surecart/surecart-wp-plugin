/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import {
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScTag,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import Error from '../components/Error';
import Stat from '../ui/Stat';
import Tab from '../ui/Tab';
import { averageProperties, totalProperties } from './util';
import { getFormattedPrice, maybeConvertAmount } from '../util';
import { getFilterData } from '../util/filter';
import { CancellationReasonStats } from './CancellationReasonStats';

export default () => {
	const [data, setData] = useState([]);
	const [previous, setPrevious] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [filter, setFilter] = useState('30days');

	const { cancellation_reasons, cancellation_acts } = useSelect((select) => {
		const reasonsQueryArgs = ['surecart', 'cancellation_reason'];
		const actsQueryArgs = ['surecart', 'cancellation_act'];

		return {
			cancellation_reasons: select(coreStore).getEntityRecords(
				...reasonsQueryArgs
			),
			cancellation_acts: select(coreStore).getEntityRecords(
				...actsQueryArgs
			),
			is_reasons_loading: select(coreStore).isResolving(
				'getEntityRecords',
				reasonsQueryArgs
			),
			is_acts_loading: select(coreStore).isResolving(
				'getEntityRecords',
				actsQueryArgs
			),
		};
	});

	console.log('cancellation_reasons', cancellation_reasons);
	console.log('cancellation_acts', cancellation_acts);

	const getAbandonedData = async () => {
		const { startDate, endDate, prevEndDate, prevStartDate, interval } =
			getFilterData(filter);

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
			path: addQueryArgs('surecart/v1/stats/cancellation_acts', {
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
					@media screen and (min-width: 1280px) {
						grid-template-columns: 5fr 2fr;
					}

					gap: 1.5em;
				`}
			>
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
							grid-template-columns: repeat(2, 1fr);
						}
						gap: 1.5em;
					`}
				>
					<Stat
						title={__('Cancellation Attempts', 'surecart')}
						description={__(
							'Total Cancellation Attempts',
							'surecart'
						)}
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
								? __('Retained Cancellations', 'surecart')
								: __('Total Retained Cancellations', 'surecart')
						}
						description={__(
							'Total recovered checkouts',
							'surecart'
						)}
						loading={loading}
						compare={badge({
							current: totalProperties('assisted_count', data),
							previous: totalProperties(
								'assisted_count',
								previous
							),
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
								? __('Cancellation Rate', 'surecart')
								: __('Average Cancellation Rate', 'surecart')
						}
						description={__(
							'Percentage of checkouts recovered',
							'surecart'
						)}
						loading={loading}
						compare={badge({
							current: averageProperties('assisted_rate', data),
							previous: averageProperties(
								'assisted_rate',
								previous
							),
						})}
					>
						{hasAccess
							? `${Math.round(
									averageProperties('assisted_rate', data) *
										100
							  )}%`
							: '18%'}
					</Stat>

					<Stat
						title={__('Total Lost', 'surecart')}
						description={__('Total Lost', 'surecart')}
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
				</div>

				<CancellationReasonStats
					reasons={[
						{ label: 'Too expensive', count: 30 },
						{ label: 'Switching to another product', count: 18 },
						{ label: 'Shutting down the company', count: 8 },
						{ label: 'Technical issues', count: 56 },
						{ label: 'Others', count: 22 },
						{ label: 'No reason selected', count: 3 },
					]}
				/>
			</div>
		</div>
	);
};
