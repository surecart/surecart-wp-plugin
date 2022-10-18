/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScCartForm } from '@surecart/components-react';
import {
	useInnerBlocksProps,
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import usePostProduct from '../../../admin/hooks/usePostProduct';

export default ({ clientId }) => {
	const { product } = usePostProduct();

	const hasChildBlocks = useSelect(
		(select) => {
			const { getBlockOrder } = select(blockEditorStore);
			return getBlockOrder(clientId).length > 0;
		},
		[clientId]
	);

	const blockProps = useBlockProps({
		product: product,
		prices: product?.prices?.data,
		css: css`
			display: block;
			.block-list-appender {
				position: relative;
			}
		`,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<div {...blockProps}>
			<ScCartForm {...innerBlocksProps}></ScCartForm>
		</div>
	);
};
