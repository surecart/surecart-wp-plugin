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

const ALLOWED_ORDER_BY_VALUES = [
	'author',
	'date',
	'id',
	'include',
	'modified',
	'parent',
	'relevance',
	'slug',
	'include_slugs',
	'title',
	'menu_order',
];

const TEMPLATE = [
	[
		'core/group',
		{
			layout: { type: 'default' },
		},
		[
			[
				'core/group',
				{
					style: {
						color: { background: '#0000000d' },
						border: { radius: '10px' },
						spacing: {
							padding: {
								top: '0px',
								bottom: '0px',
								left: '0px',
								right: '0px',
							},
							margin: { top: '0px', bottom: '0px' },
						},
					},
					layout: { type: 'constrained' },
				},
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
		query: { perPage, offset = 0, search, order, orderBy },
		'surecart/product-list/type': type,
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

	const { records: reviews, isResolving } = useEntityRecords(
		'postType',
		'reviews',
		{
			page: 1,
			per_page: perPage || 15,
			orderby: ALLOWED_ORDER_BY_VALUES.includes(orderBy)
				? orderBy
				: 'date',
			order: order || 'desc',
			status: ['published'],
			offset: offset || 0,
			...(search ? { search } : {}),
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
				blockContexts={reviews?.map((review) => ({
					postId: review?.id, // for core blocks.
					id: review?.id,
				}))}
				clientId={clientId}
				className={className}
			/>
		</>
	);
};
