import { __ } from '@wordpress/i18n';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
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

const TEMPLATE = [['surecart/product-collection-badge']];

export default ({
	attributes,
	setAttributes,
	__unstableLayoutClassNames,
	clientId,
	context: { postId },
}) => {
	const { count } = attributes;

	const { record: post } = useEntityRecord('postType', 'sc_product', postId);

	let collections =
		useSelect(
			(select) =>
				select(coreStore).getEntityRecords(
					'taxonomy',
					'sc_collection',
					{
						include: post?.sc_collection,
						per_page: count,
					}
				),
			post?.sc_collection
		) || [];

	if (collections?.length < count && !post?.id) {
		for (let i = 0; i < count; i++) {
			if (!collections[i]) {
				collections.push({ name: `Collection ${i + 1}`, id: i });
			}
		}
	}

	collections = collections.slice(0, count).map((collection) => ({
		...collection,
		'surecart/productCollectionTag/name': collection.name,
	}));

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<PanelRow>
						<NumberControl
							label={__('Number To Display', 'surecart')}
							value={count}
							onChange={(count) =>
								setAttributes({ count: parseInt(count) })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={collections}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={false}
			/>
		</Fragment>
	);
};
