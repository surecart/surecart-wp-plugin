/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { QueryPaginationArrowControls } from './query-pagination-arrow-controls';
import { QueryPaginationArrowSizeControl } from './query-pagination-arrow-size-control';

const TEMPLATE = [
	['surecart/cart-order-bump-pagination-previous'],
	['surecart/cart-order-bump-pagination-next'],
];

export default ({
	clientId,
	attributes: { paginationArrow, paginationArrowSize },
	setAttributes,
}) => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	const hasNextPreviousBlocks = useSelect(
		(select) => {
			const { getBlocks } = select(blockEditorStore);
			const innerBlocks = getBlocks(clientId);
			/**
			 * Show the `paginationArrow` and `paginationArrowSize` controls only if a
			 * `CartOrderBumpPaginationNext/Previous` block exists.
			 */
			return innerBlocks?.find((innerBlock) => {
				return [
					'surecart/cart-order-bump-pagination-next',
					'surecart/cart-order-bump-pagination-previous',
				].includes(innerBlock.name);
			});
		},
		[clientId]
	);

	return (
		<>
			{hasNextPreviousBlocks && (
				<InspectorControls>
					<PanelBody title={__('Settings', 'surecart')}>
						<QueryPaginationArrowControls
							value={paginationArrow}
							onChange={(value) => {
								setAttributes({ paginationArrow: value });
							}}
						/>
						<QueryPaginationArrowSizeControl
							value={paginationArrowSize}
							onChange={(value) => {
								setAttributes({ paginationArrowSize: value });
							}}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			<nav {...innerBlocksProps} />
		</>
	);
};
