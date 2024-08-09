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
import ListToolbar from '../../utilities/patterns-toolbar';
import { useEffect } from '@wordpress/element';

export default function ProductListEdit({
	setAttributes,
	attributes,
	attributes: {
		limit,
		ids,
		type,
		query,
		query: { perPage, include, offset },
	},
	name,
	clientId,
	openPatternSelectionModal,
}) {
	const updateQuery = (newQuery) =>
		setAttributes({ query: { ...query, ...newQuery } });

	useEffect(() => {
		updateQuery({
			perPage: limit || perPage,
			include: ids || include,
		});
	}, [limit, ids]);

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	const { records: products, isResolving } = useEntityRecords(
		'postType',
		'sc_product',
		{
			page: 1,
			per_page: perPage,
			include,
		}
	);

	const onProductSelect = (product) => {
		updateQuery({
			include: [...new Set([...query.include, product.id])],
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<RangeControl
						label={__('Products Per Page', 'surecart')}
						value={perPage}
						onChange={(perPage) => updateQuery({ perPage })}
						step={1}
						min={1}
						max={40}
					/>
					<RangeControl
						label={__('Offset', 'surecart')}
						value={offset}
						onChange={(offset) => updateQuery({ offset })}
						step={1}
						min={0}
						max={100}
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
						onChange={(type) => {
							setAttributes({ type });
						}}
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
												updateQuery({
													include:
														query.include.filter(
															(id) =>
																id !==
																product.id
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
								currentSelectedIds={include}
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
