/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import StarsBreakdown from './StarsBreakdown';
import { ScButton, ScSwitch } from '@surecart/components-react';

export default ({ product = {}, updateProduct, loading }) => {
	const isReviewProtocolEnabled = !!scData?.review_protocol?.reviews_enabled;

	return (
		<Box
			title={__('Reviews', 'surecart')}
			loading={loading}
			header_action={
				!isReviewProtocolEnabled && (
					<div
						css={css`
							margin: -12px 0;
						`}
					>
						<ScButton
							href={addQueryArgs('admin.php', {
								page: 'sc-settings',
								tab: 'review_protocol',
							})}
							target="_blank"
							type="link"
							size="small"
						>
							{__('Review Settings', 'surecart')}
						</ScButton>
					</div>
				)
			}
			footer={
				!loading &&
				product?.total_reviews > 0 && (
					<StarsBreakdown
						averageStars={product?.average_stars}
						totalReviews={product?.total_reviews}
						reviewsBreakdown={product?.reviews_breakdown}
						productId={product?.id}
					/>
				)
			}
		>
			<ScSwitch
				checked={product?.reviews_enabled}
				onScChange={(e) => {
					updateProduct({
						reviews_enabled: e.target.checked,
					});
				}}
				disabled={!isReviewProtocolEnabled}
			>
				{__('Enable Reviews', 'surecart')}
			</ScSwitch>

			{isReviewProtocolEnabled && !!product?.reviews_enabled && (
				<ScSwitch
					checked={product?.solicit_reviews}
					onScChange={(e) => {
						updateProduct({
							solicit_reviews: e.target.checked,
						});
					}}
				>
					{__('Review request Email', 'surecart')}
					<span slot="description">
						{__(
							'Send automatic review request email to customers who purchase this product.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			)}
		</Box>
	);
};
