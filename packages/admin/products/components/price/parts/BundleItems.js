/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	ScCard,
	ScFormControl,
	ScSpinner,
	ScStackedList,
	ScSwitch,
} from '@surecart/components-react';
import DrawerSection from '../../../../ui/DrawerSection';
import PriceSelector from '@admin/components/PriceSelector';
import BundleItemRow from './BundleItemRow';

/**
 * Bundle Items section shown inside the price editor drawer.
 * Uses PriceSelector dropdown (same as Swap/Price Boost) — no modal needed.
 */
const BundleItems = ({ price, updatePrice }) => {
	const [bundleItems, setBundleItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	// Fetch bundle items when bundle is enabled and price has an ID.
	useEffect(() => {
		if (!price?.bundle || !price?.id) {
			setBundleItems([]);
			return;
		}
		fetchBundleItems();
	}, [price?.id, price?.bundle]);

	const fetchBundleItems = async () => {
		try {
			setLoading(true);
			const result = await apiFetch({
				path: addQueryArgs('surecart/v1/bundle_items', {
					bundle_price_ids: [price.id],
					expand: ['price', 'product', 'variant', 'price.product'],
					per_page: 100,
				}),
			});
			setBundleItems(result?.data || result || []);
		} catch (e) {
			console.error('Failed to fetch bundle items:', e);
		} finally {
			setLoading(false);
		}
	};

	const addBundleItem = async (priceId) => {
		try {
			setSaving(true);
			await apiFetch({
				path: 'surecart/v1/bundle_items',
				method: 'POST',
				data: {
					bundle_item: {
						bundle_price: price.id,
						price: priceId,
						quantity: 1,
					},
				},
			});
			await fetchBundleItems();
		} catch (e) {
			console.error('Failed to add bundle item:', e);
		} finally {
			setSaving(false);
		}
	};

	const updateBundleItem = async (id, data) => {
		try {
			setSaving(true);
			await apiFetch({
				path: `surecart/v1/bundle_items/${id}`,
				method: 'PATCH',
				data: {
					bundle_item: data,
				},
			});
			await fetchBundleItems();
		} catch (e) {
			console.error('Failed to update bundle item:', e);
		} finally {
			setSaving(false);
		}
	};

	const removeBundleItem = async (id) => {
		const confirmed = confirm(
			__('Remove this item from the bundle?', 'surecart')
		);
		if (!confirmed) return;

		try {
			setSaving(true);
			await apiFetch({
				path: `surecart/v1/bundle_items/${id}`,
				method: 'DELETE',
			});
			await fetchBundleItems();
		} catch (e) {
			console.error('Failed to remove bundle item:', e);
		} finally {
			setSaving(false);
		}
	};

	// Exclude prices already in the bundle from the selector.
	const excludedPriceIds = bundleItems
		.map((item) => item?.price?.id)
		.filter(Boolean);

	// Also exclude the bundle price itself.
	if (price?.id) {
		excludedPriceIds.push(price.id);
	}

	return (
		<DrawerSection
			title={__('Bundle', 'surecart')}
			description={
				price?.bundle
					? __('Add products included in this bundle.', 'surecart')
					: ''
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-medium);
				`}
			>
				<ScSwitch
					checked={!!price?.bundle}
					onScChange={(e) => {
						updatePrice({ bundle: e.target.checked });
					}}
				>
					{__('This is a bundle price', 'surecart')}
				</ScSwitch>

				{!!price?.bundle && (
					<>
						{loading ? (
							<div
								css={css`
									display: flex;
									align-items: center;
									justify-content: center;
									padding: var(--sc-spacing-large);
								`}
							>
								<ScSpinner />
							</div>
						) : (
							<>
								{/* Selected bundle items */}
								{bundleItems.length > 0 && (
									<ScStackedList>
										<ScCard noPadding>
											{bundleItems.map((item) => (
												<BundleItemRow
													key={item.id}
													item={item}
													onUpdate={(data) =>
														updateBundleItem(
															item.id,
															data
														)
													}
													onRemove={() =>
														removeBundleItem(
															item.id
														)
													}
												/>
											))}
										</ScCard>
									</ScStackedList>
								)}

								{/* Price selector dropdown — same as Swap */}
								<ScFormControl
									label={__('Add Item', 'surecart')}
									help={__(
										'Search and select a price to add to this bundle.',
										'surecart'
									)}
								>
									<PriceSelector
										onSelect={({ price_id }) => {
											if (price_id) {
												addBundleItem(price_id);
											}
										}}
										requestQuery={{
											archived: false,
										}}
										includeVariants={false}
										variable={false}
										ad_hoc={false}
										placement="top-start"
										position="top-left"
										exclude={excludedPriceIds}
										loading={saving}
									/>
								</ScFormControl>
							</>
						)}
					</>
				)}
			</div>
		</DrawerSection>
	);
};

export default BundleItems;
