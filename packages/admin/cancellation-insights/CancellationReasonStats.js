/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import Box from '../ui/Box';
import { getFilterData } from '../util/filter';

const colorsArr = [
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
	const [error, setError] = useState(false);

	const { cancellation_reasons } = useSelect((select) => {
		const queryArgs = ['surecart', 'cancellation_reason'];
		return {
			cancellation_reasons: select(coreStore).getEntityRecords(
				...queryArgs
			),
		};
	}, []);

	const fetchReasonsStatsData = async (filter) => {
		const { startDate, endDate, interval } = getFilterData(filter);
		setLoading(true);

		const { data } = await apiFetch({
			path: addQueryArgs('surecart/v1/stats/cancellation_reasons', {
				start_at: startDate.toISOString(),
				end_at: endDate.toISOString(),
				interval: interval,
				live_mode: liveMode,
			}),
		}).catch(() => setError(true));
		setReasonsStats(data);
	};

	const renderChart = (arr) => {
		return (
			<div
				css={css`
					display: flex;
					background-color: var(--sc-color-gray-400);
					margin-bottom: 1.33rem;
				`}
			>
				{arr.map(({ count, label }, idx) => {
					const percentage = Math.round((count / totalCount) * 100);
					return (
						<div
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

	const renderReasonList = (arr) => {
		return (
			<div>
				{arr.map(({ count, label }, idx) => {
					const percentage = Math.round((count / totalCount) * 100);
					const color = colorsArr[idx] ?? 'var(--sc-color-gray-400)';
					return (
						<div
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

	const getReasonLabel = (reasonId) => {
		if (!reasonId) return 'No Reason Provided';
		const currReason = cancellation_reasons.filter(
			(reason) => reason.id === reasonId
		);
		return currReason[0]?.label;
	};

	useEffect(() => {
		fetchReasonsStatsData(filter);
	}, [filter, liveMode]);

	useEffect(() => {
		if (!cancellation_reasons && !cancellation_reasons?.length) return;
		if (!reasonsStats && !reasonsStats?.length) return;

		const mappedReasons = reasonsStats.map((reason) => ({
			cancellation_reason_id: reason?.cancellation_reason_id,
			count: reason?.count,
			label: getReasonLabel(reason?.cancellation_reason_id),
		}));
		setTotalCount(
			mappedReasons?.reduce((acc, curr) => acc + curr.count, 0)
		);
		setReasonChartData(mappedReasons?.sort((a, b) => b.count - a.count));
		setLoading(false);
	}, [cancellation_reasons, reasonsStats]);

	return (
		<Box
			title={'Cancellations Reasons'}
			loading={loading}
			hasDivider={false}
			css={css`
				border-radius: 6px !important;
				border: 1px solid var(--sc-color-gray-200);
			`}
		>
			{!loading && (
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
			)}
		</Box>
	);
}
