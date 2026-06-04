import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();

	// Static preview — shows the variant for regular products and the bundle items.
	const previewItems = [
		{ label: __('Mens Watch — Black / Leather', 'surecart'), qty: 1 },
		{ label: __('Mens Cap — Red', 'surecart'), qty: 2 },
	];

	return (
		<div {...blockProps}>
			<div className="sc-cart-line-item-variant__option">
				{__('Small / Red', 'surecart')}
			</div>
			{previewItems.map(({ label, qty }) => (
				<div
					key={label}
					className="sc-cart-line-item-variant__bundle-item"
				>
					<span className="sc-cart-line-item-variant__label">
						{label}
					</span>
					{qty > 1 && (
						<span className="sc-cart-line-item-variant__qty">
							× {qty}
						</span>
					)}
				</div>
			))}
		</div>
	);
};
