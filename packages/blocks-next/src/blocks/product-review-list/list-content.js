/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import {
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { TEMPLATE } from './template';
import ListToolbar from '../../utilities/patterns-toolbar';

/**
 * Product List Edit
 */
export default function ProductReviewListEdit({
	setAttributes,
	attributes,
	attributes: {
		limit,
		ids,
		query,
		query: { perPage, include },
	},
	name,
	clientId,
	openPatternSelectionModal,
}) {
	/**
	 * Block props.
	 */
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return (
		<>
			<BlockControls>
				<ListToolbar
					name={name}
					clientId={clientId}
					openPatternSelectionModal={openPatternSelectionModal}
				/>
			</BlockControls>

			<div {...innerBlocksProps} />
		</>
	);
}
