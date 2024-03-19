import {
	useBlockProps,
} from '@wordpress/block-editor';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { Spinner, Placeholder } from '@wordpress/components';
import { getImageSrc, getFeaturedProductMediaAttributes } from '../../utilities/product-image';

export default ({ attributes: { sizing }, context: { 'surecart/productId': productId } }) => {

	const classes = classnames({
		'product-img': true,
		'is_contained': sizing === 'contain',
		'is_covered': sizing === 'cover',
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	const { product, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				productId,
			];
			return {
				product: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		}
	);
	
	if (loading) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}
	
	const alt = product?.featured_media?.alt || '';
	const title = product?.featured_media?.title || '';

	return (
		<div {...blockProps}>
			{!!getImageSrc(product) ? <img src={getImageSrc(product)} alt={alt} {...(title ? { title } : {})} /> : <div class="product-img_placeholder" />}
		</div>
	);
};
