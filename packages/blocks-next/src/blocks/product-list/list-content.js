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
import { useSelect } from '@wordpress/data';

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
	}, [limit, ids]);

	const sortBlock = useSelect((select) => {
		const blocks = select('core/block-editor').getBlocksByName(
			'surecart/product-list-sort'
		);
		return blocks.length
			? select('core/block-editor').getBlock(blocks[0])
			: null;
	}, []);

	useEffect(() => {
		if (!sortBlock || !sortBlock?.attributes?.sort_default) {
			return;
		}
		const sort = sortBlock?.attributes?.sort_default.split(':');
		if (
			!sort[0] ||
			!sort[1] ||
			(query.order === sort[1] && query.orderBy === sort[0])
		) {
			return;
		}
		updateQuery({
			order: sort[1],
			orderBy: sort[0],
		});
	}, [sortBlock, query]);

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
