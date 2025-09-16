/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { PanelRow, ToggleControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScButton, ScIcon, ScFlex, ScText } from '@surecart/components-react';

export default ({ product = {}, updateProduct, loading }) => {
	const [reviewProtocol, setReviewProtocol] = useState({});
	const [loadingProtocol, setLoadingProtocol] = useState(true);
	const {
		total_reviews: totalReviews = 0,
		average_stars: averageStars = 0,
		reviews_breakdown: reviewsBreakdown = {},
	} = product;

	// Fetch review protocol settings on mount.
	useEffect(() => {
		const fetchReviewProtocol = async () => {
			try {
				const response = await apiFetch({
					path: '/surecart/v1/review_protocol',
				});
				setReviewProtocol(response);
			} catch (error) {
				console.error('Error fetching review protocol:', error);
			} finally {
				setLoadingProtocol(false);
			}
		};

		fetchReviewProtocol();
	}, []);

	// Render star rating based on exact average
	const renderStarRating = (rating, size = 16) => {
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
							<linearGradient id={`star-gradient-${i}`}>
								<stop
									offset={`${fillPercentage}%`}
									stopColor="#fbbf24"
								/>
								<stop
									offset={`${fillPercentage}%`}
									stopColor="#e2e8f0"
								/>
							</linearGradient>
						</defs>
						<polygon
							points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
							fill={
								fillPercentage > 0
									? `url(#star-gradient-${i})`
									: '#e2e8f0'
							}
							stroke={fillPercentage > 0 ? '#fbbf24' : '#e2e8f0'}
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
	};

	// Render compact star display.
	const renderStarDisplay = () => {
		if (totalReviews === 0) return null;

		return (
			<div
				css={css`
					background: #f8fafc;
					border: 1px solid #e2e8f0;
					border-radius: 6px;
					padding: 12px;
					margin-bottom: 16px;
				`}
			>
				<ScFlex
					justifyContent="space-between"
					alignItems="center"
					css={css`
						margin-bottom: 8px;
					`}
				>
					<ScFlex
						alignItems="center"
						css={css`
							gap: 8px;
						`}
					>
						{renderStarRating(averageStars, 16)}
						<ScText
							css={css`
								font-weight: 600;
								color: #1e293b;
								font-size: 16px;
							`}
						>
							{averageStars}
						</ScText>
						<ScText
							css={css`
								color: #64748b;
								font-size: 14px;
							`}
						>
							({totalReviews}{' '}
							{totalReviews === 1
								? __('review', 'surecart')
								: __('reviews', 'surecart')}
							)
						</ScText>
					</ScFlex>
				</ScFlex>

				{/* Compact star breakdown */}
				<div
					css={css`
						display: grid;
						grid-template-columns: repeat(5, 1fr);
						gap: 4px;
						font-size: 11px;
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
									justify-content: center;
									padding: 4px 2px;
									background: ${percentage > 0
										? '#fbbf24'
										: '#f1f5f9'};
									color: ${percentage > 0
										? '#ffffff'
										: '#64748b'};
									border-radius: 4px;
									font-weight: 500;
									text-align: center;
									transition: all 0.2s ease;
									cursor: help;
									&:hover {
										transform: translateY(-1px);
										box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
									}
								`}
								title={`${star} ${
									star === 1
										? __('star', 'surecart')
										: __('stars', 'surecart')
								}: ${count} ${
									count === 1
										? __('review', 'surecart')
										: __('reviews', 'surecart')
								} (${percentage.toFixed(0)}%)`}
							>
								{star}★ {count}
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	// Don't show if reviews are not enabled globally.
	if (loadingProtocol || !reviewProtocol?.reviews_enabled) {
		return null;
	}

	return (
		<Box
			title={__('Reviews', 'surecart')}
			loading={loadingProtocol || loading}
			footer={
				<>
					<ScButton
						target="_blank"
						href={addQueryArgs('admin.php', {
							page: 'sc-reviews',
							sc_product: product?.id,
						})}
					>
						{__('Product Reviews', 'surecart')}
						<ScIcon name="external-link" slot="suffix" />
					</ScButton>
				</>
			}
		>
			<div>
				{renderStarDisplay()}

				<div>
					<PanelRow
						css={{ justifyContent: 'space-between', gap: 10 }}
					>
						<span>
							{__('Enable Reviews on this product', 'surecart')}
						</span>
						<ToggleControl
							__nextHasNoMarginBottom={true}
							checked={product?.reviews_enabled || false}
							onChange={(value) => {
								updateProduct({ reviews_enabled: value });
							}}
							disabled={
								loading || !reviewProtocol?.reviews_enabled
							}
						/>
					</PanelRow>

					{product?.reviews_enabled && (
						<PanelRow
							css={{ justifyContent: 'space-between', gap: 10 }}
						>
							<span>
								{__(
									'Send automatic review request emails to customers who purchase this product.',
									'surecart'
								)}
							</span>
							<ToggleControl
								__nextHasNoMarginBottom={true}
								checked={product?.solicit_reviews || false}
								onChange={(value) => {
									updateProduct({ solicit_reviews: value });
								}}
								disabled={loading}
							/>
						</PanelRow>
					)}
				</div>
			</div>
		</Box>
	);
};
