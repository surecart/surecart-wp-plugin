import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-cart-line-item-bundle-components',
	});

	// Static editor preview — the live cart renders the real bundle components.
	const previewItems = [
		__('Mens Watch — Black / Leather', 'surecart'),
		__('Mens Sunglass', 'surecart'),
	];

	return (
		<div {...blockProps}>
			{previewItems.map((item) => (
				<div
					key={item}
					className="sc-cart-line-item-bundle-components__item"
				>
					{item}
				</div>
			))}
		</div>
	);
};
