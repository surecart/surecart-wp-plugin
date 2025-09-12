/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

export default ({ product = {}, updateProduct, loading }) => {
	const [reviewProtocol, setReviewProtocol] = useState({});
	const [loadingProtocol, setLoadingProtocol] = useState(true);


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

	// Don't show if reviews are not enabled globally.
	if (loadingProtocol || !reviewProtocol?.reviews_enabled) {
		return null;
	}

	return (
		<sc-dashboard-module
			class="product-reviews"
			heading={__('Reviews', 'surecart')}
			style={{ '--sc-dashboard-module-spacing': '1em' }}
		>
			<sc-card style={{ '--sc-card-padding': '1em' }}>
				<sc-flex direction="column" style={{ '--sc-flex-column-gap': '1em' }}>
					<ToggleControl
						label={__('Enable Reviews', 'surecart')}
						help={__('Allow customers to leave reviews for this product.', 'surecart')}
						checked={product?.reviews_enabled || false}
						onChange={(value) => {
							updateProduct({ reviews_enabled: value });
						}}
						disabled={loading}
					/>

					{product?.reviews_enabled && reviewProtocol?.solicit_reviews && (
						<ToggleControl
							label={__('Solicit Reviews', 'surecart')}
							help={__('Send automatic review request emails to customers who purchase this product.', 'surecart')}
							checked={product?.solicit_reviews || false}
							onChange={(value) => {
								updateProduct({ solicit_reviews: value });
							}}
							disabled={loading}
						/>
					)}
				</sc-flex>
			</sc-card>
		</sc-dashboard-module>
	);
};