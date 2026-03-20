/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScIcon, ScReviewStars, ScText } from '@surecart/components-react';

export default function StarsBreakdown({
	averageStars,
	totalReviews,
	reviewsBreakdown,
	productId,
}) {
	return (
		<div
			css={css`
				display: flex;
				gap: 24px;
				justify-content: space-between;
				width: 100%;
			`}
		>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 12px;
					justify-content: space-between;
				`}
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: 6px;
					`}
				>
					<ScText
						style={{
							'--color': 'var(--sc-color-gray-500)',
							'--font-size': 'var(--sc-font-size-medium)',
						}}
					>
						<span
							css={css`
								color: var(--sc-color-gray-700);
								font-weight: var(--sc-font-weight-bold);
							`}
						>
							{averageStars}
						</span>{' '}
						/ 5.0
					</ScText>
					<ScReviewStars rating={averageStars} size={20} />
					<ScText
						css={css`
							color: var(--sc-color-gray-500);
							font-size: var(--sc-font-size-small);
						`}
					>
						{sprintf(
							/* translators: %s: number of reviews */
							_n(
								'based on %s review',
								'based on %s reviews',
								totalReviews,
								'surecart'
							),
							totalReviews
						)}
					</ScText>
				</div>

				<Button
					target="_blank"
					variant="tertiary"
					href={addQueryArgs('admin.php', {
						page: 'sc-reviews',
						sc_product: productId,
					})}
					style={{ padding: 0, height: 'auto' }}
					icon={<ScIcon name="external-link" slot="suffix" />}
					iconPosition="right"
				>
					{__('View reviews', 'surecart')}
				</Button>
			</div>

			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 8px;
					min-width: 150px;
					flex-shrink: 0;
				`}
			>
				{[5, 4, 3, 2, 1].map((star) => {
					const count = reviewsBreakdown[star] || 0;
					const percentage =
						totalReviews > 0 ? (count / totalReviews) * 100 : 0;

					return (
						<div
							key={star}
							css={css`
								display: flex;
								align-items: center;
								gap: 8px;
								font-size: var(--sc-font-size-medium);
								color: var(--sc-color-gray-500);
							`}
						>
							<ScText
								css={css`
									color: var(--sc-color-gray-500);
								`}
							>
								{star} ★
							</ScText>
							<div
								css={css`
									flex: 1;
									height: 8px;
									background: var(--sc-color-gray-200);
									border-radius: 4px;
									overflow: hidden;
									position: relative;
								`}
							>
								<div
									css={css`
										height: 100%;
										background: ${percentage > 0
											? 'var(--sc-color-gray-500)'
											: 'transparent'};
										width: ${percentage}%;
										border-radius: 4px;
										transition: width 0.3s ease;
									`}
								/>
							</div>
							<ScText
								css={css`
									text-align: right;
									color: var(--sc-color-gray-500);
								`}
							>
								{count}
							</ScText>
						</div>
					);
				})}
			</div>
		</div>
	);
}
