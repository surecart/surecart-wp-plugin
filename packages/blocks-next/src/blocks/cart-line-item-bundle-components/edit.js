import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const { showSingleQuantity = false } = attributes;
	const blockProps = useBlockProps({
		className: 'sc-cart-line-item-bundle-components',
	});

	const previewItems = [
		{ label: __('Mens Watch — Black / Leather', 'surecart'), qty: 2 },
		{ label: __('Mens Cap — Red', 'surecart'), qty: 1 },
		{ label: __('Travel Mug — Olive', 'surecart'), qty: 1 },
	];

	const [expanded, setExpanded] = useState(false);
	const hasOverflow = previewItems.length > 1;
	const visibleItems =
		hasOverflow && !expanded ? previewItems.slice(0, 1) : previewItems;

	const wrapperClassName = [
		'sc-cart-line-item-bundle-components',
		hasOverflow ? 'sc-cart-line-item-bundle-components--clickable' : '',
		expanded ? 'sc-cart-line-item-bundle-components--is-expanded' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Quantity display', 'surecart')}>
					<ToggleControl
						label={__('Show for single items', 'surecart')}
						help={__(
							'When off, "× 1" is hidden so only components with a higher quantity show the multiplier.',
							'surecart'
						)}
						checked={showSingleQuantity}
						onChange={(value) =>
							setAttributes({ showSingleQuantity: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} className={wrapperClassName}>
				<div className="sc-cart-line-item-bundle-components__list">
					{visibleItems.map(({ label, qty }) => {
						const showQty = qty > 1 || showSingleQuantity;
						return (
							<div
								key={label}
								className="sc-cart-line-item-bundle-components__item"
							>
								<span className="sc-cart-line-item-bundle-components__label">
									{label}
								</span>
								{showQty && (
									<span className="sc-cart-line-item-bundle-components__qty">
										× {qty}
									</span>
								)}
							</div>
						);
					})}
				</div>
				{hasOverflow && (
					<button
						type="button"
						className="sc-cart-line-item-bundle-components__toggle"
						aria-expanded={expanded ? 'true' : 'false'}
						aria-label={
							expanded
								? __('Hide bundle items', 'surecart')
								: __('Show all bundle items', 'surecart')
						}
						title={
							expanded
								? __('Hide bundle items', 'surecart')
								: __('Show all bundle items', 'surecart')
						}
						onClick={() => setExpanded(!expanded)}
					>
						<svg
							className="sc-cart-line-item-bundle-components__toggle-icon"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</button>
				)}
			</div>
		</>
	);
};
