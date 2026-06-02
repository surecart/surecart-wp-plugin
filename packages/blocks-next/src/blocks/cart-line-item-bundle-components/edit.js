import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-cart-line-item-bundle-components',
	});

	const previewItems = [
		{ label: __('Mens Watch — Black / Leather', 'surecart'), qty: 1 },
		{ label: __('Mens Cap — Red', 'surecart'), qty: 2 },
	];

	return (
		<div {...blockProps}>
			<div className="sc-cart-line-item-bundle-components__list">
				{previewItems.map(({ label, qty }) => (
					<div
						key={label}
						className="sc-cart-line-item-bundle-components__item"
					>
						<span className="sc-cart-line-item-bundle-components__label">
							{label}
						</span>
						{qty > 1 && (
							<span className="sc-cart-line-item-bundle-components__qty">
								× {qty}
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
