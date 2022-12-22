/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';

const colorsArr = [
	'#3b82f6',
	'#22d3ee',
	'#a3e635',
	'#fbbf24',
	'#ef4444',
	'#d1d5db',
];

export function CancellationReasonStats({ reasons }) {
	const sortedReasons = reasons.sort((a, b) => b.count - a.count);
	const totalCount = reasons.reduce((acc, curr) => acc + curr.count, 0);

	const renderChart = (arr) => {
		return (
			<div
				css={css`
					display: flex;
					background-color: var(
						--sc-tag-default-background-color,
						var(--sc-color-gray-100)
					);
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
										background-color: ${colorsArr[idx]};
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
									color: ${colorsArr[idx]};
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

	return (
		<Box
			title={'Cancellations Reasons'}
			loading={false}
			hasDivider={false}
			css={css`
				border-radius: 6px !important;
				border: 1px solid var(--sc-color-gray-200);
			`}
		>
			<strong
				css={css`
					font-size: 2.25em;
					font-weight: var(--sc-font-weight-normal);
					padding-bottom: 0.66em;
				`}
			>
				{totalCount}
			</strong>
			{renderChart(sortedReasons)}
			{renderReasonList(sortedReasons)}
		</Box>
	);
}
