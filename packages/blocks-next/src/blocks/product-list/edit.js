import TemplateListEdit from '../../components/TemplateListEdit';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	RangeControl,
	Notice,
	Spinner,
	Placeholder,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';
import { InspectorControls, __experimentalGetGapCSSValue as getGapCSSValue } from '@wordpress/block-editor';

const TEMPLATE = [ ['surecart/product-item-v2'] ];

export default ({
	clientId,
	attributes: { style },
	context: { 'surecart/product-list/columns': columns },
}) => {
	const { products, loading } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'product',
			{
				expand: [
					'prices',
					'featured_product_media',
					'product_medias',
					'product_media.media',
					'variants',
				],
				archived: false,
				status: ['published'],
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

	if (loading) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	return (
		<TemplateListEdit
			template={TEMPLATE}
			blockContexts={products?.map((product) => ({
				id: product?.id,
				'surecart/productId': product?.id,
			}))}
			clientId={clientId}
			className="product-item-list"
			style={{
				borderStyle: 'none',
				'--sc-product-item-list-column': columns,
				gap: getGapCSSValue(style?.spacing?.blockGap) || '40px',
			}}
		/>
	);
};
