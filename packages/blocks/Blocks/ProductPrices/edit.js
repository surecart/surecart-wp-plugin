/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScFormatNumber } from '@surecart/components-react';
import usePostProduct from '../../../admin/hooks/usePostProduct';

export default ({ attributes: { textAlign }, setAttributes }) => {
	const { product } = usePostProduct();

	const prices = product?.prices?.data;
	const price = prices?.[0];
  const blockProps = useBlockProps();

	if (!price) {
		return null;
	}
	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>

			<div {...blockProps}>
				<ScFormatNumber
					type="currency"
					currency={price?.currency}
					value={price?.amount}
				/>
			</div>
		</>
	);
};
