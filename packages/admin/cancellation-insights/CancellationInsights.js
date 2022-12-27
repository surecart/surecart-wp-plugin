/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { ScFlex, ScIcon, ScSwitch, ScTag } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import Error from '../components/Error';
import Stat from '../ui/Stat';
import Tab from '../ui/Tab';
import { averageProperties, totalProperties } from './util';
import { getFilterData } from '../util/filter';
import { CancellationReasonStats } from './CancellationReasonStats';

export default () => {
	const [data, setData] = useState([]);
	const [previous, setPrevious] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [filter, setFilter] = useState('30days');
	const [liveMode, setLiveMode] = useState(false);

	const getCancellationActsData = async () => {
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
		getCancellationActsData();
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
				live_mode: liveMode,
			}),
		});
		return data;
	};

	const badge = ({ previous, current, reverse = false }) => {
		if (loading) return null;

		let percentage;

		percentage =
			Math.abs(
				((current - previous) / (previous || 1)) * 100.0
			).toLocaleString('fullwide', { maximumFractionDigits: 0 }) + '%';

		let type, icon;
		if (previous === current) {
			type = 'default';
			icon = 'bar-chart';
		} else {
			if (reverse) {
				type = previous < current ? 'danger' : 'success';
			} else {
				type = previous < current ? 'success' : 'danger';
			}
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
			<ScFlex alignItems="center">
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

				<ScSwitch
					checked={!liveMode}
					onScChange={(e) => {
						setLiveMode(!e.target.checked);
					}}
					reversed
				>
					{__('Test Mode', 'surecart')}
				</ScSwitch>
			</ScFlex>

			<div
				css={css`
					display: grid;
					grid-template-columns: 1fr;

					// 2 col, wide mobile.
					@media screen and (min-width: 1280px) {
						grid-template-columns: 6fr 2fr;
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
							grid-template-columns: repeat(3, 1fr);
						}
						gap: 1.5em;
					`}
				>
					{/* Order
						// Cancellations Attempts
						// Preserved Count
						// Preserved By Coupon
						// Total Lost
						// Preserved Rate %
						// Preserved Rate By Coupon %
					*/}
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
						title={__('Preserved Count', 'surecart')}
						description={__('Total Preserved Count', 'surecart')}
						loading={loading}
						compare={badge({
							current: totalProperties('preserved_count', data),
							previous: totalProperties(
								'preserved_count',
								previous
							),
						})}
					>
						{totalProperties('preserved_count', data)}
					</Stat>

					<Stat
						title={__('Preserved By Coupon', 'surecart')}
						description={__(
							'Total Preserved By Coupon',
							'surecart'
						)}
						loading={loading}
						compare={badge({
							current: totalProperties(
								'coupon_applied_count',
								data
							),
							previous: totalProperties(
								'coupon_applied_count',
								previous
							),
						})}
					>
						{totalProperties('coupon_applied_count', data)}
					</Stat>

					<Stat
						title={__('Total Lost', 'surecart')}
						description={__('Total Lost Cancellations', 'surecart')}
						loading={loading}
						compare={badge({
							current:
								totalProperties('count', data) -
								totalProperties('preserved_count', data),
							previous:
								totalProperties('count', previous) -
								totalProperties('preserved_count', previous),
							reverse: true,
						})}
					>
						{totalProperties('count', data) -
							totalProperties('preserved_count', data)}
					</Stat>

					<Stat
						title={__('Preserved Rate', 'surecart')}
						description={__(
							'Percentage of Preserved Rate',
							'surecart'
						)}
						loading={loading}
						compare={badge({
							current: averageProperties('preserved_rate', data),
							previous: averageProperties('preserved_rate', data),
						})}
					>
						{`${Math.round(
							averageProperties('preserved_rate', data) * 100
						)}%`}
					</Stat>

					<Stat
						title={__('Preserved Rate By Coupon', 'surecart')}
						description={__(
							'Percentage of Preserved Rate By Coupon',
							'surecart'
						)}
						loading={loading}
						compare={badge({
							current: averageProperties(
								'coupon_applied_rate',
								data
							),
							previous: averageProperties(
								'coupon_applied_rate',
								data
							),
						})}
					>
						{`${Math.round(
							averageProperties('coupon_applied_rate', data) * 100
						)}%`}
					</Stat>
				</div>

				<CancellationReasonStats reasons={[]} />
			</div>
		</div>
	);
};
