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
import Icon from '../../components/Icon';
import ListToolbar from './list-toolbar';

export default function ProductListEdit({
	setAttributes,
	attributes: { limit, ids, type },
	name,
	clientId,
	openPatternSelectionModal,
}) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	const { records: products, isResolving } = useEntityRecords(
		'postType',
		'sc_product',
		{
			page: 1,
			per_page: limit,
			include: ids,
		}
	);

	const onProductSelect = (product) => {
		setAttributes({
			ids: [...ids, product.id],
		});
	};

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
						<>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									width: '100%',
									gap: '0.5em',
									marginBottom: '1em',
								}}
							>
								{isResolving && <Spinner />}
								{products?.map((product) => {
									return (
										<div
											className="sc-tag sc-tag--default sc-tag--medium"
											key={product.id}
											onClick={() => {
												setAttributes({
													ids: ids.filter(
														(id) =>
															id !== product.id
													),
												});
											}}
											style={{
												cursor: 'pointer',
											}}
										>
											<span className="tag__content">
												{product?.title?.raw}
											</span>
											<Icon
												name="x"
												className="sc-tag__clear"
												aria-label={__(
													'Remove tag',
													'surecart'
												)}
											/>
										</div>
									);
								})}
							</div>
							<ProductSelector
								onProductSelect={onProductSelect}
								currentSelectedIds={ids}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
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
