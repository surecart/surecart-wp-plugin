/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { addSubmenu as icon } from '@wordpress/icons';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Notice,
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
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	ScButton,
	ScCheckoutProductPriceVariantSelector,
} from '@surecart/components-react';
import ModelSelector from '../../../admin/components/ModelSelector';

export default ({ attributes, setAttributes, clientId }) => {
	const { label, product_id, selectorTitle } = attributes;
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

	const { updateBlockAttributes, removeBlock } =
		useDispatch(blockEditorStore);

	const { formClientId, formAttributes } = useSelect(
		(select) => {
			const { getBlockParentsByBlockName } = select(blockEditorStore);
			const parents = getBlockParentsByBlockName(
				clientId,
				'surecart/form'
			);
			const formAttributes = select(blockEditorStore).getBlockAttributes(
				parents[0]
			);
			return { formClientId: parents[0], formAttributes }; // assuming 'surecart/form' is the immediate parent
		},
		[clientId]
	);

	const onAddToForm = () => {
		console.log(
			[
				...formAttributes?.prices,
				{
					id: product?.prices?.data[0]?.id,
					quantity: 1,
				},
			],
			product
		);
		updateBlockAttributes(formClientId, {
			prices: [
				...formAttributes?.prices,
				{
					id: product?.prices?.data[0]?.id,
					quantity: 1,
				},
			],
		});
		removeBlock(clientId);
	};

	const hasMultipleVariants = product?.variants?.data?.length > 1;
	const hasMultiplePrices =
		product?.prices?.data.filter((v) => !v?.archived)?.length > 1;

	if (loadingProduct) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	const renderSelector = () => {
		if (!product_id || !product) {
			return (
				<Placeholder
					label={__('Select A Product', 'surecart')}
					instructions={__(
						'Please select a product with variants and/or prices to display the price selector.',
						'surecart'
					)}
					icon={icon}
				>
					<>
						<div
							css={css`
								width: 100%;
								display: flex;
								--sc-color-primary-500: var(
									--wp-admin-theme-color
								);
								--sc-focus-ring-color-primary: var(
									--wp-admin-theme-color
								);
								--sc-input-border-color-focus: var(
									--wp-admin-theme-color
								);
								--sc-color-primary-text: #fff;
							`}
						>
							<ModelSelector
								name="product"
								placeholder={__('Choose product', 'surecart')}
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
									ad_hoc: false,
									expand: ['variants', 'prices'],
								}}
								renderChoices={(models) => {
									return (
										models
											// model must have more than one price or variant
											.filter(
												(item) =>
													item?.prices?.data?.length >
														1 ||
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
								<ScButton type="primary" slot="trigger">
									{__('Select Product', 'surecart')}
								</ScButton>
							</ModelSelector>
						</div>
					</>
				</Placeholder>
			);
		}

		if (!hasMultiplePrices && !hasMultipleVariants) {
			return (
				<Placeholder>
					<Notice
						isDismissible={false}
						css={css`
							margin: 0;
						`}
						actions={[
							{
								label: 'Add To Form',
								variant: 'primary',
								onClick: onAddToForm,
							},
							{
								label: 'Remove Block',
								onClick: () => removeBlock(clientId),
							},
						]}
					>
						{__(
							'This product does not have any variants or prices to choose from. Add it to the form instead?',
							'surecart'
						)}
					</Notice>
				</Placeholder>
			);
		}

		console.log({ product });

		return (
			<ScCheckoutProductPriceVariantSelector
				product={{
					...product,
					prices: {
						...product.prices,
						data: product.prices.data.filter(
							(price) => !price?.archived
						),
					},
				}}
				selectorTitle={selectorTitle}
				label={label}
			/>
		);
	};

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
							label={__('Selector title', 'surecart')}
							value={selectorTitle}
							onChange={(selectorTitle) =>
								setAttributes({ selectorTitle })
							}
							style={{ width: '100%' }}
						/>
					</PanelRow>
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
			<div {...blockProps}>{renderSelector()}</div>
		</Fragment>
	);
};
