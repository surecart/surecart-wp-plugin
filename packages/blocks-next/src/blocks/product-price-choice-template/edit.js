/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { memo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
	__experimentalUseBorderProps as useBorderProps,
	getTypographyClassesAndStyles as useTypographyProps,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { list, grid } from '@wordpress/icons';
import classNames from 'classnames';

const TEMPLATE = [
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

function PostTemplateInnerBlocks({ classes, styles }) {
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: {
				'sc-choice': true,
				...classes,
			},
			style: styles,
		},
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <div {...innerBlocksProps} />;
}

function PostTemplateBlockPreview({
	blocks,
	blockContextId,
	isHidden,
	setActiveBlockContextId,
	classes,
	styles,
}) {
	const blockPreviewProps = useBlockPreview({
		blocks,
		props: {
			'sc-choice': true,
		},
	});

	const handleOnClick = () => {
		setActiveBlockContextId(blockContextId);
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<div
			{...blockPreviewProps}
			tabIndex={0}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={handleOnClick}
			style={{ ...styles, ...style }}
			className={classNames(classes, {
				'sc-choice': true,
			})}
		/>
	);
}

const MemoizedPostTemplateBlockPreview = memo(PostTemplateBlockPreview);

export default function PostTemplateEdit({
	attributes,
	setAttributes,
	clientId,
	attributes: { layout },
	__unstableLayoutClassNames,
}) {
	const { type: layoutType, columnCount = 2 } = layout || {};
	const [activeBlockContextId, setActiveBlockContextId] = useState();

	const blocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId),
		[clientId]
	);

	const blockContexts = [
		{ postType: 'post', postId: 1 },
		{ postType: 'post', postId: 2 },
	];

	const blockProps = useBlockProps({
		className: classnames(__unstableLayoutClassNames, {
			[`columns-${columnCount}`]: layoutType === 'grid' && columnCount, // Ensure column count is flagged via classname for backwards compatibility.
			'sc-choices': true,
		}),
	});

	const setDisplayLayout = (newDisplayLayout) =>
		setAttributes({
			layout: { ...layout, ...newDisplayLayout },
		});

	const displayLayoutControls = [
		{
			icon: list,
			title: __('List view'),
			onClick: () => setDisplayLayout({ type: 'default' }),
			isActive: layoutType === 'default' || layoutType === 'constrained',
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
	];

	const { count, style } = attributes;
	const { blockGap } = style?.spacing || {};

	const shadowProps = useShadowProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const borderProps = useBorderProps(attributes);
	const typographyProps = useTypographyProps(attributes);

	const classes = {
		...colorProps.className,
		...spacingProps.className,
		...borderProps.className,
		...typographyProps.className,
		...shadowProps.className,
		[`block-gap-${blockGap}`]: blockGap,
	};

	const styles = {
		...colorProps.style,
		...spacingProps.style,
		...borderProps.style,
		...typographyProps.style,
		...shadowProps.style,
	};

	// To avoid flicker when switching active block contexts, a preview is rendered
	// for each block context, but the preview for the active block context is hidden.
	// This ensures that when it is displayed again, the cached rendering of the
	// block preview is used, instead of having to re-render the preview from scratch.
	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={displayLayoutControls} />
			</BlockControls>

			<div {...blockProps}>
				{blockContexts &&
					blockContexts.map((blockContext) => (
						<BlockContextProvider
							key={blockContext.postId}
							value={blockContext}
						>
							{blockContext.postId ===
							(activeBlockContextId ||
								blockContexts[0]?.postId) ? (
								<PostTemplateInnerBlocks
									classes={classes}
									styles={styles}
								/>
							) : null}
							<MemoizedPostTemplateBlockPreview
								blocks={blocks}
								blockContextId={blockContext.postId}
								classes={classes}
								styles={styles}
								setActiveBlockContextId={
									setActiveBlockContextId
								}
								isHidden={
									blockContext.postId ===
									(activeBlockContextId ||
										blockContexts[0]?.postId)
								}
							/>
						</BlockContextProvider>
					))}
			</div>
		</>
	);
}
