/**
 * External dependencies.
 */
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [
	[
		'core/group',
		{
			style: {
				spacing: {
					blockGap: 'var:preset|spacing|20',
					padding: {
						top: 'var:preset|spacing|40',
						bottom: 'var:preset|spacing|40',
					},
					margin: {
						top: '0',
						bottom: '0',
					},
				},
				border: {
					bottom: {
						color: '#e5e7eb',
						width: '1px',
					},
				},
			},
			layout: {
				type: 'constrained',
			},
		},
		[
			[
				'core/group',
				{
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						justifyContent: 'space-between',
					},
				},
				[
					[
						'core/group',
						{
							style: {
								spacing: {
									blockGap: 'var:preset|spacing|20',
								},
							},
							layout: {
								type: 'flex',
								flexWrap: 'nowrap',
							},
						},
						[
							[
								'surecart/product-review-reviewer-name',
								{
									style: {
										spacing: {
											padding: {
												top: '0',
												bottom: '0',
											},
										},
										typography: {
											fontStyle: 'normal',
											fontWeight: '500',
										},
									},
								},
							],
							[
								'surecart/product-review-verified-badge',
								{
									show_label: true,
									label: 'Verified Buyer',
									icon_size: 16,
									style: {
										typography: {
											fontStyle: 'normal',
											fontWeight: '400',
										},
										spacing: {
											blockGap: 'var:preset|spacing|30',
										},
										layout: {
											selfStretch: 'fit',
											flexSize: null,
										},
									},
									layout: {
										type: 'flex',
										justifyContent: 'center',
										verticalAlignment: 'center',
										orientation: 'horizontal',
									},
								},
							],
						],
					],
					[
						'surecart/product-review-date',
						{
							datetime: '2025-10-02T09:37:00.225Z',
							format: 'human-diff',
						},
					],
				],
			],
			['surecart/product-review-rating-stars', {}],
			[
				'surecart/product-review-title',
				{
					style: {
						typography: {
							fontStyle: 'normal',
							fontWeight: '700',
						},
					},
				},
			],
			['surecart/product-review-content', {}],
		],
	],
];

export default ({ clientId, __unstableLayoutClassNames }) => {
	const demoReviews = [
		{
			id: 1,
			title: { rendered: 'Great product!' },
			body: 'I really enjoyed using this product. Highly recommend!',
			customer: {
				name: 'John Doe',
			},
			stars: 5,
			created_date: '2023-10-01T12:34:56',
		},
		{
			id: 2,
			title: { rendered: 'Not bad' },
			body: 'The product was okay, met my expectations.',
			customer: {
				name: 'Jane Smith',
			},
			stars: 3,
			created_date: '2023-09-15T09:21:30',
		},
		{
			id: 3,
			title: { rendered: 'Excellent quality' },
			body: 'Exceeded my expectations. The quality is outstanding and delivery was fast!',
			customer: {
				name: 'Michael Johnson',
			},
			stars: 5,
			created_date: '2023-10-10T14:45:22',
		},
		{
			id: 4,
			title: { rendered: 'Good value' },
			body: 'Great value for money. Would purchase again.',
			customer: {
				name: 'Sarah Williams',
			},
			stars: 4,
			created_date: '2023-10-05T10:15:08',
		},
		{
			id: 5,
			title: { rendered: 'Could be better' },
			body: 'The product works as described, but I expected more features for the price.',
			customer: {
				name: 'Robert Brown',
			},
			stars: 2,
			created_date: '2023-09-28T16:20:45',
		},
	];

	const className = classnames(__unstableLayoutClassNames, {
		'product-review-list': true,
	});

	return (
		<TemplateListEdit
			template={TEMPLATE}
			blockContexts={demoReviews?.map((review) => ({
				postId: review?.id, // for core blocks.
				id: review?.id,
			}))}
			clientId={clientId}
			className={className}
		/>
	);
};
