/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
	__experimentalUseBorderProps as useBorderProps,
	getTypographyClassesAndStyles as useTypographyProps,
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { list, grid } from '@wordpress/icons';
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [
	[
		'core/group',
		{
			layout: {
				type: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'space-between',
			},
		},
		[
			[
				'core/paragraph',
				{
					content: __('Price Name', 'surecart'),
				},
			],
			[
				'core/paragraph',
				{
					content: __('$10', 'surecart'),
				},
			],
		],
	],
];

export default ({
	attributes,
	setAttributes,
	clientId,
	__unstableLayoutClassNames,
}) => {
	const { layout, style } = attributes;
	const { type: layoutType, columnCount = 2 } = layout || {};
	const shadowProps = useShadowProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const borderProps = useBorderProps(attributes);
	const typographyProps = useTypographyProps(attributes);

	const classes = classnames({
		'sc-choice': true,
		...colorProps.className,
		...spacingProps.className,
		...borderProps.className,
		...typographyProps.className,
		...shadowProps.className,
	});

	const styles = {
		...colorProps.style,
		...spacingProps.style,
		...borderProps.style,
		...typographyProps.style,
		...shadowProps.style,
	};

	const setDisplayLayout = (newDisplayLayout) =>
		setAttributes({
			layout: { ...layout, ...newDisplayLayout },
		});

	return (
		<>
			<BlockControls>
				<ToolbarGroup
					controls={[
						{
							icon: list,
							title: __('List view'),
							onClick: () =>
								setDisplayLayout({ type: 'default' }),
							isActive:
								layoutType === 'default' ||
								layoutType === 'constrained',
						},
						{
							icon: grid,
							title: __('Grid view'),
							onClick: () =>
								setDisplayLayout({
									type: 'grid',
									columnCount,
								}),
							isActive: layoutType === 'grid',
						},
					]}
				/>
			</BlockControls>

			<TemplateListEdit
				className={classnames(__unstableLayoutClassNames, {
					[`columns-${columnCount}`]:
						layoutType === 'grid' && columnCount, // Ensure column count is flagged via classname for backwards compatibility.
					'sc-choices': true,
				})}
				style={{
					gap: getGapCSSValue(style?.spacing?.blockGap),
				}}
				template={TEMPLATE}
				blockContexts={[
					{
						id: 'price1',
						'surecart/price': {
							name: 'One Time',
							display_amount: '$10',
						},
					},
					{
						id: 'price2',
						'surecart/price': {
							name: 'Subscribe & Save',
							display_amount: '$8',
							short_interval_text: '/ mo',
						},
					},
				]}
				itemProps={{
					className: classes,
					style: styles,
				}}
				itemClasses={classes}
				itemStyles={styles}
				clientId={clientId}
			/>
		</>
	);
};
