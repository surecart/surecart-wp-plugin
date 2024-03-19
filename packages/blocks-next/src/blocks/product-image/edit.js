import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({
	attributes: { sizing },
	context: { 'surecart/productId': productId },
}) => {
	const classes = classnames({
		'product-img': true,
		is_contained: sizing === 'contain',
		is_covered: sizing === 'cover',
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	const product = useSelect(
		(select) => {
			if (!productId) {
				return null;
			}
			return select(coreStore).getEntityRecord(
				'surecart',
				'product',
				productId
			);
		},
		[productId]
	);

	const alt = product?.featured_media?.alt || '';
	const title = product?.featured_media?.title || '';

	return (
		<div {...blockProps}>
			{!!product?.featured_media?.src ? (
				<img
					src={product?.featured_media?.src}
					alt={alt}
					{...(title ? { title } : {})}
				/>
			) : (
				<div class="product-img_placeholder" />
			)}
		</div>
	);
};
