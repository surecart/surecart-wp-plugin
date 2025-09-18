/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default function AverageStarRating({ rating, size = 16 }) {
	const stars = [];
	const numericRating = parseFloat(rating) || 0;

	for (let i = 1; i <= 5; i++) {
		const difference = numericRating - (i - 1);
		let fillPercentage = 0;

		if (difference >= 1) {
			fillPercentage = 100;
		} else if (difference >= 0.5) {
			fillPercentage = 50;
		} else if (difference > 0) {
			fillPercentage = Math.round(difference * 100);
		}

		stars.push(
			<div
				key={i}
				css={css`
					position: relative;
					display: inline-block;
					width: ${size}px;
					height: ${size}px;
				`}
			>
				{/* Base star with outline */}
				<svg
					width={size}
					height={size}
					viewBox="0 0 24 24"
					css={css`
						position: absolute;
						top: 0;
						left: 0;
					`}
				>
					<defs>
						<linearGradient id={`star-gradient-${i}-${rating}`}>
							<stop
								offset={`${fillPercentage}%`}
								stopColor="var(--sc-color-gray-500)"
							/>
							<stop
								offset={`${fillPercentage}%`}
								stopColor="var(--sc-color-gray-200)"
							/>
						</linearGradient>
					</defs>
					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						fill={
							fillPercentage > 0
								? `url(#star-gradient-${i}-${rating})`
								: 'var(--sc-color-gray-200)'
						}
						stroke={fillPercentage > 0 ? 'var(--sc-color-gray-500)' : 'var(--sc-color-gray-200)'}
						strokeWidth="1"
					/>
				</svg>
			</div>
		);
	}

	return (
		<div
			css={css`
				display: flex;
				gap: 2px;
			`}
		>
			{stars}
		</div>
	);
}
