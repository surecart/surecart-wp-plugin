import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import TemplateListEdit from '../../components/TemplateListEdit';

/**
 * Component Dependencies
 */
import { useSelect } from '@wordpress/data';

const FALLBACK_COLLECTIONS = [
	{ id: '1', name: 'Collection' },
	{ id: '2', name: 'Collection 2' },
	{ id: '3', name: 'Collection 3' },
];

const TEMPLATE = [['surecart/product-collection-badge']];

export default ({
	attributes,
	setAttributes,
	__unstableLayoutClassNames,
	clientId,
}) => {
	const { count } = attributes;

	const getCollections = () => {
		let collections = useSelect((select) =>
			select(coreStore).getEntityRecords('surecart', 'product-collection')
		);

		if (!collections?.length) {
			collections = FALLBACK_COLLECTIONS;
		}

		return collections.slice(0, count).map((collection) => ({
			...collection,
			'surecart/productCollectionBadge/name': collection.name,
		}));
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<PanelRow>
						<NumberControl
							label={__('Number To Display', 'surecart')}
							value={count}
							onChange={(count) => setAttributes({ count })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={getCollections()}
				className={__unstableLayoutClassNames}
				clientId={clientId}
			/>
		</Fragment>
	);
};
