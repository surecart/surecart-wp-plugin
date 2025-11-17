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
import InspectorControls from './inspector-controls';

/**
 * Product Review List Edit.
 */
export default function ProductReviewListEdit({
	setAttributes,
	attributes,
	attributes: { query },
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

	/**
	 * Update the query attributes.
	 *
	 * @param {Object} newQuery - The new query object.
	 */
	const updateQuery = (newQuery) => {
		setAttributes({ query: { ...query, ...newQuery } });
	};

	return (
		<>
			<InspectorControls
				attributes={attributes}
				setAttributes={setAttributes}
				onUpdateQuery={updateQuery}
			/>

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
