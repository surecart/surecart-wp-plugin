/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import { ScSwitch, ScInput, ScIcon } from '@surecart/components-react';

const ReviewProtocolSettings = () => {
	const [error, setError] = useState(null);
	const { save } = useSave();

	const {
		item: reviewProtocolItem,
		itemError: reviewProtocolItemError,
		editItem: editReviewProtocolItem,
		hasLoadedItem: hasLoadedReviewProtocolItem,
	} = useEntity('store', 'review_protocol');

	const [hideVerifiedBadge, setHideVerifiedBadge] = useEntityProp(
		'root',
		'site',
		'surecart_hide_verified_buyer_badge'
	);

	const onSubmit = async () => {
		setError(null);
		try {
			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<SettingsTemplate
			title={__('Product Reviews', 'surecart')}
			icon={<ScIcon name="star"></ScIcon>}
			onSubmit={onSubmit}
		>
			<Error
				error={reviewProtocolItemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Product Reviews Settings', 'surecart')}
				description={__(
					'Configure how product reviews work and how review requests are sent to customers.',
					'surecart'
				)}
				loading={!hasLoadedReviewProtocolItem}
			>
				<ScSwitch
					checked={reviewProtocolItem?.reviews_enabled}
					onClick={(e) => {
						e.preventDefault();
						editReviewProtocolItem({
							reviews_enabled:
								!reviewProtocolItem?.reviews_enabled,
						});
					}}
				>
					{__('Product Reviews', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Allow customers to leave reviews on your products. Reviews must also be enabled at the product level.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{reviewProtocolItem?.reviews_enabled && (
					<>
						<ScSwitch
							checked={reviewProtocolItem?.solicit_reviews}
							onClick={(e) => {
								e.preventDefault();
								editReviewProtocolItem({
									solicit_reviews:
										!reviewProtocolItem?.solicit_reviews,
								});
							}}
						>
							{__('Send Review Request Emails', 'surecart')}
							<span
								slot="description"
								style={{ lineHeight: '1.4' }}
							>
								{__(
									'Automatically send review request emails after an order is fulfilled.',
									'surecart'
								)}
							</span>
						</ScSwitch>

						{reviewProtocolItem?.solicit_reviews && (
							<ScInput
								label={__(
									'When should we send the review request?',
									'surecart'
								)}
								help={__(
									'Choose how many days after an order is marked as fulfilled to send the review request. Most stores use 3–14 days.',
									'surecart'
								)}
								type="number"
								min="1"
								max="365"
								value={
									reviewProtocolItem?.solicit_reviews_after_days ||
									7
								}
								onScInput={(e) => {
									e.preventDefault();
									editReviewProtocolItem({
										solicit_reviews_after_days:
											parseInt(e.target.value) || 7,
									});
								}}
							>
								<span slot="suffix">
									{__('days', 'surecart')}
								</span>
							</ScInput>
						)}

						<ScSwitch
							checked={!hideVerifiedBadge}
							onClick={(e) => {
								e.preventDefault();
								setHideVerifiedBadge(!hideVerifiedBadge);
							}}
						>
							{__('Verified Buyer Badge', 'surecart')}
							<span
								slot="description"
								style={{ lineHeight: '1.4' }}
							>
								{__(
									'Display a "Verified Buyer" badge on reviews from customers who purchased the product.',
									'surecart'
								)}
							</span>
						</ScSwitch>
					</>
				)}
			</SettingsBox>
		</SettingsTemplate>
	);
};

export default ReviewProtocolSettings;
