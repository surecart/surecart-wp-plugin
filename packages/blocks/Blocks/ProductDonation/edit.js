import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import { productDonationStore } from '@surecart/components';
import {
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import SelectModel from '../../../admin/components/SelectModel';

import { ScButton, ScIcon } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';

const TEMPLATE = [
	['surecart/product-donation-amounts'],
	['surecart/product-donation-prices'],
];

export default ({ attributes, setAttributes }) => {
	const [query, setQuery] = useState(null);

	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					query,
					archived: false,
					ad_hoc: true,
					expand: ['prices'],
				},
			];
			return {
				products: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	const { product_id } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'surecart/product-donation-amounts',
			'surecart/product-donation-prices',
		],
		renderAppender: InnerBlocks.ButtonBlockAppender,
		template: TEMPLATE,
		templateLock: {
			remove: true,
		},
	});

	const product = useSelect(
		(select) => {
			return select(coreStore).getEntityRecord(
				'surecart',
				'product',
				product_id,
				{ expand: ['prices'] }
			);
		},
		[product_id]
	);

	productDonationStore.state[product_id] = {
		product,
		amounts: product?.prices?.data.map((price) => price?.amount),
		ad_hoc_amount: product?.prices?.data[0]?.amount,
		selectedPrice: product?.prices?.data[0],
	};

	if (!product_id) {
		return (
			<div {...blockProps}>
				<Placeholder
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							style={{ fill: 'none' }}
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
							<circle cx="12" cy="12" r="3"></circle>
						</svg>
					}
					label={__('Select a Product', 'surecart')}
					instructions={__(
						'Select a product to display donation choices according to the prices of the product.',
						'surecart'
					)}
				>
					<SelectModel
						choices={(products || []).map((product) => ({
							label: product.name,
							value: product.id,
						}))}
						onQuery={setQuery}
						onFetch={() => setQuery('')}
						loading={loading}
						onSelect={(product_id) => setAttributes({ product_id })}
						style={{ width: '100%' }}
					>
						<ScButton slot="trigger" type="primary">
							<ScIcon name="plus" slot="prefix" />
							{__('Select Product', 'surecart')}
						</ScButton>
					</SelectModel>
				</Placeholder>
			</div>
		);
	}

	return <div {...innerBlocksProps}></div>;
};
