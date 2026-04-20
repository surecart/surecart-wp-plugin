/**
 * WordPress dependencies
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [
	[
		'surecart/bundle-item-template',
		{
			layout: {
				type: 'flex',
				justifyContent: 'left',
				flexWrap: 'nowrap',
			},
		},
	],
];

const DUMMY_BUNDLE_ITEMS = [
	{
		id: 'dummy-1',
		'surecart/bundleItem': {
			product: { name: __('Premium WordPress Theme', 'surecart') },
			price: { display_amount: '$49' },
			variant: null,
			quantity: 1,
		},
	},
	{
		id: 'dummy-2',
		'surecart/bundleItem': {
			product: { name: __('SEO Toolkit Plugin', 'surecart') },
			price: { display_amount: '$29' },
			variant: { name: __('Pro', 'surecart') },
			quantity: 1,
		},
	},
	{
		id: 'dummy-3',
		'surecart/bundleItem': {
			product: { name: __('Stock Photo Pack', 'surecart') },
			price: { display_amount: '$19' },
			variant: null,
			quantity: 2,
		},
	},
];

export default ({ attributes, setAttributes, clientId, context: { postId } }) => {
	const blockProps = useBlockProps();

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	// Build blockContexts from real data or fall back to dummy data.
	const initialPrice = (product?.prices?.data || []).find((p) => !p.archived);
	const realItems =
		initialPrice?.bundle && initialPrice?.bundle_items?.data?.length
			? initialPrice.bundle_items.data
			: null;

	const blockContexts = realItems
		? realItems.map((item) => ({
				id: item.id,
				'surecart/bundleItem': {
					product: item.product || {},
					price: item.price || {},
					variant: item.variant || null,
					quantity: item.quantity ?? 1,
				},
		  }))
		: DUMMY_BUNDLE_ITEMS;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Title', 'surecart')}
						value={attributes.title}
						onChange={(title) => setAttributes({ title })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sc-bundle-items">
					{!!attributes.title && (
						<div className="sc-bundle-items__title">
							{attributes.title}
						</div>
					)}

					<TemplateListEdit
						template={TEMPLATE}
						blockContexts={blockContexts}
						className="sc-bundle-items__list"
						clientId={clientId}
						renderAppender={false}
						attachBlockProps={false}
					/>
				</div>
			</div>
		</>
	);
};
