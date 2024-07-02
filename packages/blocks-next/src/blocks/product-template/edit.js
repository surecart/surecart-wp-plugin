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
import { list, grid, post } from '@wordpress/icons';
import classnames from 'classnames';
import { useEffect } from '@wordpress/element';

const TEMPLATE = [
	[
		'core/group',
		{},
		[
			['surecart/product-image'],
			[
				'surecart/product-list-title',
				{
					level: 2,
					isLink: false,
					style: {
						typography: { fontSize: '1.25em' },
						spacing: { margin: { top: '5px', bottom: '5px' } },
					},
				},
			],
			['surecart/product-list-price'],
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
