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
import { ScButton, ScIcon } from '@surecart/components-react';

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
		<Box
			title={__('Reviews', 'surecart')}
			loading={loadingProtocol || loading}
			footer={
				<>
					<ScButton
						size="small"
						type="link"
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
				<PanelRow css={{ justifyContent: 'space-between', gap: 10 }}>
					<span>
						{__('Enable Reviews on this product', 'surecart')}
					</span>
					<ToggleControl
						__nextHasNoMarginBottom={true}
						checked={product?.reviews_enabled || false}
						onChange={(value) => {
							updateProduct({ reviews_enabled: value });
						}}
						disabled={loading || !reviewProtocol?.reviews_enabled}
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
		</Box>
	);
};
