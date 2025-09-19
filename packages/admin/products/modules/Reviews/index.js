/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import { ScSwitch } from '@surecart/components-react';
import StarsBreakdown from './StarsBreakdown';
import useEntity from '../../../hooks/useEntity';

export default ({ product = {}, updateProduct, loading }) => {
	// TODO: Remove once account api has been updated with review_protocol
	// and use like scData?.review_protocol instead.
	const { item: reviewProtocol } = useEntity('store', 'review_protocol');

	// Don't show if reviews are not enabled globally.
	if (!reviewProtocol?.reviews_enabled) {
		return null;
	}

	return (
		<Box
			title={__('Reviews', 'surecart')}
			loading={loading}
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
			>
				{__('Enable Reviews', 'surecart')}
			</ScSwitch>

			{product?.reviews_enabled && (
				<ScSwitch
					checked={product?.solicit_reviews}
					onScChange={(e) => {
						updateProduct({
							solicit_reviews: e.target.checked,
						});
					}}
				>
					{__('Review request', 'surecart')}
					<span slot="description">
						{__(
							'Send automatic review emails to customers who purchase this product.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			)}
		</Box>
	);
};
