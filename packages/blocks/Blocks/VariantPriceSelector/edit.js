/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { edit } from '@wordpress/icons';

/**
 * Component Dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	ScCheckoutProductPriceVariantSelector,
	ScSelect,
} from '@surecart/components-react';
import ProductSelector from './components/ProductSelector';

export default ({ attributes, setAttributes }) => {
	const { label, product_id } = attributes;
	const blockProps = useBlockProps();
	const { products, productChoices, loadingProducts } = useSelect(
		(select) => {
			if (!open) return {};
			const queryArgs = [
				'surecart',
				'product',
				{
					context: 'edit',
					per_page: 50,
				},
			];
			const productsFetched = (
				select(coreStore).getEntityRecords(...queryArgs) || []
			).filter((product) => !!product.variants?.data?.length);

			return {
				products: productsFetched,
				productChoices: productsFetched.map((product) => ({
					label: product.name,
					value: product.id,
				})),
				loadingProducts: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[]
	);

	const product = products.find((product) => product.id === product_id);

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={edit}
						label={__('Change selected product', 'surecart')}
						onClick={() => setAttributes({ product_id: null })}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Price selector label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
							style={{ width: '100%' }}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{!!product_id && !!product ? (
					<ScCheckoutProductPriceVariantSelector
						product={product}
						label={label}
					/>
				) : (
					<ProductSelector
						onSelectProduct={(productId) => {
							setAttributes({ product_id: productId });
						}}
						productChoices={productChoices}
						loadingProducts={loadingProducts}
					/>
				)}
			</div>
		</Fragment>
	);
};
