/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

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

export default ({ className, attributes, setAttributes }) => {
	const { label, product_id } = attributes;
	const blockProps = useBlockProps();
	const { products, productChoices } = useSelect((select) => {
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
	}, []);

	const product = products.find((product) => product.id === product_id);

	return (
		<div className={className}>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
							style={{ width: '100%' }}
						/>
					</PanelRow>
					<PanelRow>
						<ScSelect
							style={{ width: '100%' }}
							search
							label={__('Product', 'surecart')}
							placeholder={__('Select product', 'surecart')}
							choices={productChoices}
							value={product_id}
							onScChange={(e) =>
								setAttributes({
									product_id: e.target.value,
								})
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{!!product_id && !!product ? (
					<ScCheckoutProductPriceVariantSelector product={product} />
				) : (
					<ProductSelector
						onSelectProduct={(productId) => {
							setAttributes({ product_id: productId });
						}}
						productChoices={productChoices}
					/>
				)}
			</div>
		</div>
	);
};
