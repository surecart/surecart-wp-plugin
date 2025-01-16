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
import { TEMPLATE } from './template';
import ProductListInspectorControls from './inspector-controls';
import ListToolbar from '../../utilities/patterns-toolbar';
import { useEffect } from '@wordpress/element';

/**
 * Product List Edit
 */
export default function ProductListEdit({
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
	 * Update the query attributes.
	 *
	 * @param {Object} newQuery - The new query object.
	 */
	const updateQuery = (newQuery) => {
		setAttributes({ query: { ...query, ...newQuery } });
	};

	/**
	 * Migration from < v3.0.0
	 */
	useEffect(() => {
		updateQuery({
			perPage: limit || perPage,
			include: ids?.length ? ids : include,
		});
		setAttributes({ limit: null });
	}, [limit, ids]);

	/**
	 * Block props.
	 */
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return (
		<>
			<ProductListInspectorControls
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
