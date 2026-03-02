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
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSwitch,
} from '@surecart/components-react';
import useEntity from '../../../hooks/useEntity';

export default ({ product, updateProduct, loading }) => {
	const {
		item: { reviews_enabled: isReviewProtocolEnabled },
	} = useEntity('store', 'review_protocol');

	return (
		<Box
			title={__('Reviews', 'surecart')}
			loading={loading}
			header_action={
				<ScDropdown placement="bottom-end">
					<ScButton
						circle
						type="text"
						style={{
							'--button-color': 'var(--sc-color-gray-600)',
							margin: '-10px',
						}}
						slot="trigger"
					>
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem
							href={addQueryArgs('admin.php', {
								page: 'sc-settings',
								tab: 'review_protocol',
							})}
							target="_blank"
						>
							<ScIcon
								slot="prefix"
								name="external-link"
								style={{
									opacity: 0.5,
								}}
							/>
							{__('Global Settings', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
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
				checked={isReviewProtocolEnabled && !!product?.reviews_enabled}
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
					{__('Review Request Email', 'surecart')}
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
