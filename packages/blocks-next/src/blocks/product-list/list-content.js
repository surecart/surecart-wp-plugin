import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
	Spinner,
	SelectControl,
} from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { TEMPLATE } from './template';
import ProductSelector from '../../components/ProductSelector';
import ProductListInspectorControls from './inspector-controls';
import Icon from '../../components/Icon';
import ListToolbar from '../../utilities/patterns-toolbar';
import { useEffect } from '@wordpress/element';

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
	const updateQuery = (newQuery) => {
		setAttributes({ query: { ...query, ...newQuery } });
	};

	// migration.
	useEffect(() => {
		updateQuery({
			perPage: limit || perPage,
			include: ids?.length ? ids : include,
		});
	}, [limit, ids]);

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
