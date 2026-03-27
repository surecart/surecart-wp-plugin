import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import { QueryPaginationArrowControls } from './query-pagination-arrow-controls';
import { QueryPaginationLabelControl } from './query-pagination-label-control';

const TEMPLATE = [
	['surecart/product-pagination-previous'],
	['surecart/product-pagination-numbers'],
	['surecart/product-pagination-next'],
];

export default ({
	clientId,
	attributes: { paginationArrow, showLabel },
	setAttributes,
	context,
}) => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	// Always show label text if paginationArrow is set to 'none'.
	useEffect(() => {
		if (paginationArrow === 'none' && !showLabel) {
			setAttributes({ showLabel: true });
		}
	}, [paginationArrow, setAttributes, showLabel]);

	const hasNextPreviousBlocks = useSelect(
		(select) => {
			const { getBlocks } = select(blockEditorStore);
			const innerBlocks = getBlocks(clientId);
			/**
			 * Show the `paginationArrow` and `showLabel` controls only if a
			 * `ProductPaginationNext/Previous` block exists.
			 */
			return innerBlocks?.find((innerBlock) => {
				return [
					'surecart/product-pagination-next',
					'surecart/product-pagination-previous',
				].includes(innerBlock.name);
			});
		},
		[clientId]
	);

	if (context?.query?.pages === 1) {
		return null;
	}

	return (
		<>
			{hasNextPreviousBlocks && (
				<InspectorControls>
					<PanelBody title={__('Settings')}>
						<QueryPaginationArrowControls
							value={paginationArrow}
							onChange={(value) => {
								setAttributes({ paginationArrow: value });
							}}
						/>
						{paginationArrow !== 'none' && (
							<QueryPaginationLabelControl
								value={showLabel}
								onChange={(value) => {
									setAttributes({ showLabel: value });
								}}
							/>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			<nav {...innerBlocksProps} />
		</>
	);
};
