import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
	Spinner,
	Placeholder,
	SelectControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { TEMPLATE } from './template';
import ProductSelector from '../../components/ProductSelector';

export default function ProductListEdit({
	setAttributes,
	attributes: { limit, ids, type },
}) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});
	const { products, loading } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'product',
			{
				archived: false,
				status: ['published'],
				page: 1,
				per_page: limit || 15,
				ids: ids,
			},
		];
		return {
			products: select(coreStore).getEntityRecords(...queryArgs),
			loading: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	});
	const onProductSelect = (product) => {
		setAttributes({
			ids: [...ids, product.id],
		});
	};
	if (loading) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}
	console.log(ids);
	console.log(products);
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<RangeControl
						label={__('Products Per Page', 'surecart')}
						value={limit}
						onChange={(limit) => setAttributes({ limit })}
						step={1}
						min={1}
						max={40}
					/>
				</PanelBody>
				<PanelBody title={__('Products', 'surecart')}>
					<SelectControl
						label={__('Products To Show', 'surecart')}
						value={type}
						options={[
							{
								value: 'all',
								label: __('All Products', 'surecart'),
							},
							{
								value: 'featured',
								label: __('Featured Products', 'surecart'),
							},
							{
								value: 'custom',
								label: __('Hand Pick Products', 'surecart'),
							},
						]}
						onChange={(type) => setAttributes({ type })}
					/>
					{type === 'custom' && (
						<ProductSelector
							onProductSelect={onProductSelect}
							currentSelectedIds={ids}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
}
