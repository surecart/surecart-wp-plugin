/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { getQueryArg } from '@wordpress/url';
import { ScProduct } from '@surecart/components-react';

export default () => {
	const productId = getQueryArg(window.location.href, 'product');

	const { product, loading } = useSelect(
		(select) => {
			if (!productId) {
				const queryArgs = [
					'root',
					'product',
					{
						expand: ['prices'],
						per_page: 1,
					},
				];
				return {
					product: select(coreStore).getEntityRecords(
						...queryArgs
					)?.[0],
					loading: select(coreStore).isResolving(
						'getEntityRecords',
						queryArgs
					),
				};
			}

			const queryArgs = [
				'root',
				'product',
				productId,
				{
					expand: ['prices'],
				},
			];
			return {
				product: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[productId]
	);

	const blockProps = useBlockProps({
		product,
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps);

	return <ScProduct {...innerBlocksProps} />;
};
