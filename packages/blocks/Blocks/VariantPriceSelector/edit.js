/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { list as icon } from '@wordpress/icons';

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
	Button,
	PanelBody,
	PanelRow,
	Placeholder,
	Spinner,
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
import { ScCheckoutProductPriceVariantSelector } from '@surecart/components-react';
import ModelSelector from '../../../admin/components/ModelSelector';

export default ({ attributes, setAttributes }) => {
	const { label, product_id } = attributes;
	const blockProps = useBlockProps();

	const { product, loadingProduct } = useSelect(
		(select) => {
			if (!product_id)
				return {
					product: null,
					loadingProduct: false,
				};

			const queryArgs = ['surecart', 'product', product_id];

			return {
				product: select(coreStore).getEntityRecord(...queryArgs),
				loadingProduct: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[product_id]
	);

	if (loadingProduct) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

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
						product={{
							...product,
							variant_options: {
								data: product.variant_options || [],
							},
							variants: {
								data: product.variants || [],
							},
						}}
						label={label}
					/>
				) : (
					<Placeholder
						label={__('Select a product', 'surecart')}
						instructions={__(
							'Please select a product with variants and/or prices. The product for this block must have more than one variant or price to select from.',
							'surecart'
						)}
						icon={icon}
					>
						<>
							<div
								css={css`
									width: 100%;
									display: flex;
									margin-bottom: var(--sc-spacing-medium);
									--sc-color-primary-500: var(
										--wp-admin-theme-color
									);
									--sc-focus-ring-color-primary: var(
										--wp-admin-theme-color
									);
									--sc-input-border-color-focus: var(
										--wp-admin-theme-color
									);
									--sc-color-primary-text: '#fff';
								`}
							>
								<ModelSelector
									name="product"
									placeholder={__(
										'Choose product',
										'surecart'
									)}
									css={css`
										width: 100%;
									`}
									onScChange={(e) => {
										setAttributes({
											product_id: e.target.value,
										});
									}}
									requestQuery={{
										archived: false,
										expand: ['variants', 'prices'],
									}}
									renderChoices={(models) => {
										return (
											models
												// model must have more than one price or variant
												.filter(
													(item) =>
														item?.prices?.data
															?.length > 1 ||
														item?.variants?.data
															?.length > 1
												)
												.map((item) => ({
													label: item.name,
													value: item.id,
												}))
										);
									}}
								>
									<Button
										variant="primary"
										css={css`
											width: auto;
										`}
										slot="trigger"
									>
										{__('Select Product', 'surecart')}
									</Button>
								</ModelSelector>
							</div>
						</>
					</Placeholder>
				)}
			</div>
		</Fragment>
	);
};
