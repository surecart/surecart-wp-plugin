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
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

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
				[
					[
						'core/cover',
						{
							useFeaturedImage: true,
							dimRatio: 0,
							isUserOverlayColor: true,
							focalPoint: { x: 0.5, y: 0.5 },
							contentPosition: 'top right',
							isDark: false,
							style: {
								dimensions: { aspectRatio: '3/4' },
								layout: { selfStretch: 'fit', flexSize: null },
								spacing: { margin: { bottom: '15px' } },
								border: { radius: '10px' },
							},
							layout: { type: 'default' },
						},
						[
							[
								'surecart/product-sale-badge',
								{
									style: {
										typography: { fontSize: '12px' },
										border: { radius: '100px' },
									},
								},
							],
						],
					],
				],
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
						spacing: { margin: { bottom: '5px', top: '0px' } },
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
						typography: { lineHeight: '1' },
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
		query: {
			perPage,
			include,
			taxQuery,
			postType,
			offset = 0,
			search,
			order,
			orderBy,
		},
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

	// get taxonomies.
	const taxonomies = useSelect((select) =>
		select(coreStore).getTaxonomies({
			type: postType,
			per_page: -1,
			context: 'view',
		})
	);

	// We have to build the tax query for the REST API and use as
	// keys the taxonomies `rest_base` with the `term ids` as values.
	const builtTaxQuery = Object.entries(taxQuery || {}).reduce(
		(accumulator, [taxonomySlug, terms]) => {
			const taxonomy = taxonomies?.find(
				({ slug }) => slug === taxonomySlug
			);
			if (taxonomy?.rest_base) {
				accumulator[taxonomy?.rest_base] = terms;
			}
			return accumulator;
		},
		{}
	);

	const { records: products, isResolving } = useEntityRecords(
		'postType',
		'sc_product',
		{
			page: 1,
			per_page: perPage || 15,
			orderby: orderBy || 'date',
			order: order || 'desc',
			post_status: ['publish'],
			offset: offset || 0,
			...(!!Object.keys(builtTaxQuery).length ? builtTaxQuery : {}),
			...('custom' === type ? { include } : {}),
			...('featured' === type ? { featured: true } : {}),
			...(taxQuery ? taxQuery : {}),
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
				blockContexts={products?.map((product) => ({
					postId: product?.id, // for core blocks.
					postType: 'sc_product', // for core blocks.
					id: product?.id,
				}))}
				clientId={clientId}
				className={className}
			/>
		</>
	);
};
