/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { 'surecart/bundleItem': bundleItem } }) => {
	const image = bundleItem?.product?.image;

	if (image?.src) {
		return (
			<img
				{...useBlockProps({ className: 'sc-bundle-item__image' })}
				src={image.src}
				alt={bundleItem?.product?.name || ''}
			/>
		);
	}

	return (
		<div
			{...useBlockProps({ className: 'sc-bundle-item__image-placeholder' })}
		/>
	);
};
