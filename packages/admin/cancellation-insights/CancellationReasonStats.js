/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import Box from '../ui/Box';
import { getFilterData } from '../util/filter';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { createErrorString } from '../util';
import { ScEmpty } from '@surecart/components-react';

const colorsArr = [
	'#a855f7',
	'#0ea5e9',
	'#22d3ee',
	'#22c55e',
	'#fbbf24',
	'#ef4444',
	'#d1d5db',
];

export function CancellationReasonStats({ liveMode = true, filter }) {
	const [totalCount, setTotalCount] = useState(null);
	const [reasonsStats, setReasonsStats] = useState(null);
	const [reasonChartData, setReasonChartData] = useState(null);
	const [loading, setLoading] = useState(true);
	const { createErrorNotice } = useDispatch(noticesStore);

	/** Fetch stats data. */
	const fetchReasonsStatsData = async (filter) => {
		try {
			setLoading(true);
			const { startDate, endDate, interval } = getFilterData(filter);
			const { data } = await apiFetch({
				path: addQueryArgs('surecart/v1/stats/cancellation_reasons', {
					start_at: startDate.format(),
					end_at: endDate.format(),
					interval: interval,
					live_mode: liveMode,
					expand: ['cancellation_reason'],
				}),
			});
			setReasonsStats(data);
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), { type: 'snackbar' });
		} finally {
			setLoading(false);
		}
	};

	/** Render the chart. */
	const renderChart = (arr = []) => {
		return (
			<div
				css={css`
					display: flex;
					background-color: var(--sc-color-gray-400);
					margin-bottom: 1.33rem;
				`}
			>
				{(arr || []).map(({ count, label }, idx) => {
					const percentage = Math.round((count / totalCount) * 100);
					return (
						<div
							key={idx}
							title={`${label} - ${percentage}% (${count})`}
							css={css`
								width: ${percentage}%;
								height: 8px;
								background-color: ${colorsArr[idx]};
								border-right: white 2px solid;
							`}
						></div>
					);
				})}
			</div>
		);
	};

	const renderReasonList = (arr = []) => {
		return (
			<div>
				{(arr || []).map(({ count, label }, idx) => {
					const percentage = Math.round((count / totalCount) * 100);
					const color = colorsArr[idx] ?? 'var(--sc-color-gray-400)';
					return (
						<div
							key={idx}
							css={css`
								display: flex;
								align-items: center;
								margin-bottom: 0.5rem;
								justify-content: space-between;
							`}
						>
							<div>
								<span
									title={label}
									css={css`
										display: inline-block;
										width: 8px;
										height: 8px;
										background-color: ${color};
										border-radius: 50%;
										margin-right: 0.66rem;
									`}
								></span>
								<span
									css={css`
										color: var(--sc-color-gray-600);
									`}
								>
									{label}
								</span>
							</div>
							<span
								css={css`
									color: ${color};
									font-weight: var(--sc-font-weight-semibold);
								`}
							>
								{percentage}%
							</span>
						</div>
					);
				})}
			</div>
		);
	};

	const setTrimmedChartData = (reasonsStats) => {
		const mappedReasons = (reasonsStats || [])?.map((stat) => ({
			count: stat?.count,
			label:
				stat?.cancellation_reason?.label ||
				__('No Reason Provided', 'surecart'),
		}));
		const sortedReasons = mappedReasons.sort((a, b) => b.count - a.count);
		const topReasons = sortedReasons.slice(0, 6);
		const restReasonsCount = sortedReasons
			.slice(6)
			.reduce((acc, curr) => acc + curr.count, 0);

		if (!!restReasonsCount) {
			topReasons.push({
				count: restReasonsCount,
				label: 'Others',
			});
		}

		setTotalCount(
			mappedReasons?.reduce((acc, curr) => acc + curr.count, 0)
		);
		setReasonChartData(topReasons);
	};

	useEffect(() => {
		fetchReasonsStatsData(filter);
	}, [filter, liveMode]);

	useEffect(() => {
		setTrimmedChartData(reasonsStats || []);
	}, [reasonsStats]);

	return (
		<Box
			title={'Cancellation Reasons'}
			loading={loading}
			hasDivider={false}
			css={css`
				border-radius: 6px !important;
				border: 1px solid var(--sc-color-gray-200);
			`}
		>
			{!loading &&
				(totalCount === 0 ? (
					<ScEmpty icon="inbox">
						{__(
							'There are no cancellation reasons for this period.',
							'surecart'
						)}
					</ScEmpty>
				) : (
					<>
						<strong
							css={css`
								font-size: 2.25em;
								font-weight: var(--sc-font-weight-normal);
								padding-bottom: 0.66em;
							`}
						>
							{totalCount}
						</strong>
						{renderChart(reasonChartData)}
						{renderReasonList(reasonChartData)}
					</>
				))}
		</Box>
	);
}
