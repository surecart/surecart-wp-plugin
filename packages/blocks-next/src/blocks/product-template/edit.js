import TemplateListEdit from '../../components/TemplateListEdit';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import {
	Spinner,
	Placeholder,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
	ToolbarGroup,
} from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { list, grid } from '@wordpress/icons';
import classnames from 'classnames';
import { useEffect } from '@wordpress/element';

const TEMPLATE = [
	[
		'core/group',
		{
			layout: { type: 'flex', orientation: 'vertical' },
		},
		[
			[
				'surecart/product-image',
				{
					border: { radius: '6px' },
					style: { spacing: { margin: { bottom: '15px' } } },
				},
			],
			[
				'surecart/product-title',
				{
					level: 2,
					style: {
						typography: {
							fontSize: '15px',
							fontStyle: 'normal',
							fontWeight: '400',
						},
						spacing: { margin: { top: '5px', bottom: '5px' } },
					},
				},
			],
			[
				'core/group',
				{
					style: {
						spacing: {
							blockGap: '0.5em',
							margin: { top: '0px', bottom: '0px' },
						},
						margin: { top: '0px', bottom: '0px' },
					},
					layout: { type: 'flex', flexWrap: 'nowrap' },
				},
				[
					[
						'surecart/product-list-price',
						{
							style: {
								typography: {
									fontSize: '18px',
									fontStyle: 'normal',
									fontWeight: '600',
								},
								spacing: {
									margin: { top: '5px', bottom: '5px' },
								},
							},
						},
					],
					[
						'surecart/product-scratch-price',
						{
							style: {
								typography: {
									fontSize: '18px',
									fontStyle: 'normal',
									fontWeight: '600',
								},
								spacing: {
									margin: { top: '5px', bottom: '5px' },
								},
							},
						},
					],
				],
			],
		],
	],
];

export default ({
	clientId,
	attributes: { layout },
	__unstableLayoutClassNames,
	setAttributes,
	context: {
		'surecart/product-list/limit': limit,
		'surecart/product-list/type': type,
		'surecart/product-list/ids': ids,
		'surecart/product-list/collection_id': collectionId,
	},
}) => {
	const { type: layoutType, columnCount = 3 } = layout || {};

	useEffect(() => {
		if (!layoutType) {
			setDisplayLayout({
				type: 'grid',
				columnCount,
			});
		}
	}, [layoutType]);

	const { records: products, isResolving } = useEntityRecords(
		'postType',
		'sc_product',
		{
			page: 1,
			per_page: limit || 15,
			post_status: ['publish'],
			...(collectionId ? { collection_id: collectionId } : {}),
			...('custom' === type ? { include: ids } : {}),
			...('featured' === type ? { featured: true } : {}),
		}
	);

	const setDisplayLayout = (newDisplayLayout) =>
		setAttributes({
			layout: { ...layout, ...newDisplayLayout },
		});

	const displayLayoutControls = [
		{
			icon: list,
			title: __('List view', 'surecart'),
			onClick: () => setDisplayLayout({ type: 'default' }),
			isActive: layoutType === 'default' || layoutType === 'constrained',
		},
		{
			icon: grid,
			title: __('Grid view', 'surecart'),
			onClick: () =>
				setDisplayLayout({
					type: 'grid',
					columnCount,
				}),
			isActive: layoutType === 'grid',
		},
	];

	if (isResolving) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}
	const className = classnames(__unstableLayoutClassNames, {
		'product-item-list': true,
		[`columns-${columnCount}`]: layoutType === 'grid' && columnCount,
	});

	console.log({ TEMPLATE });

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={displayLayoutControls} />
			</BlockControls>
			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={products?.map((product) => ({
					id: product?.id,
					'surecart/productId': product?.id,
				}))}
				clientId={clientId}
				className={className}
			/>
		</>
	);
};
