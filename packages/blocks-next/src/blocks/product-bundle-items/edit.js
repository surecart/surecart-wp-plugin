/**
 * WordPress dependencies
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

/**
 * Dummy bundle items shown in the editor when no real data exists.
 * Same pattern as TEST_VARIANTS in product-variant-pills.
 */
const DUMMY_BUNDLE_ITEMS = [
	{
		id: 'dummy-1',
		product: { name: __( 'Premium WordPress Theme', 'surecart' ) },
		quantity: 1,
	},
	{
		id: 'dummy-2',
		product: { name: __( 'SEO Toolkit Plugin', 'surecart' ) },
		variant: { name: __( 'Pro', 'surecart' ) },
		quantity: 1,
	},
	{
		id: 'dummy-3',
		product: { name: __( 'Stock Photo Pack', 'surecart' ) },
		quantity: 2,
	},
];

export default ({ attributes, setAttributes, context: { postId } }) => {
	const blockProps = useBlockProps();

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	// Get real bundle items from the initial price, fall back to dummy data.
	const initialPrice = (product?.prices?.data || []).find((p) => !p.archived);
	const realBundleItems =
		initialPrice?.bundle && initialPrice?.bundle_items?.data?.length
			? initialPrice.bundle_items.data
			: null;
	const bundleItems = realBundleItems || DUMMY_BUNDLE_ITEMS;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Title', 'surecart')}
						value={attributes.title}
						onChange={(title) => setAttributes({ title })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sc-bundle-items">
					{!!attributes.title && (
						<div className="sc-bundle-items__title">
							{attributes.title}
						</div>
					)}

					<ul className="sc-bundle-items__list">
						{bundleItems.map((item) => {
							const name =
								item.product?.name ||
								item.price?.name ||
								__('Component', 'surecart');
							const variantName = item.variant?.name || '';
							const quantity = item.quantity ?? 1;

							return (
								<li
									key={item.id}
									className="sc-bundle-items__item"
								>
									<div className="sc-bundle-items__item-image-placeholder" />

									<div className="sc-bundle-items__item-info">
										<span className="sc-bundle-items__item-name">
											{name}
										</span>
										{!!variantName && (
											<span className="sc-bundle-items__item-variant">
												{variantName}
											</span>
										)}
									</div>

									{quantity > 1 && (
										<span className="sc-bundle-items__item-qty">
											&times; {quantity}
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</>
	);
};
