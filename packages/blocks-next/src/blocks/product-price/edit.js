import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { Spinner, Placeholder } from '@wordpress/components';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { getProductDisplayPrice } from '../../utilities/product-price';

export default ({ attributes: {range}, setAttributes, context: { 'surecart/productId': productId }, }) => {
	const blockProps = useBlockProps({
		className: 'product-price',
	});

	const { product, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				productId,
			];
			return {
				product: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		}
	);

	if (loading) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Options', 'surecart')}>
					<ToggleControl
						label={__('Price Range', 'surecart')}
						help={__(
							'Show a range of prices if multiple prices are available or has variable products.',
							'surecart'
						)}
						checked={range}
						onChange={(range) => setAttributes({ range })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>{getProductDisplayPrice(product?.prices?.data, product?.metrics, range)}</div>
		</>
	);
};
