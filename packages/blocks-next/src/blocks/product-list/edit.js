import TemplateListEdit from '../../components/TemplateListEdit';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
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
import { InspectorControls } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'surecart/product-item-v2']
];

export default ({ clientId, attributes: { columns, limit }, setAttributes }) => {
	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					expand: [
						'prices', 
						'featured_product_media', 
						'product_medias', 
						'product_media.media', 
						'variants'
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
		}
	);
	
	const blockContexts = useMemo(
		() =>
		products?.map( ( product ) => ( {
				id: product?.id,
				'surecart/productId': product?.id,
			} ) ),
		[ products ]
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
				<PanelBody title={__('Attributes', 'surecart')}>
					<RangeControl
						label={__('Columns', 'surecart')}
						value={columns}
						onChange={(columns) => setAttributes({ columns })}
						min={1}
						max={10}
					/>
					{columns > 6 && (
						<Notice
							status="warning"
							isDismissible={false}
							css={css`
								margin-bottom: 20px;
							`}
						>
							{__(
								'This column count exceeds the recommended amount and may cause visual breakage.'
							)}
						</Notice>
					)}
					<RangeControl
						label={__('Products Per Page', 'surecart')}
						value={limit}
						onChange={(limit) => setAttributes({ limit })}
						step={1}
						min={1}
						max={40}
					/>
				</PanelBody>
			</InspectorControls>
			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={blockContexts}
				clientId={clientId}
				itemProps={{
					className: 'product-item',
				}}
				className= 'product-item-list'
				style={{
					borderStyle: 'none',
					'--sc-product-item-list-column':
						columns,
					'--sc-product-item-list-gap': '40px',
				}}
			/>
		</>
	);
};
