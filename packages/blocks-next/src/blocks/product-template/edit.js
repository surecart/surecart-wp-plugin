import TemplateListEdit from '../../components/TemplateListEdit';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	Spinner,
	Placeholder,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';
import {
	useBlockProps,
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';

const TEMPLATE = [
	['surecart/product-image'],
	['surecart/product-name'],
	['surecart/product-price-v2'],
];

export default ({
	clientId,
	attributes: { style },
	context: {
		'surecart/product-list/columns': columns,
		'surecart/product-list/limit': limit,
	},
}) => {
	const blockProps = useBlockProps({
		className: 'product-item',
	});
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
				page: 1,
				per_page: limit || 15,
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
			itemProps={blockProps}
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
