/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';
import {
	useBlockProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker,
} from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const BLANK = [
	[
		'surecart/product-template',
		{
			style: {
				spacing: { blockGap: '30px' },
			},
			layout: {
				type: 'grid',
				columnCount: 4,
			},
		},
	],
	['surecart/product-pagination'],
];

/**
 * Internal dependencies
 */
import { useBlockNameForPatterns } from '../utils';

export default function QueryPlaceholder({
	attributes,
	clientId,
	name,
	openPatternSelectionModal,
}) {
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);
	const blockProps = useBlockProps();
	const blockNameForPatterns = useBlockNameForPatterns(
		clientId,
		attributes,
		name
	);

	const { blockType, activeBlockVariation, hasPatterns } = useSelect(
		(select) => {
			const { getActiveBlockVariation, getBlockType } =
				select(blocksStore);
			const { getBlockRootClientId, getPatternsByBlockTypes } =
				select(blockEditorStore);
			const rootClientId = getBlockRootClientId(clientId);
			return {
				blockType: getBlockType(name),
				activeBlockVariation: getActiveBlockVariation(name, attributes),
				hasPatterns: !!getPatternsByBlockTypes(
					blockNameForPatterns,
					rootClientId
				).length,
			};
		},
		[name, blockNameForPatterns, clientId, attributes]
	);
	const icon =
		activeBlockVariation?.icon?.src ||
		activeBlockVariation?.icon ||
		blockType?.icon?.src;
	const label = activeBlockVariation?.title || blockType?.title;
	return (
		<div {...blockProps}>
			<Placeholder
				icon={icon}
				label={label}
				instructions={__(
					'Choose a pattern for the product list or start with a basic layout.'
				)}
			>
				{!!hasPatterns && (
					<Button
						variant="primary"
						onClick={openPatternSelectionModal}
					>
						{__('Choose', 'surecart')}
					</Button>
				)}

				<Button
					variant="secondary"
					onClick={() => {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(BLANK),
							false
						);
					}}
				>
					{__('Start basic', 'surecart')}
				</Button>
			</Placeholder>
		</div>
	);
}
